import { createOpenAI } from "@ai-sdk/openai";
import { playwrightExecuteTool } from "@onkernel/ai-sdk";
import { Kernel } from "@onkernel/sdk";
import { Experimental_Agent as Agent, stepCountIs, tool, zodSchema } from "ai";
import { z } from "zod";

export const maxDuration = 300; // 5 minutes timeout for long-running agent operations
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function safeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

async function normalizeToSinglePage(kernel: Kernel, sessionId: string) {
  try {
    await kernel.browsers.playwright.execute(sessionId, {
      timeout_sec: 20,
      code: `
const pages = context.pages();
if (!pages.length) {
  return { pageCountBefore: 0, pageCountAfter: 0 };
}

// Inject a visual cursor for real-time simulation
const cursorScript = \`
  const cursorId = 'ai-mouse-cursor';
  let cursor = document.getElementById(cursorId);
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = cursorId;
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.background = 'rgba(255, 0, 0, 0.4)';
    cursor.style.border = '2px solid red';
    cursor.style.zIndex = '2147483647';
    cursor.style.pointerEvents = 'none';
    cursor.style.transition = 'top 0.1s ease-out, left 0.1s ease-out';
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    cursor.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
    document.body.appendChild(cursor);
  }

  window.updateAiCursor = (x, y) => {
    const cursor = document.getElementById(cursorId);
    if (cursor) {
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
    }
  };
\`;
await context.addInitScript(cursorScript);

// Also inject into current pages
for (const page of pages) {
  try {
    await page.evaluate(cursorScript);
  } catch {}
}

const primaryPage =
  pages.find(
    (p) =>
      !p.url().startsWith("chrome-extension://") &&
      p.url() !== "about:blank"
  ) ?? pages[0];

for (const currentPage of pages) {
  if (currentPage !== primaryPage) {
    try {
      await currentPage.close();
    } catch {}
  }
}

try {
  await primaryPage.bringToFront();
} catch {}

return {
  pageCountBefore: pages.length,
  pageCountAfter: context.pages().length,
  primaryUrl: primaryPage.url(),
};
      `,
    });
  } catch (error) {
    console.warn("Failed to normalize browser pages before agent run:", error);
  }
}

