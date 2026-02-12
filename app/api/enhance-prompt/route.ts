import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { prompt, serverTarget } = await req.json();

        if (!prompt) {
            return Response.json({ error: "Prompt is required" }, { status: 400 });
        }

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
                        error:
                            "Cloud Server EU selected but OLLAMA_CLOUD_BASE_URL and/or OLLAMA_CLOUD_API_KEY are not set.",
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

        const openai = createOpenAI({
            baseURL: ollamaBaseUrl,
            apiKey: ollamaApiKey,
        });

        const { text } = await generateText({
            model: openai(ollamaModel),
            system: `You are an expert AI prompt engineer. Your goal is to rewrite the user's input into a precise, actionable, and robust instruction for an autonomous web agent.
      
      The agent uses a headless browser to interact with websites.
      The prompt should be direct (e.g., "Go to X, click Y, extract Z").
      Remove ambiguity.
      If the user provides a vague goal (e.g., "book a flight"), expand it into logical steps or ask for clarity (but prefer to infer reasonable defaults).
      
      Return ONLY the optimized prompt text. Do not add conversational filler.`,
            prompt: prompt,
        });

        return Response.json({ optimizedPrompt: text.trim() });
    } catch (error) {
        console.error("Prompt optimization failed:", error);
        return Response.json(
            { error: "Failed to optimize prompt" },
            { status: 500 }
        );
    }
}
