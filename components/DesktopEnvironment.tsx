import React, { useState, useEffect } from 'react';
import { Terminal, Maximize2, Minimize2, X, RefreshCw, Cpu, Wifi, Volume2, Battery, FolderOpen, Grid, Globe } from "lucide-react";

// Interface defined locally to avoid circular dependency
interface AutomationResult {
    stepCount?: number;
    response?: string;
    detailedSteps?: any[];
    args?: any; // New: capture tool arguments for logging
}

interface DesktopEnvironmentProps {
    browserSession: { liveViewUrl: string } | null;
    automationResults: AutomationResult[];
    isSessionActive: boolean;
    cursorPosition?: { x: number; y: number } | null;
}

export function DesktopEnvironment({ browserSession, automationResults, isSessionActive, cursorPosition }: DesktopEnvironmentProps) {
    const [activeWindow, setActiveWindow] = useState<'browser' | "terminal">('browser');
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll to bottom of terminal when logs update
    const terminalEndRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [automationResults]);

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-[#2c001e] via-[#772953] to-[#e95420] overflow-hidden font-sans select-none rounded-lg border shadow-2xl">
            {/* Desktop Overlay (Grid of icons) */}
            <div className="absolute inset-0 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 pointer-events-none z-0">
                {/* Wallpaper Pattern / Noise can be added here if needed */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            </div>

            {/* Top Bar (GNOME Shell Panel) */}
            <div className="absolute inset-x-0 top-0 h-7 bg-[#1c1c1c] dark:bg-[#1c1c1c] text-white flex items-center justify-between px-3 z-50 text-xs shadow-sm font-ubuntu">
                <div className="flex items-center gap-4">
                    <span className="font-bold tracking-tight">Activities</span>
                    <span className="hover:underline cursor-pointer opacity-80">Terminal</span>
                    <span className="hover:underline cursor-pointer opacity-80">Firefox</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 font-medium">
                    {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM"}
                </div>
                <div className="flex items-center gap-3">
                    <span className="opacity-80 hover:opacity-100 cursor-pointer">en</span>
                    <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white opacity-90"></span>
                        <span className="w-2 h-2 rounded-full border border-white opacity-70"></span>
                    </div>
                </div>
            </div>

            {/* Side Dock (Left) */}
            <div className="absolute left-0 top-7 bottom-0 w-14 bg-[#1e1e1e]/90 backdrop-blur-md flex flex-col items-center py-4 gap-3 z-40 border-r border-white/5">
                <div
                    onClick={() => { setActiveWindow('browser'); }}
                    className={`p-2 rounded-lg relative group cursor-pointer transition-all ${activeWindow === 'browser' ? 'bg-white/10' : 'hover:bg-white/10'}`}
                    title="Browser"
                >
                    <div className="w-8 h-8 flex items-center justify-center bg-orange-600 rounded-lg text-white font-bold text-lg shadow-lg">F</div>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full group-hover:translate-x-1 transition-transform w-1 h-1 bg-orange-500 rounded-full ${activeWindow === 'browser' ? 'translate-x-1 h-5 rounded-r-md' : ''}`}></div>
                </div>
                <div
                    onClick={() => { setActiveWindow('terminal'); setIsTerminalOpen(true); }}
                    className={`p-2 rounded-lg relative group cursor-pointer transition-all ${activeWindow === 'terminal' ? 'bg-white/10' : 'hover:bg-white/10'}`}
                    title="Terminal"
                >
                    <Terminal className="w-8 h-8 text-white opacity-80" />
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full group-hover:translate-x-1 transition-transform w-1 h-1 bg-orange-500 rounded-full ${activeWindow === 'terminal' ? 'translate-x-1 h-5 rounded-r-md' : ''}`}></div>
                </div>
                <div className="p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
                    <Cpu className="w-8 h-8 text-white opacity-80" />
                </div>
                <div className="mt-auto p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
                    <Grid className="w-6 h-6 text-white opacity-60" />
                </div>
            </div>

            {/* Browser Window (Maximized) */}
            {browserSession && (
                <div
                    className={`absolute top-7 left-14 right-0 bottom-0 bg-[#333] flex flex-col transition-all duration-300 ${activeWindow === 'browser' ? 'z-10' : 'z-0 opacity-0'}`}
                    onClick={() => setActiveWindow('browser')}
                >
                    {/* Minimal Title Bar / Toolbar merged */}
                    <div className="h-9 bg-[#2c2c2c] border-b border-black flex items-center px-3 gap-3 select-none">
                        {/* Traffic Lights (Ubuntu style) */}
                        <div className="flex gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#E95420] flex items-center justify-center text-white text-[8px] cursor-pointer hover:bg-[#c74418]">×</div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#333] border border-gray-600 flex items-center justify-center text-gray-400 text-[8px] cursor-pointer">−</div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#333] border border-gray-600 flex items-center justify-center text-gray-400 text-[8px] cursor-pointer">□</div>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-1 text-gray-400">
                            <div className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center cursor-pointer">←</div>
                            <div className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center cursor-pointer">→</div>
                            <div className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center cursor-pointer">↻</div>
                        </div>

                        {/* URL Bar */}
                        <div className="flex-1 bg-[#1e1e1e] h-6 rounded px-3 flex items-center text-xs text-gray-300 border border-black/50 shadow-inner truncate font-mono">
                            {browserSession.liveViewUrl ? 'https://remote-browser-session...' : 'about:blank'}
                        </div>

                        {/* Menu */}
                        <div className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center cursor-pointer text-gray-400">☰</div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 relative bg-white">
                        <iframe
                            src={browserSession.liveViewUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="camera; microphone; display-capture"
                            title="Browser"
                        />
                        {/* Agent Cursor Overlay */}
                        {cursorPosition && (
                            <div
                                className="absolute pointer-events-none z-50 transition-all duration-300 ease-out"
                                style={{
                                    left: `${cursorPosition.x}px`,
                                    top: `${cursorPosition.y}px`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="drop-shadow-lg"
                                >
                                    <path
                                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                                        fill="#E95420"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="ml-4 mt-2 bg-[#E95420] text-white text-[10px] px-1.5 py-0.5 rounded shadow-lg font-ubuntu whitespace-nowrap opacity-80">
                                    Agent
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Terminal Window */}
            {(automationResults.length > 0 || isTerminalOpen) && (
                <div
                    className={`absolute bottom-24 right-10 w-[450px] h-[320px] bg-[#300a24]/95 backdrop-blur-md rounded-lg shadow-2xl flex flex-col border border-white/10 transition-all duration-300 ${activeWindow === 'terminal' ? 'z-20 ring-1 ring-orange-500/30' : 'z-10 opacity-90'}`}
                    onClick={() => setActiveWindow('terminal')}
                >
                    {/* Terminal Title Bar */}
                    <div className="h-8 bg-[#3e3e3e] flex items-center justify-between px-3 rounded-t-lg cursor-move select-none border-b border-black">
                        <div className="text-gray-300 text-xs font-medium">master@eburon:~/agent</div>
                        <div className="flex gap-2">
                            <div className="w-4 h-4 flex items-center justify-center text-gray-400 cursor-pointer hover:text-white" onClick={() => setIsTerminalOpen(false)}>_</div>
                            <div className="w-4 h-4 flex items-center justify-center text-gray-400 cursor-pointer hover:text-white">□</div>
                            <div className="w-4 h-4 flex items-center justify-center text-[#E95420] cursor-pointer hover:text-red-400" onClick={() => setIsTerminalOpen(false)}>✕</div>
                        </div>
                    </div>
                    {/* Terminal Content */}
                    <div className="flex-1 p-3 font-mono text-[11px] text-[#f2f2f2] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-600">
                        <div className="opacity-70 text-[#E95420] font-bold">master@eburon:~$ <span className="text-white font-normal">init agent-session</span></div>
                        {automationResults.length === 0 && <div className="opacity-50 text-white/40">Waiting for logs...</div>}
                        {[...automationResults].reverse().map((res, i) => (
                            <div key={i} className="break-words whitespace-pre-wrap leading-relaxed">
                                <span className="text-green-400 opacity-80">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>{' '}
                                {res.response || 'Processing...'}
                                {res.args && (
                                    <div className="text-[10px] text-orange-400/80 mt-0.5 ml-4 font-mono break-all italic">
                                        &gt; {JSON.stringify(res.args)}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={terminalEndRef} />
                        <div className="flex items-center gap-1">
                            <span className="text-[#E95420] font-bold">master@eburon:~$</span>
                            <span className="animate-pulse bg-white w-2 h-4 block"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
