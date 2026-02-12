import React, { useState } from 'react';
import { Maximize2, Minimize2, MoreHorizontal, Terminal, X, Globe, Cpu } from 'lucide-react';
// Interface defined locally to avoid circular dependency
interface AutomationResult {
    stepCount?: number;
    response?: string;
    detailedSteps?: any[];
}

interface DesktopEnvironmentProps {
    browserSession: { liveViewUrl: string } | null;
    automationResults: AutomationResult[];
    isSessionActive: boolean;
}

export function DesktopEnvironment({ browserSession, automationResults, isSessionActive }: DesktopEnvironmentProps) {
    const [activeWindow, setActiveWindow] = useState<'browser' | 'terminal'>('browser');
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);

    // Auto-scroll terminal to bottom?
    // We'll use a simple flex-col-reverse or ref.

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-[#2c001e] via-[#772953] to-[#e95420] overflow-hidden font-sans select-none rounded-lg border shadow-2xl">
            {/* Desktop Overlay (Grid of icons) */}
            <div className="absolute inset-0 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 pointer-events-none z-0">
                {/* Wallpaper Pattern / Noise can be added here if needed */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            </div>

            {/* Ubuntu Left Dock */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-black/20 backdrop-blur-md flex flex-col items-center py-4 gap-4 z-50 border-r border-white/5">
                <div
                    onClick={() => { setActiveWindow('browser'); }}
                    className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${activeWindow === 'browser' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    title="Browser"
                >
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#E95420] transition-all ${activeWindow === 'browser' ? 'h-5 rounded-r-md' : 'opacity-0'}`} />
                    <Globe className="w-6 h-6 text-[#E95420] drop-shadow-lg" />
                    {/* Tooltip */}
                    <div className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Eburon Browser
                    </div>
                </div>

                <div
                    onClick={() => { setActiveWindow('terminal'); setIsTerminalOpen(true); }}
                    className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${activeWindow === 'terminal' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    title="Terminal"
                >
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#E95420] transition-all ${activeWindow === 'terminal' ? 'h-5 rounded-r-md' : 'opacity-0'}`} />
                    <Terminal className="w-6 h-6 text-white drop-shadow-lg" />
                    <div className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Terminal
                    </div>
                </div>

                <div className="w-8 h-[1px] bg-white/10 my-1" />

                <div className="w-10 h-10 rounded-lg flex items-center justify-center opacity-50 cursor-not-allowed">
                    <Cpu className="w-6 h-6 text-white" />
                </div>

                <div className="mt-auto w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/5 cursor-pointer">
                    <div className="grid grid-cols-3 gap-0.5 p-2">
                        {[...Array(9)].map((_, i) => <div key={i} className="w-1 h-1 bg-white/50 rounded-full" />)}
                    </div>
                </div>
            </div>

            {/* Browser Window */}
            {browserSession && (
                <div
                    className={`absolute top-8 left-20 right-4 bottom-20 bg-[#333] rounded-t-lg shadow-2xl flex flex-col border border-white/10 transition-all duration-300 ${activeWindow === 'browser' ? 'z-10 ring-1 ring-white/10' : 'z-0 opacity-90 scale-[0.98]'}`}
                    onClick={() => setActiveWindow('browser')}
                >
                    {/* Title Bar (Ubuntu Style: Dark) */}
                    <div className="h-9 bg-[#2c2c2c] border-b border-black flex items-center px-4 justify-between rounded-t-lg select-none" onDoubleClick={() => { }}>
                        <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            Eburon Browser — Mozilla Firefox
                        </div>
                        <div className="flex gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#333] hover:bg-[#444] flex items-center justify-center text-gray-400 text-[10px] cursor-pointer">_</div>
                            <div className="w-4 h-4 rounded-full bg-[#333] hover:bg-[#444] flex items-center justify-center text-gray-400 text-[10px] cursor-pointer">□</div>
                            <div className="w-4 h-4 rounded-full bg-[#E95420] hover:bg-[#c74418] flex items-center justify-center text-white text-[10px] cursor-pointer">✕</div>
                        </div>
                    </div>
                    {/* Toolbar URL Placeholder */}
                    <div className="h-10 bg-[#383838] border-b border-black flex items-center px-4 gap-3">
                        <div className="flex gap-1 text-gray-400">
                            <div className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer">←</div>
                            <div className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer">→</div>
                            <div className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer">↻</div>
                        </div>
                        <div className="flex-1 bg-[#2b2b2b] h-7 rounded px-3 flex items-center text-xs text-gray-300 border border-black shadow-inner">
                            {browserSession.liveViewUrl ? 'https://remote-browser-session...' : 'about:blank'}
                        </div>
                        <div className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer text-gray-400">☰</div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 relative bg-white">
                        <iframe
                            src={browserSession.liveViewUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="camera; microphone; display-capture"
                            title="Browser"
                        />
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
                            <div key={i} className="break-words whitespace-pre-wrap">
                                <span className="text-green-400">[{new Date().toLocaleTimeString()}]</span> {res.response || 'Processing...'}
                            </div>
                        ))}
                        <div className="flex items-center gap-1">
                            <span className="text-[#E95420] font-bold">master@eburon:~$</span>
                            <span className="animate-pulse bg-white w-2 h-4 block"></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar (GNOME Shell Panel) */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-[#1d1d1d] flex items-center justify-between px-4 text-sm font-medium text-gray-300 z-40 select-none shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="font-bold cursor-pointer hover:bg-white/10 px-2 rounded">Activities</span>
                    <span className="cursor-pointer hover:bg-white/10 px-2 rounded">Terminal</span>
                    <span className="cursor-pointer hover:bg-white/10 px-2 rounded">Firefox Web Browser</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="text-xs">en</span>
                        <span className="text-xs">▼</span>
                    </div>
                    <div className="w-px h-3 bg-gray-600" />
                    <div className="flex gap-2">
                        <span>network</span>
                        <span>vol</span>
                        <span>pwr</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
