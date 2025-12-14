
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

// Neural Network Particle Background Component
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    // Adjust density based on screen size
    const particleCount = Math.min(Math.floor(width * height / 12000), 100); 
    const connectionDistance = 140;
    const mouseDistance = 250;

    let mouse = { x: -1000, y: -1000 };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3, // Slow, smooth motion
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5
      });
    }

    const onResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and Draw Particles
      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (gentle repulsion)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const pushStrength = 0.02; // Very subtle push
            
            p.vx += forceDirectionX * force * pushStrength;
            p.vy += forceDirectionY * force * pushStrength;
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${0.6})`; // Soft Blue
        ctx.fill();

        // Connect to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx2 = p.x - p2.x;
            const dy2 = p.y - p2.y;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (dist2 < connectionDistance) {
                ctx.beginPath();
                // Gradient line color based on distance
                const opacity = 1 - dist2 / connectionDistance;
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.4})`; // Soft Purple, low opacity
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen dark:mix-blend-normal" />;
};

const Discovery = () => {
  const navigate = useNavigate();
  const { prompts } = useData();

  // Get top 2 trending prompts (mock logic: just first 2)
  const trendingPrompts = prompts.slice(0, 2);

  const FLOATING_CARDS = [
    { icon: 'brush', label: 'Image Gen', text: "Cyberpunk city in neon rain, 8k", color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: 'terminal', label: 'Code', text: "Python script to scrape prices", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: 'edit_note', label: 'Writing', text: "Blog post about AI trends 2025", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: 'movie', label: 'Video', text: "Drone shot of mountains, cinematic", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: 'mail', label: 'Email', text: "Professional follow-up email", color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="pb-10 relative overflow-hidden min-h-screen">
       {/* ANIMATED BACKGROUND START */}
       <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          /* Floating Cards Animation */
          @keyframes floatCard {
            0% { opacity: 0; transform: translateY(40px) scale(0.9) translateX(0); }
            10% { opacity: 1; transform: translateY(0px) scale(1) translateX(-10px); }
            50% { opacity: 1; transform: translateY(-20px) scale(1) translateX(10px); }
            90% { opacity: 0; transform: translateY(-40px) scale(0.9) translateX(0); }
            100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
          }
          .animate-float-card {
             animation: floatCard 10s ease-in-out infinite;
             animation-fill-mode: both;
          }
       `}</style>
       
       <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Base Background */}
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-dark-bg"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          {/* Animated Blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob dark:mix-blend-screen dark:bg-purple-900/20"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000 dark:mix-blend-screen dark:bg-blue-900/20"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000 dark:mix-blend-screen dark:bg-indigo-900/20"></div>

          {/* New Neural Network Canvas Layer */}
          <NeuralBackground />
       </div>
       {/* ANIMATED BACKGROUND END */}

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 flex flex-col items-center text-center min-h-[600px] justify-center">
        
        {/* Floating Prompt Cards (Desktop Only) - Positioned Absolutely to the right side of the Hero */}
        <div className="hidden lg:block absolute top-0 right-0 w-[400px] h-full pointer-events-none z-0">
             <div className="relative w-full h-full">
                {FLOATING_CARDS.map((card, i) => (
                    <div 
                        key={i}
                        className="absolute right-8 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-lg flex items-center gap-3 w-72 animate-float-card"
                        style={{
                            top: `${15 + (i * 18)}%`, // Distribute vertically
                            marginRight: `${i % 2 === 0 ? '0px' : '40px'}`, // Zigzag
                            animationDelay: `${i * 2}s`, // Staggered start
                            opacity: 0 // Start invisible, animation handles opacity
                        }}
                    >
                        <div className={`size-10 rounded-xl flex items-center justify-center ${card.bg} ${card.color} shadow-sm shrink-0`}>
                            <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{card.label}</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{card.text}</p>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                ))}
             </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 mb-8 shadow-sm animate-fadeIn z-10">
           <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Updated Today</span>
        </div>

        <h2 className="text-6xl md:text-8xl font-league font-normal tracking-wide text-slate-900 dark:text-white mb-6 leading-none uppercase flex flex-col items-center relative z-10 drop-shadow-sm">
          <span className="block opacity-0 animate-slideInLeft">
            Discover Trending
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block mt-2 opacity-0 animate-slideInRight [animation-delay:150ms]">
            AI Prompts & Tools
          </span>
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 text-lg animate-fadeIn [animation-delay:300ms] opacity-0 relative z-10 font-medium">
          Your curated hub for the internet's best AI resources to supercharge your workflow.
        </p>

        <div className="w-full max-w-lg relative group mb-10 animate-fadeIn [animation-delay:400ms] opacity-0 z-10">
           <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors text-[24px]">search</span>
           <input 
             type="text" 
             placeholder="Search prompts, tools, categories..." 
             className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-slate-200 dark:border-dark-border shadow-xl shadow-slate-200/50 dark:shadow-black/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all hover:bg-white dark:hover:bg-dark-surface"
           />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fadeIn [animation-delay:500ms] opacity-0 z-10">
            <button 
                onClick={() => navigate('/prompts')}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
                <span className="material-symbols-outlined">chat_spark</span>
                Browse Prompts
            </button>
             <button 
                onClick={() => navigate('/ai-tools')}
                className="flex-1 py-4 rounded-2xl bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-slate-200 dark:border-dark-border text-slate-700 dark:text-white font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <span className="material-symbols-outlined">grid_view</span>
                Explore Tools
            </button>
        </div>
      </section>

      {/* Categories Scroller */}
      <section className="px-4 mb-8 relative z-10">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-center">
            {['All', 'Writing', 'Marketing', 'Coding', 'Image Gen', 'Productivity'].map((cat, i) => (
                <button key={cat} className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-transform active:scale-95 shadow-sm ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-dark-surface'}`}>
                    {cat}
                </button>
            ))}
          </div>
      </section>

      {/* Trending Prompts */}
      <section className="px-6 mb-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Prompts</h3>
            <button onClick={() => navigate('/prompts')} className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingPrompts.map(prompt => (
                <div key={prompt.id} onClick={() => navigate(`/prompts/${prompt.id}`)} className="group bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border hover:-translate-y-1 transition-transform relative overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">{prompt.category}</span>
                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><span className="material-symbols-outlined">bookmark</span></button>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{prompt.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{prompt.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-border">
                        <div className="flex gap-4 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> {prompt.views}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">thumb_up</span> {prompt.likes}</span>
                        </div>
                        <button className="flex items-center gap-1 text-blue-600 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">content_copy</span> Copy
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Discovery;