export async function POST(req: Request) {
  try {
    const {
      sessionId,
      task,
      serverTarget,
      stream,
      lagMsMin,
      lagMsMax,
    } = await req.json();

    if (!sessionId || !task) {
      return Response.json(
        { error: "Missing sessionId or task" },
        { status: 400 }
      );
    }

    const apiKey = process.env.KERNEL_API_KEY;
    const requestedServerTarget =
      serverTarget === "cloud-eu" ? "cloud-eu" : "vps";

    let ollamaBaseUrl: string;
    let ollamaApiKey: string;
    let ollamaModel: string;

    if (requestedServerTarget === "cloud-eu") {
      const cloudBaseUrl = process.env.OLLAMA_CLOUD_BASE_URL;
      const cloudApiKey = process.env.OLLAMA_CLOUD_API_KEY;
      if (!cloudBaseUrl || !cloudApiKey) {
        return Response.json(
          {
            success: false,
            error:
              "Cloud Server EU selected but OLLAMA_CLOUD_BASE_URL and/or OLLAMA_CLOUD_API_KEY are not set. Add these env vars or use VPS Self-Hosted.",
          },
          { status: 400 }
        );
      }
      ollamaBaseUrl = cloudBaseUrl;
      ollamaApiKey = cloudApiKey || "ollama";
      ollamaModel =
        process.env.OLLAMA_CLOUD_MODEL || "kimi-k2-thinking:cloud";
    } else {
      ollamaBaseUrl =
        process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1";
      ollamaApiKey = process.env.OLLAMA_API_KEY || "ollama";
      ollamaModel = process.env.OLLAMA_MODEL || "kimi-k2-thinking:cloud";
    }

    if (!apiKey) {
      return Response.json(
        { error: "KERNEL_API_KEY environment variable is not set" },
        { status: 400 }
      );
    }

    const kernel = new Kernel({ apiKey });
    await normalizeToSinglePage(kernel, sessionId);
    const ollama = createOpenAI({
      baseURL: ollamaBaseUrl,
      apiKey: ollamaApiKey || "ollama",
      name: "ollama",
    });

	    const computer_capture_screenshot = tool({
	      description:
	        "Capture a PNG screenshot of the current browser window. Returns a data URL (base64 PNG).",
	      inputSchema: zodSchema(
	        z.object({
	          region: z
	            .object({
	              x: z.number().int(),
	              y: z.number().int(),
	              width: z.number().int().positive(),
	              height: z.number().int().positive(),
	            })
	            .optional(),
	        })
	      ),
	      execute: async ({ region }) => {
	        const response = await kernel.browsers.computer.captureScreenshot(
	          sessionId,
	          region ? { region } : {}
	        );
        const bytes = new Uint8Array(await response.arrayBuffer());
        // Node runtime: Buffer is available.
        const base64 = Buffer.from(bytes).toString("base64");
        return {
          mimeType: "image/png",
          dataUrl: `data:image/png;base64,${base64}`,
        };
      },
    });

	    const computer_move_mouse = tool({
	      description:
	        "Move the host mouse cursor to screen coordinates (x, y) inside the live browser view.",
	      inputSchema: zodSchema(
	        z.object({
	          x: z.number().int(),
	          y: z.number().int(),
	          hold_keys: z.array(z.string()).optional(),
	        })
	      ),
	      execute: async (params) => {
	        await kernel.browsers.computer.moveMouse(sessionId, params);
	        return { ok: true };
	      },
	    });

	    const computer_click_mouse = tool({
	      description:
	        "Click the mouse at screen coordinates (x, y) inside the live browser view.",
	      inputSchema: zodSchema(
	        z.object({
	          x: z.number().int(),
	          y: z.number().int(),
	          button: z
	            .enum(["left", "right", "middle", "back", "forward"])
	            .optional(),
	          click_type: z.enum(["down", "up", "click"]).optional(),
	          hold_keys: z.array(z.string()).optional(),
	          num_clicks: z.number().int().positive().optional(),
	        })
	      ),
	      execute: async (params) => {
	        await kernel.browsers.computer.clickMouse(sessionId, params);
	        return { ok: true };
	      },
	    });

	    const computer_drag_mouse = tool({
	      description:
	        "Drag the mouse along a path of screen coordinates inside the live browser view.",
	      inputSchema: zodSchema(
	        z.object({
	          path: z.array(z.array(z.number().int()).length(2)).min(2),
	          button: z.enum(["left", "middle", "right"]).optional(),
	          delay: z.number().int().nonnegative().optional(),
	          hold_keys: z.array(z.string()).optional(),
	          step_delay_ms: z.number().int().nonnegative().optional(),
	          steps_per_segment: z.number().int().min(1).optional(),
	        })
	      ),
	      execute: async (params) => {
	        await kernel.browsers.computer.dragMouse(sessionId, params);
	        return { ok: true };
	      },
	    });

	    const computer_scroll = tool({
	      description:
	        "Scroll at screen position (x, y) inside the live browser view.",
	      inputSchema: zodSchema(
	        z.object({
	          x: z.number().int(),
	          y: z.number().int(),
	          delta_x: z.number().int().optional(),
	          delta_y: z.number().int().optional(),
	          hold_keys: z.array(z.string()).optional(),
	        })
	      ),
	      execute: async (params) => {
	        await kernel.browsers.computer.scroll(sessionId, params);
	        return { ok: true };
	      },
	    });

	    const computer_type_text = tool({
	      description: "Type text into the focused element in the live browser view.",
	      inputSchema: zodSchema(
	        z.object({
	          text: z.string(),
	          delay: z.number().int().nonnegative().optional(),
	        })
	      ),
	      execute: async (params) => {
	        await kernel.browsers.computer.typeText(sessionId, params);
	        return { ok: true };
	      },
	    });

	    const computer_press_key = tool({
	      description:
	        "Press one or more keys in the live browser view (xdotool-style keysyms, e.g. Return, Ctrl+t).",
	      inputSchema: zodSchema(
	        z.object({
	          keys: z.array(z.string()).min(1),
	          duration: z.number().int().nonnegative().optional(),
	          hold_keys: z.array(z.string()).optional(),
	        })
	      ),
	      execute: async (params) => {
	        await kernel.browsers.computer.pressKey(sessionId, params);
	        return { ok: true };
	      },
	    });

	    const computer_set_cursor_visibility = tool({
	      description: "Show or hide the host cursor in the live browser view.",
	      inputSchema: zodSchema(
	        z.object({
	          hidden: z.boolean(),
	        })
	      ),
	      execute: async (params) => {
	        return await kernel.browsers.computer.setCursorVisibility(
	          sessionId,
	          params
        );
      },
    });

    // Initialize the AI agent with an Ollama model
    const agent = new Agent({
      model: ollama(ollamaModel),
      tools: {
        playwright_execute: playwrightExecuteTool({
          client: kernel,
          sessionId: sessionId,
        }),
        computer_capture_screenshot,
        computer_move_mouse,
        computer_click_mouse,
        computer_drag_mouse,
        computer_scroll,
        computer_type_text,
        computer_press_key,
        computer_set_cursor_visibility,
      },
      stopWhen: stepCountIs(20),
      system: `You are the Eburon Autonomous Agent, a browser automation expert operating inside a disposable, sandboxed environment with access to a Playwright execution tool.
      
      IMPORTANT: You must ALWAYS respond in English, regardless of the user's language or the website's content. All reasoning, explanations, and tool outputs must be in English.
      
      Available tools:
Available tools:
- playwright_execute: Executes JavaScript/Playwright code in the browser. Has access to 'page', 'context', and 'browser' objects. Returns the result of your code.
- computer_capture_screenshot: Captures a screenshot of the live browser view (data URL).
- computer_move_mouse / computer_click_mouse / computer_drag_mouse / computer_scroll: Host-level mouse control inside the live browser view.
- computer_type_text / computer_press_key: Host-level keyboard input inside the live browser view.
- computer_set_cursor_visibility: Shows/hides the host cursor.

When given a task:
1. If no URL is provided, FIRST get the current page context:
   return { url: page.url(), title: await page.title() }
2. If a URL is provided, navigate to it using page.goto()
3. Use appropriate selectors (page.locator, page.getByRole, etc.) to interact with elements.
4. **REAL-TIME SIMULATION (MANDATORY):**
   - Prefer Playwright for reliable element targeting and navigation.
   - When you need visible "computer-like" interaction in the live view, use the computer_* tools (move mouse, click, type, press keys).
   - If you use Playwright mouse movement, keep the injected visual cursor updated too.
   - You MUST strictly follow this pattern for EVERY interaction:
     \`\`\`javascript
     const element = page.locator('selector');
     const box = await element.boundingBox();
     if (box) {
       const x = box.x + box.width / 2;
       const y = box.y + box.height / 2;
       
       // 1. Update visual cursor (injected in page)
       await page.evaluate(({x, y}) => window.updateAiCursor(x, y), {x, y});
       
       // 2. Move Playwright mouse smoothly
       await page.mouse.move(x, y, { steps: 25 });
       
       // 3. Hover (optional but recommended for realism)
       await element.hover();
       
       // 4. Click
       await page.mouse.click(x, y);
     }
     
     // Always return the result of your action
     return { 
       url: page.url(), 
       title: await page.title(),
       content: (await page.content()).slice(0, 1000) 
     };
     \`\`\`
5. Safely handle authentication flows when the user explicitly provides credentials (for example, filling login forms), but never attempt to obtain or exfiltrate secrets the user did not clearly request or supply.
6. Always return the requested data from your code execution.
7. Keep the session to a single active browser page/tab unless the user explicitly asks for multiple tabs or popups.
8. Never call context.newPage() or open new windows unless explicitly requested; if a popup/new tab appears, close the extra page and continue on the main page.

Behavior:
- Break complex tasks into small, focused executions rather than writing long scripts.
- After each tool call, clearly describe in natural language what you clicked, typed, or observed so users can understand the simulation steps.
- Prefer reusing the existing page for navigation and interactions to avoid duplicate browser windows.
- Execute tasks autonomously without asking clarifying questions when possible, making reasonable assumptions while respecting security, privacy, and website terms of service.`,
    });

    const accept = req.headers.get("accept") ?? "";
    const shouldStream = stream === true || accept.includes("text/event-stream");
    if (shouldStream) {
      const encoder = new TextEncoder();

      const minLag =
        typeof lagMsMin === "number" && Number.isFinite(lagMsMin)
          ? Math.max(0, Math.floor(lagMsMin))
          : 35;
      const maxLag =
        typeof lagMsMax === "number" && Number.isFinite(lagMsMax)
          ? Math.max(minLag, Math.floor(lagMsMax))
          : 120;

      const streamResult = agent.stream({ prompt: task });

      let stepNumber = 0;
      const detailedSteps: Array<{
        stepNumber: number;
        finishReason: string | null;
        content: any[];
      }> = [];

      const ensureStep = () => {
        if (stepNumber <= 0) {
          stepNumber = 1;
        }
        while (detailedSteps.length < stepNumber) {
          detailedSteps.push({
            stepNumber: detailedSteps.length + 1,
            finishReason: null,
            content: [],
          });
        }
        return detailedSteps[stepNumber - 1];
      };

      let fullText = "";

      const body = new ReadableStream<Uint8Array>({
        async start(controller) {
          controller.enqueue(
            encoder.encode(
              sse("init", {
                sessionId,
                serverTarget: requestedServerTarget,
                lagMsMin: minLag,
                lagMsMax: maxLag,
              })
            )
          );

          try {
            for await (const part of streamResult.fullStream) {
              if (part.type === "start-step") {
                stepNumber += 1;
                ensureStep();
              }

              if (part.type === "finish-step") {
                const step = ensureStep();
                step.finishReason = part.finishReason ?? null;
              }

              if (part.type === "text-delta") {
                // Split into smaller chunks to make streaming visibly "laggy".
                const chunks = part.text.split(/(\s+)/).filter((c) => c.length);
                for (const chunk of chunks) {
                  fullText += chunk;
                  const lag =
                    minLag + Math.floor(Math.random() * (maxLag - minLag + 1));
                  await sleep(lag);
                  controller.enqueue(
                    encoder.encode(
                      sse("text-delta", {
                        id: part.id,
                        text: chunk,
                        providerMetadata: (part as any).providerMetadata,
                      })
                    )
                  );
                }
                continue;
              }

              if (part.type === "tool-call") {
                const step = ensureStep();
                step.content.push({
                  type: "tool-call",
                  toolCallId: (part as any).toolCallId,
                  toolName: (part as any).toolName,
                  input: (part as any).args ?? null,
                });
              }

              if (part.type === "tool-result") {
                const step = ensureStep();
                step.content.push({
                  type: "tool-result",
                  toolCallId: (part as any).toolCallId,
                  toolName: (part as any).toolName,
                  result: (part as any).result,
                  success: true,
                });
              }

              if (part.type === "tool-error") {
                const step = ensureStep();
                step.content.push({
                  type: "tool-result",
                  toolCallId: (part as any).toolCallId,
                  toolName: (part as any).toolName,
                  result: null,
                  success: false,
                  error: safeError((part as any).error),
                });
              }

              const payload =
                part.type === "error"
                  ? { ...part, error: safeError((part as any).error) }
                  : part;

              controller.enqueue(encoder.encode(sse(part.type, payload)));

              if (part.type === "finish") {
                controller.enqueue(
                  encoder.encode(
                    sse("final", {
                      success: true,
                      response: fullText,
                      detailedSteps,
                      stepCount: detailedSteps.length,
                      serverTarget: requestedServerTarget,
                      totalUsage: (part as any).totalUsage ?? null,
                    })
                  )
                );
              }
            }
          } catch (err) {
            controller.enqueue(
              encoder.encode(
                sse("final", {
                  success: false,
                  error: safeError(err),
                  serverTarget: requestedServerTarget,
                })
              )
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Execute the agent with the user's task
    const { text, steps, usage } = await agent.generate({
      prompt: task,
    });

    // Extract detailed step information from step.content[] array
    const detailedSteps = steps.map((step, index) => {
      const stepData = step as any;
      const content = stepData.content || [];

      // Process each content item based on its type
      const processedContent = content.map((item: any) => {
        if (item.type === "tool-call") {
          return {
            type: "tool-call" as const,
            toolCallId: item.toolCallId,
            toolName: item.toolName,
            input: item.input ?? null,
            code: item.input?.code || null,
          };
        } else if (item.type === "tool-result") {
          return {
            type: "tool-result" as const,
            toolCallId: item.toolCallId,
            toolName: item.toolName,
            result: item.result?.result,
            success: item.result?.success ?? true,
            error: item.result?.error,
          };
        } else if (item.type === "text") {
          return {
            type: "text" as const,
            text: item.text,
          };
        }
        return item;
      });

      return {
        stepNumber: index + 1,
        finishReason: stepData.finishReason || null,
        content: processedContent,
      };
    });

    // Collect all executed code from the steps (for backward compatibility)
    const executedCodes = detailedSteps.flatMap((step) =>
      step.content
        .filter((item: any) => item.type === "tool-call" && item.code)
        .map((item: any) => {
          // Find matching result
          const result = step.content.find(
            (r: any) =>
              r.type === "tool-result" && r.toolCallId === item.toolCallId
          );
          return {
            code: item.code,
            success: result?.success ?? true,
            result: result?.result,
            error: result?.error,
          };
        })
    );

    return Response.json({
      success: true,
      response: text,
      executedCodes,
      detailedSteps,
      stepCount: steps.length,
      usage,
      serverTarget: requestedServerTarget,
    });
  } catch (error: any) {
    console.error("Agent execution error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to execute agent",
      },
      { status: 500 }
    );
  }
}
