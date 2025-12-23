
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GeminiBackend } from '../services/GeminiBackend';

// --- UTILS ---
const AnimatedNumber = ({ number, isHovered }: { number: string; isHovered: boolean }) => {
  const [display, setDisplay] = useState(number);
  useEffect(() => {
    if (isHovered) {
      let count = 0;
      const interval = setInterval(() => {
        setDisplay(Math.floor(Math.random() * 99).toString().padStart(2, '0'));
        count++;
        if (count > 8) { clearInterval(interval); setDisplay(number); }
      }, 40);
      return () => clearInterval(interval);
    } else { setDisplay(number); }
  }, [isHovered, number]);
  return <span>{display}</span>;
};

// --- ANIMATED WORKFLOW TERMINAL (SCENE 2) ---
const WorkflowTerminal = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: '80%', y: '120%' }); // Start off-screen
  const [isClicking, setIsClicking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'typing' | 'moving' | 'thinking' | 'result'>('idle');

  const PROMPT = "Generate a high-converting headline";
  const RESULT_TEXT = "Discover, Generate, and Deploy AI Tools — Faster Than Ever";

  useEffect(() => {
    let isMounted = true;

    const runAnimation = async () => {
      while (isMounted) {
        // RESET
        if(!isMounted) break;
        setStatus('idle');
        setText("");
        setResult("");
        setCursorPos({ x: '50%', y: '120%' });
        await new Promise(r => setTimeout(r, 1000));

        // 1. TYPING
        if(!isMounted) break;
        setStatus('typing');
        for (let i = 0; i <= PROMPT.length; i++) {
          if(!isMounted) break;
          setText(PROMPT.slice(0, i));
          await new Promise(r => setTimeout(r, 50 + Math.random() * 30));
        }
        await new Promise(r => setTimeout(r, 500));

        // 2. MOVE CURSOR TO BUTTON
        if(!isMounted) break;
        setStatus('moving');
        setCursorPos({ x: '92%', y: '84%' }); // Position over the send button
        await new Promise(r => setTimeout(r, 1000)); // Wait for transition

        // 3. CLICK
        if(!isMounted) break;
        setIsClicking(true);
        await new Promise(r => setTimeout(r, 200));
        setIsClicking(false);
        
        // 4. THINKING
        if(!isMounted) break;
        setStatus('thinking');
        await new Promise(r => setTimeout(r, 1500));

        // 5. RESULT
        if(!isMounted) break;
        setStatus('result');
        setResult(RESULT_TEXT);
        
        // 6. WAIT & LOOP
        await new Promise(r => setTimeout(r, 5000));
      }
    };

    runAnimation();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="terminal-window relative overflow-hidden">
      {/* HEADER */}
      <div className="terminal-header">
          <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-xs font-mono text-slate-400">~/ai-studio/generator</span>
          <div className="flex-1"></div>
          <span className="material-symbols-outlined text-slate-500 text-[14px]">settings</span>
      </div>

      {/* BODY */}
      <div className="p-6 flex flex-col h-[280px]">
          {/* Prompt Input Area */}
          <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-2 block">Input Prompt</label>
              <div className="relative font-mono text-sm text-white/90 min-h-[24px]">
                  <span className="text-purple-400 mr-2">❯</span>
                  {text}
                  {status === 'typing' && <span className="animate-blink inline-block w-2 h-4 bg-blue-400 ml-1 align-middle"></span>}
              </div>
          </div>

          {/* Result Area */}
          <div className={`mt-4 pt-4 border-t border-white/10 transition-opacity duration-500 ${status === 'result' || status === 'thinking' ? 'opacity-100' : 'opacity-0'}`}>
              <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-2 block flex items-center gap-2">
                  AI Output
                  {status === 'thinking' && <span className="size-2 bg-emerald-400 rounded-full animate-ping"></span>}
              </label>
              
              {status === 'thinking' ? (
                  <div className="flex gap-1 h-6 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                  </div>
              ) : (
                  <div className="bg-white/5 p-3 rounded-lg border-l-2 border-emerald-500 font-sans text-lg font-medium text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      {result}
                  </div>
              )}
          </div>

          {/* Action Bar */}
          <div className="mt-auto flex justify-end pt-4">
              <button 
                  className={`flex items-center justify-center size-10 rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-100 ${isClicking ? 'scale-90 bg-blue-500' : 'scale-100'}`}
              >
                  <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              </button>
          </div>
      </div>

      {/* MOUSE CURSOR OVERLAY */}
      <div 
          className="absolute pointer-events-none transition-all duration-[1000ms] ease-in-out z-50 drop-shadow-xl"
          style={{ left: cursorPos.x, top: cursorPos.y }}
      >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="white" stroke="white" strokeWidth="1"/>
          </svg>
      </div>

      <div className="terminal-glow"></div>
    </div>
  );
};

// --- CINEMATIC 3D HERO ---
const CinematicHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Popular AI Tools Domains for Icons
  const TRENDY_TOOLS = [
    'openai.com', 'midjourney.com', 'anthropic.com', 'runwayml.com',
    'stability.ai', 'jasper.ai', 'notion.so', 'perplexity.ai',
    'huggingface.co', 'elevenlabs.io', 'leonardo.ai', 'canva.com',
    'figma.com', 'discord.com', 'github.com', 'copy.ai'
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDist = height - viewportHeight;
      // Calculate 0 to 1 progress
      const progress = Math.max(0, Math.min(1, (top * -1) / totalDist));
      containerRef.current.style.setProperty('--scroll', progress.toString());
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        containerRef.current.style.setProperty('--mouse-x', x.toString());
        containerRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    // Height 800vh for slower, more deliberate pacing
    <div ref={containerRef} className="hero-track relative h-[800vh] bg-[#080B14]" style={{ '--scroll': 0, '--mouse-x': 0, '--mouse-y': 0 } as React.CSSProperties}>
      <div className="hero-camera sticky top-0 h-screen w-full overflow-hidden perspective-container">
        
        {/* --- GLOBAL AMBIANCE --- */}
        <div className="absolute inset-0 z-0 bg-[#080B14]">
            {/* Moving Fog */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0f121e] to-[#080B14]"></div>
            
            {/* Dynamic Light Source (Follows Mouse) */}
            <div className="absolute w-[800px] h-[800px] rounded-full bg-radial-gradient from-[#7C5CFF]/20 to-transparent blur-[100px] pointer-events-none transition-transform duration-100 ease-out"
                 style={{ 
                     top: '50%', left: '50%', 
                     transform: 'translate(calc(-50% + var(--mouse-x) * 50px), calc(-50% + var(--mouse-y) * 50px))' 
                 }}>
            </div>
        </div>

        {/* --- SCENE 1: THE AI CORE (Visible 0.0 - 0.25) --- */}
        <div className="scene-layer scene-1 z-10 flex flex-col md:flex-row items-center justify-center w-full h-full px-6">
            <div className="ai-core-container md:mr-12 mb-10 md:mb-0 relative z-10">
                {/* The Glass Orb */}
                <div className="ai-core-orb">
                    <div className="orb-inner-light"></div>
                    <div className="orb-surface"></div>
                    <div className="orb-ring ring-1"></div>
                    <div className="orb-ring ring-2"></div>
                    <div className="orb-ring ring-3"></div>
                </div>
                
                {/* Orbiting Features */}
                <div className="orbit-system">
                    <div className="orbit-item icon-1"><span className="material-symbols-outlined">auto_awesome</span></div>
                    <div className="orbit-item icon-2"><span className="material-symbols-outlined">brush</span></div>
                    <div className="orbit-item icon-3"><span className="material-symbols-outlined">terminal</span></div>
                    <div className="orbit-item icon-4"><span className="material-symbols-outlined">psychology</span></div>
                </div>
            </div>

            <div className="scene-1-text text-center md:text-left max-w-xl relative z-20">
                {/* HEADLINE CURSOR GLOW */}
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen transition-transform duration-75 will-change-transform"
                     style={{ 
                         transform: 'translate(calc(-50% + var(--mouse-x) * 120px), calc(-50% + var(--mouse-y) * 120px))' 
                     }}>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(124,92,255,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#F8FAFF] uppercase tracking-widest">System Online</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] tracking-tighter mb-6 mix-blend-overlay">
                    UDX<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#5CE1E6]">3</span><br/>
                    UNIVERSE
                </h1>
                <p className="text-lg text-slate-400 font-light leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                    The central hub for generative intelligence. Explore prompts, tools, and automation in one dimension.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest animate-bounce mt-10">
                    <span className="material-symbols-outlined text-[16px]">mouse</span> Scroll to Enter
                </div>
            </div>
        </div>

        {/* --- SCENE 2: PROMPT INTELLIGENCE (Visible 0.15 - 0.75, Full 0.25 - 0.65) --- */}
        <div className="scene-layer scene-2 z-20 pointer-events-none w-full h-full flex flex-col items-center justify-center">
            
            {/* Cyber Grid Floor */}
            <div className="absolute inset-0 cyber-grid-floor"></div>
            <div className="absolute inset-0 cyber-grid-ceil"></div>

            <div className="prompt-cloud relative w-full max-w-5xl h-[600px] flex flex-col items-center justify-center">
                
                {/* FLOATING CARDS (Background Layer) */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Card 5: Code (Background Top Right) */}
                    <div className="absolute -top-40 right-20 p-4 rounded-2xl bg-[#1e1e2e]/40 border border-white/5 backdrop-blur-sm shadow-xl w-56 transform -rotate-12 translate-z-[-200px] animate-float-3 grayscale opacity-60 hidden md:block">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined text-[18px]">code</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Code</span>
                        </div>
                        <p className="text-xs font-mono text-slate-400">Python script to scrape prices</p>
                    </div>
                </div>

                {/* CENTRAL TERMINAL */}
                <div style={{ transform: 'translateZ(50px)' }} className="relative z-10 w-full flex justify-center">
                    <WorkflowTerminal />
                </div>

                {/* FLOATING CARDS (Foreground Layer) */}
                <div className="absolute inset-0 pointer-events-none hidden md:block">
                    {/* Card 1: Image Gen (Top Left) */}
                    <div className="absolute -top-32 -left-20 p-4 rounded-2xl bg-[#1e1e2e]/80 border border-white/10 backdrop-blur-md shadow-2xl w-64 transform -rotate-6 translate-z-[100px] animate-float-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-500">
                                <span className="material-symbols-outlined text-[18px]">brush</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Gen</span>
                        </div>
                        <p className="text-sm font-medium text-white/90">Cyberpunk city in neon rain, 8k</p>
                    </div>

                    {/* Card 2: Writing (Right Center) */}
                    <div className="absolute top-10 -right-32 p-4 rounded-2xl bg-[#1e1e2e]/80 border border-white/10 backdrop-blur-md shadow-2xl w-64 transform rotate-12 translate-z-[50px] animate-float-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Writing</span>
                        </div>
                        <p className="text-sm font-medium text-white/90">Blog post about AI trends 2025</p>
                    </div>

                    {/* Card 3: Video (Bottom Left) */}
                    <div className="absolute -bottom-24 -left-10 p-4 rounded-2xl bg-[#1e1e2e]/80 border border-white/10 backdrop-blur-md shadow-2xl w-64 transform -rotate-3 translate-z-[150px] animate-float-3">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined text-[18px]">movie</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Video</span>
                        </div>
                        <p className="text-sm font-medium text-white/90">Drone shot of mountains, cinematic</p>
                    </div>

                    {/* Card 4: Email (Bottom Right) */}
                    <div className="absolute -bottom-40 right-0 p-4 rounded-2xl bg-[#1e1e2e]/60 border border-white/5 backdrop-blur-sm shadow-xl w-56 transform rotate-6 translate-z-[-50px] animate-float-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500">
                                <span className="material-symbols-outlined text-[18px]">mail</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</span>
                        </div>
                        <p className="text-sm font-medium text-slate-300">Professional follow-up email</p>
                    </div>
                </div>

                {/* Connection Lines */}
                <div className="connector-lines hidden md:block"></div>
                
                <div className="absolute bottom-20 left-0 w-full text-center z-30">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">Prompt Intelligence</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> 500,000+ Curated Inputs
                    </div>
                </div>
            </div>
        </div>

        {/* --- SCENE 3: TOOLS MATRIX (Visible 0.65 - 1.0) --- */}
        <div className="scene-layer scene-3 z-30 pointer-events-none flex flex-col items-center justify-center w-full h-full">
            <div className="tool-matrix">
                {TRENDY_TOOLS.map((domain, i) => (
                    <div 
                        key={i} 
                        className="matrix-tile animate-float-3s"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    >
                        <img 
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                            alt={domain}
                            className="w-12 h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80"
                        />
                    </div>
                ))}
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-40 pointer-events-auto mix-blend-plus-lighter w-full px-4">
                <h2 className="text-5xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 leading-tight mb-8">
                    POWER<br/>TOOLS
                </h2>
                <button 
                    onClick={() => navigate('/ai-tools')}
                    className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg overflow-hidden transition-transform hover:scale-105"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                        Explore Tools <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                </button>
            </div>
        </div>

      </div>

      <style>{`
        .perspective-container {
            perspective: 1200px;
            perspective-origin: 50% 50%;
            transform-style: preserve-3d;
        }

        .scene-layer {
            position: absolute;
            inset: 0;
            will-change: transform, opacity;
        }

        /* --- SCENE 1 STYLES --- */
        /* Visible from 0 to 0.25. Fades out sharply after 0.15 */
        .scene-1 {
            opacity: calc(1 - max(0, var(--scroll) - 0.15) * 10);
            transform: translateZ(calc(var(--scroll) * 200px));
            pointer-events: calc(var(--scroll) > 0.2 ? none : auto);
        }

        .ai-core-container {
            position: relative;
            transform-style: preserve-3d;
            transform: rotateX(calc(var(--mouse-y) * -10deg)) rotateY(calc(var(--mouse-x) * 10deg));
        }

        .ai-core-orb {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(124,92,255,0.05) 40%, rgba(0,0,0,0) 70%);
            box-shadow: 
                0 0 60px rgba(124,92,255,0.2),
                inset 0 0 40px rgba(124,92,255,0.2),
                inset 0 0 10px rgba(255,255,255,0.5);
            backdrop-filter: blur(8px);
            position: relative;
            animation: breathe 8s ease-in-out infinite;
        }

        .orb-inner-light {
            position: absolute;
            inset: 20%;
            background: radial-gradient(circle, #7C5CFF, #5CE1E6);
            filter: blur(40px);
            opacity: 0.6;
            animation: pulse-core 4s ease-in-out infinite;
        }

        .orb-ring {
            position: absolute;
            top: 50%; left: 50%;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        .ring-1 { width: 380px; height: 380px; border-color: rgba(124,92,255,0.2); transform: translate(-50%, -50%) rotateX(70deg); }
        .ring-2 { width: 450px; height: 450px; border-color: rgba(92,225,230,0.1); transform: translate(-50%, -50%) rotateY(70deg); }
        .ring-3 { width: 500px; height: 500px; border: 1px dashed rgba(255,255,255,0.05); animation: spin-slow 20s linear infinite; }

        .orbit-item {
            position: absolute;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(5px);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 0 20px rgba(124,92,255,0.3);
        }
        .icon-1 { top: -40px; left: 50%; animation: float-1 6s ease-in-out infinite; }
        .icon-2 { bottom: 20px; right: -40px; animation: float-2 7s ease-in-out infinite; }
        .icon-3 { top: 50%; left: -60px; animation: float-1 8s ease-in-out infinite; }
        .icon-4 { bottom: -20px; left: 20px; animation: float-2 5s ease-in-out infinite; }

        .scene-1-text {
            transform: translateX(calc(var(--scroll) * -100px));
        }

        /* --- SCENE 2 STYLES (ENHANCED - SLOW SCROLL) --- */
        /* Visible range 0.15 - 0.75. Fully Opaque 0.25 - 0.65 */
        /* Formula calculates distance from 0.45 center. Window is +/- 0.2 */
        .scene-2 {
            opacity: calc(1 - max(0, abs(var(--scroll) - 0.45) - 0.2) * 10);
            transform: translateZ(calc((var(--scroll) - 0.45) * 500px)); /* Slower Z movement */
            display: flex;
        }

        .prompt-cloud {
            transform-style: preserve-3d;
            transform: rotateX(calc(var(--mouse-y) * 8deg)) rotateY(calc(var(--mouse-x) * 8deg));
        }

        /* Cyber Grid Background */
        .cyber-grid-floor {
            background-image: 
                linear-gradient(to right, rgba(124, 92, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(124, 92, 255, 0.1) 1px, transparent 1px);
            background-size: 60px 60px;
            transform: perspective(500px) rotateX(60deg) translateY(200px) translateZ(-200px);
            opacity: 0.4;
            mask-image: linear-gradient(to bottom, transparent, black);
        }
        .cyber-grid-ceil {
            background-image: 
                linear-gradient(to right, rgba(92, 225, 230, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(92, 225, 230, 0.1) 1px, transparent 1px);
            background-size: 60px 60px;
            transform: perspective(500px) rotateX(-60deg) translateY(-200px) translateZ(-200px);
            opacity: 0.3;
            mask-image: linear-gradient(to top, transparent, black);
        }

        /* Main Terminal Window */
        .terminal-window {
            width: 500px;
            height: 320px;
            background: rgba(13, 17, 28, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            box-shadow: 
                0 20px 50px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                0 0 30px rgba(124, 92, 255, 0.1);
            backdrop-filter: blur(20px);
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            transform: translateZ(50px);
        }

        .terminal-header {
            height: 44px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            padding: 0 16px;
            gap: 16px;
        }

        .terminal-glow {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to top, rgba(124, 92, 255, 0.1), transparent);
            pointer-events: none;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-1 7s ease-in-out infinite reverse; }
        
        /* 3 Second Float Animation for Scene 3 Icons */
        @keyframes float-fast {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float-3s { animation: float-fast 3s ease-in-out infinite; }

        /* --- SCENE 3 STYLES --- */
        /* Visible from 0.7 to 1.0 */
        .scene-3 {
            opacity: calc((var(--scroll) - 0.7) * 10);
            pointer-events: calc(var(--scroll) > 0.8 ? auto : none);
        }

        .tool-matrix {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            transform: perspective(1000px) rotateX(60deg) translateY(calc((1 - var(--scroll)) * 300px)) scale(1.3);
            opacity: calc((var(--scroll) - 0.6) * 3);
        }

        .matrix-tile {
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
        }
        .matrix-tile:hover {
            background: rgba(92,225,230,0.15);
            border-color: #5CE1E6;
            box-shadow: 0 0 30px rgba(92,225,230,0.2);
            transform: translateZ(20px) scale(1.1);
        }
        .matrix-tile:hover img {
            filter: grayscale(0%);
            opacity: 1;
            transform: scale(1.1);
        }

        /* --- ANIMATIONS --- */
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes pulse-core { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.2); } }
        @keyframes spin-slow { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(0) rotateX(0deg); } 50% { transform: translateY(-15px) rotateX(5deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0) rotateY(0deg); } 50% { transform: translateY(15px) rotateY(-5deg); } }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .hero-track { height: auto !important; }
            .hero-camera { position: relative; height: auto; overflow: visible; display: flex; flex-direction: column; gap: 80px; padding-bottom: 80px; }
            
            .scene-layer { 
                position: relative; 
                height: auto; 
                min-height: 80vh; 
                transform: none !important; 
                opacity: 1 !important; 
                display: flex !important; 
                flex-direction: column;
                padding: 40px 20px;
            }
            
            .scene-1 { padding-top: 100px; }
            .ai-core-container { margin-right: 0; margin-bottom: 40px; transform: scale(0.8); }
            .ai-core-orb { width: 220px; height: 220px; }
            .ring-1 { width: 280px; height: 280px; }
            .ring-2 { width: 320px; height: 320px; }
            .ring-3 { width: 360px; height: 360px; }
            
            .scene-1-text { transform: none !important; text-align: center; }
            .scene-1-text h1 { font-size: 2.8rem; line-height: 1.1; }
            .scene-1-text p { font-size: 1rem; max-width: 90%; }
            
            .scene-2 { opacity: 1 !important; transform: none !important; display: flex !important; flex-direction: column; gap: 40px; overflow: hidden; }
            .prompt-cloud { transform: scale(0.9) !important; margin-bottom: 20px; height: 400px; }
            .terminal-window { width: 85vw; max-width: 400px; height: auto; min-height: 260px; }
            
            /* Hide complex floating cards on mobile to prevent clutter */
            .absolute.p-4.rounded-2xl { display: none; }
            
            .scene-3 { opacity: 1 !important; pointer-events: auto !important; }
            .scene-3 h2 { font-size: 3rem; }
            .tool-matrix { transform: perspective(1000px) rotateX(40deg) translateY(calc((1 - var(--scroll)) * 200px)) scale(1); grid-template-columns: repeat(3, 1fr); gap: 12px; opacity: 1 !important; }
            .matrix-tile { width: 64px; height: 64px; border-radius: 12px; }
            .matrix-tile img { width: 28px; height: 28px; }
        }
      `}</style>
    </div>
  );
};

const Discovery = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const { requireAuth } = useAuth();

  // Static Data Arrays
  const categories = [
    { id: 'All', label: 'All Prompts' },
    { id: 'Marketing', label: 'Marketing' },
    { id: 'Business', label: 'Business' },
    { id: 'SEO', label: 'SEO' },
    { id: 'Writing', label: 'Writing' },
    { id: 'Coding', label: 'Coding' },
    { id: 'Art', label: 'Midjourney & Art' },
    { id: 'Social Media', label: 'Social Media' },
    { id: 'Productivity', label: 'Productivity' }
  ];

  const FEATURED_CATEGORIES = [
    { title: "Digital Marketing & SEO", icon: "trending_up", count: "2,800+", description: "Comprehensive marketing strategies, SEO optimization, and digital growth tactics.", color: "bg-blue-500", popular: true, route: "marketing-seo" },
    { title: "Social-Media Strategy", icon: "chat_bubble", count: "2,800+", description: "Content creation, engagement strategies, and platform-specific optimization.", color: "bg-pink-500", popular: true, route: "social-media" },
    { title: "Branding & Copywriting", icon: "sell", count: "2,800+", description: "Brand development, copywriting, and creative content strategies.", color: "bg-green-500", popular: true, route: "branding" },
    { title: "Programming & Code", icon: "code", count: "5,700+", description: "Code development, debugging assistance, and software architecture guidance.", color: "bg-indigo-500", popular: true, route: "coding" },
    { title: "Business & Startup", icon: "business_center", count: "3,750+", description: "Business strategy, startup guidance, and entrepreneurial development.", color: "bg-orange-500", popular: true, route: "business" },
    { title: "Creative Arts", icon: "palette", count: "2,800+", description: "Artistic inspiration, creative writing, and innovative design concepts.", color: "bg-fuchsia-500", popular: true, route: "art" }
  ];

  const CREATION_CATEGORIES = [
    { title: "Image Generator Prompts", icon: "image", count: "6,600+", description: "Visual content creation for DALL-E, Midjourney, Stable Diffusion, and other AI image generators.", color: "bg-purple-500", popular: true, route: "image-generation" },
    { title: "Video Generator Prompts", icon: "videocam", count: "7,700+", description: "Video content creation for Sora, RunwayML, Pika, and other AI video generators.", color: "bg-blue-500", popular: true, route: "video-generation" },
    { title: "Music Generator Prompts", icon: "music_note", count: "4,000+", description: "Audio content creation for Suno, Udio, and other AI music generation platforms.", color: "bg-teal-500", popular: true, route: "music-generation" }
  ];

  const ADVANTAGES = [
    { title: "Advanced AI Database", desc: "Comprehensive AI-powered prompt database with machine learning optimization for maximum output quality.", icon: "psychology", badge: "ADVANCED" },
    { title: "Lightning Fast Access", desc: "Instant prompt delivery with zero-latency access to our distributed database infrastructure.", icon: "bolt", badge: "INSTANT" },
    { title: "Expert-Crafted Content", desc: "Each prompt engineered by AI specialists using advanced prompt engineering methodologies.", icon: "star", badge: "EXPERT" },
    { title: "Continuous Updates", desc: "Self-improving system that adapts to emerging AI capabilities and user feedback patterns.", icon: "update", badge: "ADAPTIVE" }
  ];

  const HOW_IT_WORKS = [
    { number: "01", title: "Browse Categories", desc: "Navigate our organized database to locate optimal prompt sequences for your needs.", icon: "manage_search" },
    { number: "02", title: "Search & Filter", desc: "Utilize advanced search algorithms to identify perfect prompt configurations.", icon: "filter_list" },
    { number: "03", title: "Copy & Customize", desc: "Copy and customize prompt data for your specific AI implementation requirements.", icon: "content_copy" },
    { number: "04", title: "Execute & Optimize", desc: "Deploy prompts to your AI systems and achieve superior performance metrics.", icon: "rocket_launch" }
  ];

  // Logic from original component
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genInputs, setGenInputs] = useState({ category: '', tone: '', audience: '', purpose: '', details: '' });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratorVisible, setIsGeneratorVisible] = useState(false);
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false);
  const [isCreationVisible, setIsCreationVisible] = useState(false);
  const generatorRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const creationRef = useRef<HTMLDivElement>(null);

  // Filter Logic for Prompts Grid
  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory || (activeCategory === 'Art' && (p.category === 'Image Generation' || p.category === 'Art'));
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyGenerated = () => {
      navigator.clipboard.writeText(generatedPrompt);
      alert('Generated prompt copied!');
  };

  useEffect(() => {
    const generatorObserver = new IntersectionObserver(([entry]) => setIsGeneratorVisible(entry.isIntersecting), { threshold: 0.2 });
    const featuredObserver = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsFeaturedVisible(true); }, { threshold: 0.15 });
    const creationObserver = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsCreationVisible(true); }, { threshold: 0.15 });

    if (generatorRef.current) generatorObserver.observe(generatorRef.current);
    if (featuredRef.current) featuredObserver.observe(featuredRef.current);
    if (creationRef.current) creationObserver.observe(creationRef.current);

    return () => {
        if (generatorRef.current) generatorObserver.unobserve(generatorRef.current);
        if (featuredRef.current) featuredObserver.unobserve(featuredRef.current);
        if (creationRef.current) creationObserver.unobserve(creationRef.current);
    };
  }, []);

  const handleGeneratePrompt = async () => {
      if (!genInputs.purpose) return;
      requireAuth(async () => {
          setIsGenerating(true);
          setGeneratedPrompt('');
          
          const promptConstruction = `Act as an expert prompt engineer. Create a high-quality, detailed AI prompt based on the following specifications:
          - Category: ${genInputs.category || 'General'}
          - Tone: ${genInputs.tone || 'Professional'}
          - Target Audience: ${genInputs.audience || 'General'}
          - Core Purpose: ${genInputs.purpose}
          - Additional Context: ${genInputs.details || 'None'}
          
          Return ONLY the prompt text, no intro/outro.`;

          try {
              const result = await GeminiBackend.generateRawText(promptConstruction);
              setGeneratedPrompt(result);
          } catch (e) {
              console.error(e);
              setGeneratedPrompt("Error generating prompt. Please try again.");
          } finally {
              setIsGenerating(false);
          }
      });
  };

  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handleCategoryClick = (category: any) => {
      if (category.route) {
          navigate(`/prompts/category/${category.route}`);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors font-sans selection:bg-blue-500/30">
      <style>{`
        .uiverse-card { width: 100%; height: 100%; min-height: 250px; background: transparent; position: relative; display: flex; place-content: center; place-items: center; overflow: hidden; border-radius: 20px; opacity: 0; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease; }
        .uiverse-card::before { content: ''; position: absolute; width: 200%; height: 200%; background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255)); animation: uiverse-rotBGimg 3s linear infinite; transition: all 0.2s linear; z-index: 0; }
        @keyframes uiverse-rotBGimg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .uiverse-card::after { content: ''; position: absolute; background: rgba(7, 24, 46, 0.85); backdrop-filter: blur(10px); inset: 2px; border-radius: 18px; z-index: 1; }
        .uiverse-content { position: relative; z-index: 2; width: 100%; height: 100%; padding: 24px; display: flex; flex-direction: column; }
        .uiverse-card:hover { transform: scale(1.05) !important; box-shadow: 0 0 30px rgba(0, 183, 255, 0.6); z-index: 10; }
        .animate-popIn { animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-fadeOut { animation: fadeOut 0.5s ease forwards; }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.5) translateY(100px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeOut { 0% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(0.9) translateY(50px); } }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* NEW: CINEMATIC SCROLL-DRIVEN HERO */}
      <CinematicHero />

      {/* CATEGORY FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-6 mb-8 mt-20 relative z-10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 justify-center">
              {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${activeCategory === cat.id ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white dark:bg-[#151b2b] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 hover:text-slate-900 dark:hover:text-white'}`}>{cat.label}</button>
              ))}
          </div>
      </section>

      {/* PROMPT GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 min-h-[600px]">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredPrompts.length > 0 ? filteredPrompts.map((prompt) => (
                 <div key={prompt.id} onClick={() => navigate(`/prompts/${prompt.id}`)} className="group relative bg-white dark:bg-[#151b2b] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2"><span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${prompt.model?.includes('Image') || prompt.category === 'Art' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'}`}><span className="material-symbols-outlined text-[14px]">{prompt.model?.includes('Image') ? 'image' : 'smart_toy'}</span>{prompt.model || 'AI'}</span></div>
                        <button onClick={(e) => { e.stopPropagation(); requireAuth(() => handleCopy(e, prompt.content, prompt.id)); }} className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${copiedId === prompt.id ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-blue-600'}`} title="Copy Prompt"><span className="material-symbols-outlined text-[20px]">{copiedId === prompt.id ? 'check' : 'content_copy'}</span></button>
                     </div>
                     <div className="flex-1 mb-6"><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">{prompt.title}</h3><div className="relative"><p className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 line-clamp-4 leading-relaxed">{prompt.content}</p><div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-50 dark:from-black/20 to-transparent pointer-events-none rounded-b-lg"></div></div></div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800"><span className="text-xs font-bold text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">{prompt.category}</span><div className="flex items-center gap-4 text-xs font-medium text-slate-400"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> {prompt.views}</span><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">thumb_up</span> {prompt.likes}</span></div></div>
                 </div>
             )) : (
                 <div className="col-span-full py-20 text-center"><div className="inline-flex items-center justify-center size-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 animate-pulse"><span className="material-symbols-outlined text-4xl text-slate-400">search_off</span></div><h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No prompts found</h2><p className="text-slate-500 mb-6">Try adjusting your search or filter.</p><button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">Reset Filters</button></div>
             )}
         </div>
      </section>

      {/* AI PROMPT GENERATOR */}
      <div ref={generatorRef} className={`relative z-20 max-w-7xl mx-auto px-4 mb-16 transform transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) ${isGeneratorVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
            {!isGeneratorOpen ? (
                <div onClick={() => setIsGeneratorOpen(true)} className="group cursor-pointer rounded-2xl bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between shadow-sm hover:shadow-xl hover:border-green-500/50 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center relative">
                            <span className="material-symbols-outlined text-2xl">neurology</span>
                            <span className="absolute top-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-[#151b2b]"></span>
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wide">AI Prompt Generator</h3>
                            <p className="text-sm text-green-600 dark:text-green-400 font-bold">Generate custom expert prompts in seconds</p>
                        </div>
                    </div>
                    <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-all"><span className="material-symbols-outlined">expand_more</span></div>
                </div>
            ) : (
                <div className="rounded-3xl bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="p-6 md:p-8 bg-gradient-to-r from-slate-50 to-white dark:from-[#151b2b] dark:to-[#1a2236]">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-3xl text-green-500">neurology</span><h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI Prompt Generator</h3></div>
                            <button onClick={() => setIsGeneratorOpen(false)} className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">close</span> Hide</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label><select className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={genInputs.category} onChange={(e) => setGenInputs({...genInputs, category: e.target.value})}><option value="">Select Category</option><option>Marketing</option><option>Coding</option><option>Creative Writing</option><option>Business</option><option>Art / Image Gen</option></select></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tone</label><select className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={genInputs.tone} onChange={(e) => setGenInputs({...genInputs, tone: e.target.value})}><option value="">Select Tone</option><option>Professional</option><option>Friendly</option><option>Witty</option><option>Urgent</option><option>Academic</option></select></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Audience</label><select className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={genInputs.audience} onChange={(e) => setGenInputs({...genInputs, audience: e.target.value})}><option value="">Select Audience</option><option>Beginners</option><option>Experts</option><option>Students</option><option>Executives</option><option>Developers</option></select></div>
                        </div>
                        <div className="mb-6"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose</label><input type="text" placeholder="e.g., Generate marketing copy for a coffee brand" className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={genInputs.purpose} onChange={(e) => setGenInputs({...genInputs, purpose: e.target.value})} /></div>
                        <div className="mb-8"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Additional Details</label><textarea placeholder="Any specific requirements..." className="w-full h-24 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={genInputs.details} onChange={(e) => setGenInputs({...genInputs, details: e.target.value})}></textarea></div>
                        <button onClick={handleGeneratePrompt} disabled={!genInputs.purpose || isGenerating} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50">{isGenerating ? <>Generating...</> : <><span className="material-symbols-outlined">auto_awesome</span> Generate Prompt</>}</button>
                        {generatedPrompt && (
                            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                                <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-slate-900 dark:text-white">Generated Prompt</h4><button onClick={handleCopyGenerated} className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">content_copy</span> Copy</button></div>
                                <div className="bg-slate-900 rounded-xl p-5 border border-slate-700"><pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">{generatedPrompt}</pre></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 mb-6">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">dataset</span>
                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Featured Categories</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">FEATURED <span className="text-green-500">CATEGORIES</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={featuredRef}>
                    {FEATURED_CATEGORIES.map((category, index) => (
                        <div key={index} className={`uiverse-card ${isFeaturedVisible ? 'animate-popIn' : 'animate-fadeOut'}`} style={{ animationDelay: isFeaturedVisible ? `${index * 150}ms` : `${index * 50}ms`, animationFillMode: 'forwards' }}>
                            <div className="uiverse-content">
                                <div className="flex justify-between items-start mb-4"><div className={`size-12 rounded-2xl ${category.color} flex items-center justify-center shadow-lg`}><span className="material-symbols-outlined text-white text-[24px]">{category.icon}</span></div>{category.popular && <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Popular</span>}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                <div className="mb-2"><span className="inline-block bg-slate-800/80 border border-slate-700 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">{category.count}</span></div>
                                <p className="text-slate-300 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{category.description}</p>
                                <button onClick={() => handleCategoryClick(category)} className="flex items-center gap-2 text-green-400 font-bold text-sm hover:text-green-300 transition-colors mt-auto group">Access AI Prompts <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* AI CREATION PROMPTS SECTION */}
        <section className="py-24 px-6 relative overflow-hidden bg-slate-900/5 dark:bg-white/5">
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
                        <span className="material-symbols-outlined text-purple-400 text-[18px]">auto_awesome</span>
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">AI Creation Tools</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">AI <span className="text-pink-500">CREATION PROMPTS</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={creationRef}>
                    {CREATION_CATEGORIES.map((category, index) => (
                        <div key={index} className={`uiverse-card ${isCreationVisible ? 'animate-popIn' : 'animate-fadeOut'}`} style={{ animationDelay: isCreationVisible ? `${index * 150}ms` : `${index * 50}ms`, animationFillMode: 'forwards' }}>
                            <div className="uiverse-content">
                                <div className="flex justify-between items-start mb-4"><div className={`size-12 rounded-2xl ${category.color} flex items-center justify-center shadow-lg`}><span className="material-symbols-outlined text-white text-[24px]">{category.icon}</span></div>{category.popular && <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Popular</span>}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                <div className="mb-2"><span className="inline-block bg-slate-800/80 border border-slate-700 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">{category.count}</span></div>
                                <p className="text-slate-300 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">{category.description}</p>
                                <button onClick={() => handleCategoryClick(category)} className="flex items-center gap-2 text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors mt-auto group">Access AI Prompts <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* SYSTEM ADVANTAGES SECTION */}
        <section className="py-24 px-6 relative bg-[#07182E] overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white text-center mb-20 tracking-tight">SYSTEM <span className="text-teal-400">ADVANTAGES</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ADVANTAGES.map((adv, i) => (
                        <div key={i} className="group relative bg-[#0B0F19] rounded-[2rem] p-8 border border-white/5 hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-2">
                            <div className="mb-6 relative"><span className="absolute -top-6 -right-6 bg-teal-500/20 text-teal-400 text-[10px] font-bold px-2 py-1 rounded-bl-xl border-l border-b border-teal-500/20">{adv.badge}</span><div className="size-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 transition-all duration-700 ease-out group-hover:rotate-[360deg]"><span className="material-symbols-outlined text-4xl">{adv.icon}</span></div></div>
                            <h3 className="text-xl font-bold text-white mb-3">{adv.title}</h3><p className="text-slate-400 text-sm leading-relaxed">{adv.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 px-6 relative bg-black">
            <div className="relative z-10 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white text-center mb-20 tracking-tight">HOW IT <span className="text-emerald-400">WORKS</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 border-t border-dashed border-emerald-500/30 z-0"></div>
                    {HOW_IT_WORKS.map((step, i) => (
                        <div key={i} className="group relative z-10 text-center" onMouseEnter={() => setHoveredStep(i)} onMouseLeave={() => setHoveredStep(null)}>
                            <div className="mx-auto size-24 rounded-full bg-[#0B0F19] border-4 border-emerald-500/20 group-hover:border-emerald-500 flex items-center justify-center relative mb-8 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"><span className="text-3xl font-bold text-white font-mono"><AnimatedNumber number={step.number} isHovered={hoveredStep === i} /></span><div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg border-4 border-black"><span className="material-symbols-outlined text-sm">{step.icon}</span></div></div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{step.title}</h3><p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
};

export default Discovery;
