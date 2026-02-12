"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ListTree,
  Mic,
  X,
  Pause,
  Square,
  MousePointer2,
  Settings,
} from "lucide-react";
import { useRef, useState } from "react";
import { StepsOverlay } from "@/components/StepsOverlay";

interface BrowserSession {
  sessionId: string;
  liveViewUrl: string;
  cdpWsUrl: string;
  spinUpTime: number;
}

interface ExecutedCode {
  code: string;
  success: boolean;
  result?: any;
  error?: string;
}

interface StepContentItem {
  type: "tool-call" | "tool-result" | "text";
  toolCallId?: string;
  toolName?: string;
  code?: string;
  input?: any;
  result?: any;
  success?: boolean;
  error?: any;
  text?: string;
}

interface DetailedStep {
  stepNumber: number;
  finishReason: string | null;
  content: StepContentItem[];
}

interface AutomationResult {
  success: boolean | null;
  response?: string;
  executedCodes?: ExecutedCode[];
  detailedSteps?: DetailedStep[];
  stepCount?: number;
  timestamp: number;
  error?: string;
  task?: string;
  serverTarget?: "vps" | "cloud-eu";
}

export default function HomePage() {
  const createBrowserRequestInFlight = useRef(false);
  const [creatingBrowser, setCreatingBrowser] = useState(false);
  const [runningAutomation, setRunningAutomation] = useState(false);
  const [closingBrowser, setClosingBrowser] = useState(false);
  const [browserSession, setBrowserSession] = useState<BrowserSession | null>(
    null
  );
  const [automationResults, setAutomationResults] = useState<
    AutomationResult[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [task, setTask] = useState("Go to https://eburon.ai/ and create a blog post");
  const [stepsOverlayResult, setStepsOverlayResult] = useState<AutomationResult | null>(null);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [serverTarget, setServerTarget] = useState<"vps" | "cloud-eu">("vps");

  const totalRuns = automationResults.length;
  const successfulRuns = automationResults.filter(
    (result) => result.success === true
  ).length;
  const lastResult = automationResults[0];
  const lastStepCount = lastResult?.stepCount ?? 0;
  const lastClickCount =
    lastResult?.detailedSteps?.reduce(
      (sum, step) =>
        sum +
        step.content.filter((item: any) => item.type === "tool-call").length,
      0
    ) ?? 0;

  const createBrowser = async () => {
    if (
      createBrowserRequestInFlight.current ||
      creatingBrowser ||
      !!browserSession
    ) {
      return;
    }

    createBrowserRequestInFlight.current = true;
    setCreatingBrowser(true);
    setError(null);
    setDeployUrl(null);

    try {
      const response = await fetch("/api/create-browser", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setBrowserSession({
          sessionId: data.sessionId,
          liveViewUrl: data.liveViewUrl,
          cdpWsUrl: data.cdpWsUrl,
          spinUpTime: data.spinUpTime,
        });
      } else {
        if (data.error === "MISSING_API_KEY" && data.deployUrl) {
          setDeployUrl(data.deployUrl);
        }
        setError(data.message || data.error || "Failed to create browser");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to API"
      );
    } finally {
      setCreatingBrowser(false);
      createBrowserRequestInFlight.current = false;
    }
  };

  const runAutomation = async () => {
    if (!browserSession || !task.trim()) return;

    setRunningAutomation(true);

    const runTimestamp = Date.now();
    const runTask = task.trim();

    // Insert a placeholder result immediately so the UI can stream into it.
    setAutomationResults((prev) => [
      {
        success: null,
        response: "",
        detailedSteps: [],
        stepCount: 0,
        error: undefined,
        task: runTask,
        serverTarget,
        timestamp: runTimestamp,
      },
      ...prev,
    ]);

    const patchRun = (patch: Partial<AutomationResult>) => {
      setAutomationResults((prev) =>
        prev.map((r) =>
          r.timestamp === runTimestamp ? { ...r, ...patch } : r
        )
      );
    };

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          sessionId: browserSession.sessionId,
          task: runTask,
          serverTarget,
          stream: true,
          lagMsMin: 35,
          lagMsMax: 140,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (response.ok && contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const handleEvent = (event: string, data: any) => {
          if (event === "text-delta" && typeof data?.text === "string") {
            setAutomationResults((prev) =>
              prev.map((r) =>
                r.timestamp === runTimestamp
                  ? { ...r, response: (r.response ?? "") + data.text }
                  : r
              )
            );
            return;
          }

          if (event === "start-step") {
            setAutomationResults((prev) =>
              prev.map((r) =>
                r.timestamp === runTimestamp
                  ? { ...r, stepCount: (r.stepCount ?? 0) + 1 }
                  : r
              )
            );
            return;
          }

          if (event === "final") {
            patchRun({
              success: data?.success ?? false,
              response: data?.response ?? "",
              detailedSteps: data?.detailedSteps ?? [],
              stepCount: data?.stepCount ?? undefined,
              error: data?.error?.message ?? data?.error ?? undefined,
              serverTarget: data?.serverTarget ?? serverTarget,
            });

            if (data?.success) {
              setTask("");
            }
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let splitIndex: number;
          while ((splitIndex = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, splitIndex);
            buffer = buffer.slice(splitIndex + 2);

            let eventName = "message";
            let dataStr = "";
            for (const line of rawEvent.split("\n")) {
              if (line.startsWith("event:")) {
                eventName = line.slice("event:".length).trim();
              } else if (line.startsWith("data:")) {
                dataStr += line.slice("data:".length).trim();
              }
            }

            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              handleEvent(eventName, parsed);
            } catch {
              // Ignore malformed frames; keep streaming.
            }
          }
        }

        return;
      }

      const data = await response.json();

      const result: AutomationResult = {
        success: data.success ?? false,
        response: data.response,
        executedCodes: data.executedCodes,
        detailedSteps: data.detailedSteps,
        stepCount: data.stepCount,
        error: data.error,
        task: runTask,
        serverTarget: data.serverTarget ?? serverTarget,
        timestamp: runTimestamp,
      };

      setAutomationResults((prev) =>
        prev.map((r) => (r.timestamp === runTimestamp ? result : r))
      );

      // Clear the task input after successful execution
      if (data.success) {
        setTask("");
      }
    } catch (err) {
      patchRun({
        success: false,
        error: "Failed to run Eburon agent",
      });
    } finally {
      setRunningAutomation(false);
    }
  };

  const closeBrowser = async () => {
    if (!browserSession) return;

    setClosingBrowser(true);

    try {
      const response = await fetch("/api/delete-browser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: browserSession.sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear browser session and reset state
        setBrowserSession(null);
        setAutomationResults([]);
        setTask("Go to https://eburon.ai/ and create a blog post");
      } else {
        setError(data.error || "Failed to close browser");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to close browser"
      );
    } finally {
      setClosingBrowser(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${browserSession ? 'lg:h-screen lg:overflow-hidden' : ''}`}>
      {/* Radial Glow Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Content */}
      <section
        className={`relative z-10 flex-grow ${browserSession
            ? "py-3 lg:py-4 lg:flex-grow lg:min-h-0"
            : "py-8 sm:py-10 flex items-center"
          }`}
      >
        <div
          className={`mx-auto px-4 h-full ${browserSession ? "max-w-[1920px] w-full" : "container max-w-3xl"
            }`}
        >
          <div className={`space-y-8 ${!browserSession ? "text-center" : ""}`}>
            {/* Top description (hide once sandbox is active) */}
            {!browserSession && (
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  Eburon Autonomous Agent
                </h1>
                <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
                  Launch a disposable sandbox browser and run autonomous web simulations in seconds.
                </p>
              </div>
            )}

            {/* Simulation summary — only shown on mobile/tablet when session is active */}
            {automationResults.length > 0 && (
              <Card className="lg:hidden">
                <CardContent className="py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Total simulations</p>
                      <p className="font-mono text-base sm:text-lg font-semibold">
                        {totalRuns}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Successful</p>
                      <p className="font-mono text-base sm:text-lg font-semibold">
                        {successfulRuns}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Last run steps</p>
                      <p className="font-mono text-base sm:text-lg font-semibold">
                        {lastStepCount}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Last run clicks</p>
                      <p className="font-mono text-base sm:text-lg font-semibold">
                        {lastClickCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-8">
              {/* Step 1: Create Browser / Sandbox */}
              {!browserSession && (
                <div className="space-y-3 text-center">
                  <Button
                    variant="vercel"
                    size="lg"
                    onClick={createBrowser}
                    disabled={creatingBrowser}
                    className="text-base px-8 py-6 h-auto font-semibold w-full sm:w-auto"
                  >
                    {creatingBrowser ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Sandbox Browser...
                      </>
                    ) : (
                      <>
                        Create Sandbox Browser
                        <span className="ml-1">→</span>
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-600">
                    Creates an isolated browser sandbox you can freely automate.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="relative w-full max-w-md aspect-video rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden">
                      <div className="absolute inset-3 rounded-xl border border-slate-700/60 bg-slate-900/90 overflow-hidden">
                        <div className="absolute inset-0 sandbox-demo-stage">
                          <div className="sandbox-demo-window sandbox-demo-main absolute left-3 right-3 top-3 rounded-lg border border-slate-600/70 bg-slate-900/95 overflow-hidden">
                            <div className="h-6 border-b border-slate-700/70 bg-slate-800/95 px-2 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-red-400/80" />
                              <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                              <span className="ml-2 h-3 w-20 rounded-full bg-slate-700/90" />
                            </div>
                            <div className="p-2 space-y-1.5">
                              <div className="h-2.5 rounded bg-slate-700/80" />
                              <div className="h-2.5 w-4/5 rounded bg-slate-800/80" />
                              <div className="h-12 rounded-md bg-slate-800/60" />
                              <div className="grid grid-cols-3 gap-1.5">
                                <div className="h-8 rounded bg-slate-800/70" />
                                <div className="h-8 rounded bg-slate-800/60" />
                                <div className="h-8 rounded bg-slate-800/50" />
                              </div>
                            </div>
                          </div>

                          <div className="sandbox-demo-window sandbox-demo-popup absolute right-5 top-8 w-32 sm:w-36 rounded-md border border-cyan-400/30 bg-slate-900/95 overflow-hidden shadow-lg shadow-cyan-500/20">
                            <div className="h-5 border-b border-slate-700/70 bg-slate-800/95 px-2 flex items-center">
                              <span className="h-2 w-8 rounded-full bg-cyan-300/60" />
                            </div>
                            <div className="p-2 space-y-1">
                              <div className="h-2 rounded bg-slate-700/80" />
                              <div className="h-2 w-5/6 rounded bg-slate-800/70" />
                              <div className="h-8 rounded bg-slate-800/60" />
                            </div>
                          </div>

                          <div className="absolute left-3 right-3 bottom-2 h-8 rounded-md border border-slate-700/70 bg-black/50 px-2 flex items-center gap-2">
                            <div className="sandbox-demo-dock-icon h-5 w-5 rounded bg-cyan-400/70 shadow-md shadow-cyan-400/30" />
                            <div className="h-5 w-5 rounded bg-violet-400/60" />
                            <div className="h-5 w-5 rounded bg-emerald-400/60" />
                          </div>

                          <div className="sandbox-demo-cursor pointer-events-none absolute">
                            <MousePointer2 className="h-4 w-4 text-white drop-shadow-lg" />
                            <span className="sandbox-demo-click absolute left-3 top-3 h-2.5 w-2.5 rounded-full border border-cyan-300/80" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-4 left-1/2 h-4 w-20 -translate-x-1/2 rounded-b-3xl bg-slate-800" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && !browserSession && (
                <Card className="text-left max-w-xl mx-auto">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold">Error</span>
                      </div>
                      <p className="font-mono text-sm text-red-600">{error}</p>
                      {deployUrl && (
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground mb-3">
                            Deploy this template with the Maximus integration to get started:
                          </p>
                          <a
                            href={deployUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <img
                              src="https://vercel.com/button"
                              alt="Deploy with Vercel"
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Live View and Automation Controls — Desktop: split panel */}
              {browserSession && (
                <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] lg:gap-4 lg:h-[calc(100vh-5rem)] space-y-6 lg:space-y-0">

                  {/* ── LEFT PANEL (Chat-like Interface) ── */}
                  <div className="order-2 lg:order-1 flex flex-col lg:h-[calc(100vh-5rem)] border-t lg:border-t-0 lg:border-r bg-background lg:overflow-hidden">

                    {/* Header: Title + Settings + Stats */}
                    <div className="flex items-center justify-between p-3 border-b shrink-0 bg-muted/5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Session History</span>
                        {automationResults.length > 0 && (
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {successfulRuns}/{totalRuns} runs
                          </Badge>
                        )}
                      </div>

                      <div className="relative z-20">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowServerSettings(!showServerSettings)}
                          title="Server Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>

                        {/* Settings Popover */}
                        {showServerSettings && (
                          <div className="absolute right-0 top-9 w-64 rounded-lg border bg-popover p-4 shadow-md text-popover-foreground animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <h4 className="font-medium leading-none">Server Settings</h4>
                                <p className="text-xs text-muted-foreground">Choose your LLM backend.</p>
                              </div>
                              <div className="grid gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setServerTarget("vps"); setShowServerSettings(false); }}
                                  className={`rounded-md border p-2 text-left text-sm transition ${serverTarget === "vps"
                                      ? "border-emerald-500 bg-emerald-500/10"
                                      : "hover:bg-muted"
                                    }`}
                                >
                                  <div className="font-medium">VPS Self-Hosted</div>
                                  <div className="text-[10px] text-muted-foreground">Local/Private OLLAMA_BASE_URL</div>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setServerTarget("cloud-eu"); setShowServerSettings(false); }}
                                  className={`rounded-md border p-2 text-left text-sm transition ${serverTarget === "cloud-eu"
                                      ? "border-blue-500 bg-blue-500/10"
                                      : "hover:bg-muted"
                                    }`}
                                >
                                  <div className="font-medium">Cloud Server EU</div>
                                  <div className="text-[10px] text-muted-foreground">Hosted OLLAMA_CLOUD</div>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scrollable History List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 bg-muted/5 scrollbar-thin scrollbar-thumb-border">
                      {automationResults.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground opacity-50 space-y-2">
                          <MousePointer2 className="w-8 h-8 opacity-20" />
                          <p className="text-sm">Ready to automate. Enter a task below.</p>
                        </div>
                      )}

                      {/* Render results (Newest First) */}
                      {automationResults.map((result, index) => (
                        <Card key={result.timestamp} className="text-left border-muted-foreground/20 shadow-sm">
                          <CardContent className="p-3">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {result.success === null ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                      <span className="text-xs font-semibold">
                                        Run #{automationResults.length - index} Running...
                                      </span>
                                    </>
                                  ) : result.success ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                      <span className="text-xs font-semibold">
                                        Run #{automationResults.length - index}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                                      <span className="text-xs font-semibold">
                                        Run #{automationResults.length - index} Failed
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(result.timestamp).toLocaleTimeString()}
                                </span>
                              </div>

                              {result.task && (
                                <div className="p-2 bg-muted/50 rounded text-xs">
                                  <span className="font-medium text-muted-foreground">Task: </span>
                                  {result.task}
                                </div>
                              )}

                              {result.success === null ? (
                                <div className="space-y-2">
                                  {result.response !== undefined && (
                                    <div className="prose prose-xs dark:prose-invert max-w-none">
                                      <p className="text-xs whitespace-pre-wrap leading-relaxed">
                                        {result.response || <span className="animate-pulse">Thinking...</span>}
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <Badge variant="outline" className="text-[10px] h-5">
                                      {result.stepCount ?? 0} steps
                                    </Badge>
                                    {result.serverTarget && (
                                      <Badge variant="secondary" className="text-[10px] h-5 opacity-70">
                                        {result.serverTarget === "vps" ? "VPS" : "Cloud"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ) : result.success ? (
                                <div className="space-y-2">
                                  {result.response && (
                                    <div className="prose prose-xs dark:prose-invert max-w-none">
                                      <p className="text-xs whitespace-pre-wrap leading-relaxed text-foreground/90">{result.response}</p>
                                    </div>
                                  )}

                                  {result.stepCount !== undefined && (
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                      <Badge variant="outline" className="text-[10px] h-5">
                                        {result.stepCount} steps
                                      </Badge>
                                      {result.detailedSteps && result.detailedSteps.length > 0 && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setStepsOverlayResult(result)}
                                          className="ml-auto h-6 text-[10px] px-2 hover:bg-muted"
                                        >
                                          <ListTree className="w-3 h-3 mr-1" />
                                          Details
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded">
                                  {result.error}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Fixed Bottom Input */}
                    <div className="p-3 bg-background border-t space-y-3 shrink-0">
                      <div className="relative">
                        <Textarea
                          id="task-input"
                          value={task}
                          onChange={(e) => setTask(e.target.value)}
                          placeholder={
                            automationResults.length > 0
                              ? "What's next?"
                              : "e.g. Go to google.com and search for AI agents"
                          }
                          disabled={runningAutomation}
                          className="min-h-[80px] text-sm resize-none pr-10 shadow-sm focus-visible:ring-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              runAutomation();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-2 bottom-2 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                          onClick={() => { }}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="default"
                          onClick={runAutomation}
                          disabled={runningAutomation || !task.trim()}
                          className="flex-1 font-medium"
                        >
                          {runningAutomation ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Running...
                            </>
                          ) : (
                            "Run Agent"
                          )}
                        </Button>

                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => { }} // Pause placeholder
                            disabled={!runningAutomation}
                            title="Pause"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={closeBrowser}
                            disabled={closingBrowser || runningAutomation}
                            title="Close Session"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            {closingBrowser ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT PANEL (browser iframe) ── */}
                  <div className="order-1 lg:order-2 lg:min-h-0 lg:h-full">
                    <Card className="h-full">
                      <CardContent className="p-2 sm:p-3 h-full">
                        <div className="rounded-lg overflow-hidden border bg-black h-full">
                          {/* Mobile: fixed aspect ratio / Desktop: fill available height */}
                          <div className="relative w-full aspect-video sm:aspect-[16/10] min-h-[220px] max-h-[68vh] sm:max-h-[75vh] lg:aspect-auto lg:h-full lg:max-h-none">
                            <iframe
                              src={browserSession.liveViewUrl}
                              title="Eburon browser live view"
                              className="absolute inset-0 block w-full h-full"
                              allow="camera; microphone; display-capture"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer — hidden on desktop when session is active to maximize space */}
      <footer className={`pb-8 mt-auto ${browserSession ? 'hidden lg:hidden' : ''}`}>
        <div className="container mx-auto px-4 text-center text-gray-600 text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://eburon.ai"
              className="font-medium hover:text-gray-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Eburon AI
            </a>
          </p>
        </div>
      </footer>

      <style jsx>{`
        .sandbox-demo-stage {
          background: radial-gradient(
            ellipse at top,
            rgba(59, 130, 246, 0.08),
            rgba(15, 23, 42, 0.95)
          );
        }

        .sandbox-demo-window {
          transform-origin: top right;
        }

        .sandbox-demo-main {
          animation: sandbox-main-window 6.8s ease-in-out infinite;
        }

        .sandbox-demo-popup {
          animation: sandbox-popup-window 6.8s ease-in-out infinite;
        }

        .sandbox-demo-dock-icon {
          animation: sandbox-dock-pulse 6.8s ease-in-out infinite;
        }

        .sandbox-demo-cursor {
          animation: sandbox-cursor-move 6.8s linear infinite;
        }

        .sandbox-demo-click {
          animation: sandbox-click-pulse 6.8s ease-out infinite;
        }

        @keyframes sandbox-main-window {
          0%,
          15% {
            transform: translateY(4px) scale(0.98);
            opacity: 0.9;
          }
          25%,
          55% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          65%,
          100% {
            transform: translateY(2px) scale(0.99);
            opacity: 0.95;
          }
        }

        @keyframes sandbox-popup-window {
          0%,
          12% {
            transform: translate(84px, -24px) scale(0.7);
            opacity: 0;
          }
          22%,
          50% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          62%,
          76% {
            transform: translate(70px, 92px) scale(0.2);
            opacity: 0.6;
          }
          80%,
          100% {
            transform: translate(84px, 106px) scale(0.08);
            opacity: 0;
          }
        }

        @keyframes sandbox-dock-pulse {
          0%,
          58%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(34, 211, 238, 0);
          }
          68% {
            transform: scale(1.08);
            box-shadow: 0 0 14px rgba(34, 211, 238, 0.45);
          }
        }

        @keyframes sandbox-cursor-move {
          0% {
            transform: translate(24px, 24px);
          }
          20% {
            transform: translate(120px, 46px);
          }
          40% {
            transform: translate(145px, 80px);
          }
          58% {
            transform: translate(206px, 138px);
          }
          78% {
            transform: translate(54px, 112px);
          }
          100% {
            transform: translate(24px, 24px);
          }
        }

        @keyframes sandbox-click-pulse {
          0%,
          18%,
          38%,
          56%,
          100% {
            transform: scale(0.45);
            opacity: 0;
          }
          6%,
          26%,
          46%,
          66% {
            transform: scale(1.9);
            opacity: 0.95;
          }
          12%,
          32%,
          52%,
          72% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>

      {/* Steps Overlay */}
      {stepsOverlayResult && (
        <StepsOverlay
          open={!!stepsOverlayResult}
          onOpenChange={(open) => !open && setStepsOverlayResult(null)}
          steps={stepsOverlayResult.detailedSteps || []}
          task={stepsOverlayResult.task || ""}
        />
      )}
    </div>
  );
}
