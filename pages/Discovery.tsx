
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunitySection from '../components/CommunitySection';
import PlatformHighlights from '../components/PlatformHighlights';

// --- ANIMATED COUNTER (Fast Count Up) ---
const CountUp = ({ end, duration = 1500 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Fast ease-out expo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setCount(Math.floor(ease * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [hasStarted, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

// --- FEATURES SECTION ---
const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
      { 
          title: "Resource Library", 
          desc: "Access a vast collection of curated AI tools and prompts updated daily.", 
          icon: "inventory_2" 
      },
      { 
          title: "Collaborative Projects", 
          desc: "Generate images, logos, and chat with AI in our unified workspace.", 
          icon: "groups" 
      },
      { 
          title: "Live Q&A Sessions", 
          desc: "Connect with creators, share resources, and discover top-rated tools.", 
          icon: "campaign" 
      },
      { 
          title: "Smart Analytics", 
          desc: "Track emerging AI trends with real-time data visualizations.", 
          icon: "trending_up" 
      }
  ];

  return (
    <section className="py-24 px-6 bg-[#F8FAFC] dark:bg-[#080B14] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10" ref={sectionRef}>
        
        {/* LEFT CONTENT */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 text-blue-600 dark:text-blue-400 font-bold text-sm mb-8 border border-blue-100 dark:border-white/10 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span>Features</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                Explore the Powerful <br/> Features of UDX3
            </h2>
            
            <div className="space-y-5 mb-10">
                {[
                    "Interactive AI Tool Directory",
                    "Real-Time Progress Tracking",
                    "Customizable Learning Paths",
                    "Live Instructor Sessions"
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="size-8 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                        </div>
                        <span className="text-lg text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => navigate('/ai-tools')}
                className="hidden lg:flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
            >
                Get Started <span className="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>

        {/* RIGHT CARDS GRID (2x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((card, i) => (
                <div 
                    key={i}
                    className={`bg-white dark:bg-[#151b2b] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.1)] transition-all duration-500 hover:scale-[1.03] group relative overflow-hidden flex flex-col items-center text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                >
                    {/* Dotted Pattern Background */}
                    <div className="absolute inset-0 opacity-30 dark:opacity-5 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center h-full">
                        <div className="size-20 rounded-full bg-blue-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined text-[36px]">{card.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm px-2">
                            {card.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

// --- STEPS TO START SECTION (CUSTOM MOBILE FRAME) ---
const StepsToStartSection = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-[#0B0F19] relative overflow-hidden">
      {/* REQUIRED CUSTOM CSS FOR MOBILE FRAME */}
      <style>{`
        .phone-card {
          width: 200px;
          margin: 0 auto;
          transform: scale(1);
          transition: transform 0.3s ease;
        }
        .phone-card:hover {
          transform: scale(1.05);
        }

        .phone {
          position: relative;
          width: 100%;
          height: 340px; /* Increased slightly for better visibility */
          background-color: #fff6ee;
          border-radius: 30px;
          box-shadow: inset -4px -4px 10px rgba(0, 0, 0, 0.2), 0 20px 40px -10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .front-cam {
          position: absolute;
          width: 7px;
          height: 7px;
          background: #4a4a4a;
          border-radius: 50%;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .side-buttons {
          position: absolute;
          top: 18%;
          right: -4px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .side-btn {
          width: 4px;
          height: 24px;
          background-color: #fca5a5;
          border-radius: 0 50px 50px 0;
          box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.1);
        }

        .side-btn.bottom {
          background-color: #f472b6;
        }

        .screen {
          width: 90%;
          height: 88%;
          background-color: #1e293b;
          border: 4px solid #fff6ee;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          transition: background 0.4s ease;
          cursor: pointer;
          padding: 10px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 shadow-sm mb-6">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">grid_view</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                Steps to Start
            </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* STEP 1 */}
            <div className="flex flex-col items-center group">
                <div className="phone-card mb-8">
                    <div className="phone">
                        <div className="front-cam"></div>
                        <div className="side-buttons">
                            <div className="side-btn"></div>
                            <div className="side-btn bottom"></div>
                        </div>
                        <div className="screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-3">
                            {/* Screen Content: Login Form */}
                            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg mb-2">
                                <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
                            </div>
                            <div className="w-full space-y-2 px-2">
                                <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2"></div>
                                <div className="h-8 w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"></div>
                                <div className="h-8 w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"></div>
                                <div className="h-8 w-full bg-blue-600 rounded-lg shadow-md mt-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 w-full hover:shadow-lg transition-shadow">
                    <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold mb-3">Step 01</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create an Account</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Create an account to start exploring and enrolling in courses.</p>
                </div>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col items-center group">
                <div className="phone-card mb-8">
                    <div className="phone">
                        <div className="front-cam"></div>
                        <div className="side-buttons">
                            <div className="side-btn"></div>
                            <div className="side-btn bottom"></div>
                        </div>
                        <div className="screen bg-slate-50 dark:bg-slate-900 !justify-start pt-4 gap-2">
                            {/* Screen Content: Dashboard */}
                            <div className="w-full flex justify-between items-center mb-2 px-1">
                                <div className="h-2 w-12 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                <div className="size-6 rounded-full bg-purple-500"></div>
                            </div>
                            <div className="w-full h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-2 flex items-center px-2">
                                <div className="size-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 w-full flex-1">
                                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg h-16"></div>
                                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg h-16"></div>
                                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg h-16"></div>
                                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg h-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 w-full hover:shadow-lg transition-shadow">
                    <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold mb-3">Step 02</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Explore Tools & Prompts</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Complete your courses by engaging with all lessons and assignments.</p>
                </div>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col items-center group">
                <div className="phone-card mb-8">
                    <div className="phone">
                        <div className="front-cam"></div>
                        <div className="side-buttons">
                            <div className="side-btn"></div>
                            <div className="side-btn bottom"></div>
                        </div>
                        <div className="screen bg-slate-50 dark:bg-slate-900 !justify-start pt-6 gap-3">
                            {/* Screen Content: Stats */}
                            <div className="w-full text-center mb-2">
                                <div className="h-3 w-24 bg-slate-800 dark:bg-white rounded-full mx-auto"></div>
                            </div>
                            <div className="size-24 rounded-full border-[6px] border-green-500 border-t-transparent mx-auto flex items-center justify-center">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">78%</span>
                            </div>
                            <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700 mt-2">
                                <div className="flex justify-between mb-2">
                                    <div className="h-2 w-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                                    <div className="h-2 w-4 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 w-full hover:shadow-lg transition-shadow">
                    <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold mb-3">Step 03</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Track & Improve</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Earn certificates upon course completion to showcase your new skills.</p>
                </div>
            </div>

        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
            <button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
            >
                Get Started Now
            </button>
        </div>
      </div>
    </section>
  );
};

// --- COMPARISON SECTION (ASTON STYLE) ---
const ComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const otherPoints = [
    "Limited or generic AI tools",
    "Rigid, scheduled course timings",
    "Certification not always provided",
    "Limited or no mobile app support",
    "One-size-fits-all approach",
    "Delayed or minimal feedback",
    "Basic or no progress tracking"
  ];

  const udxPoints = [
    "Extensive range of AI tools & prompts",
    "Self-paced and flexible schedules",
    "Earn certificates for all courses",
    "Fully functional mobile app",
    "Personalized learning paths",
    "Immediate AI feedback & support",
    "Detailed progress analytics"
  ];

  return (
    <section className="py-24 px-6 bg-[#F8FAFC] dark:bg-[#080B14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10" ref={sectionRef}>
            
            {/* Header */}
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-6">
                    <span className="material-symbols-outlined text-blue-600 text-[20px]">balance</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Comparison</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                    Choosing UDX3 Over <br className="hidden md:block" /> Others
                </h2>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                {/* Left Card: Other Platforms */}
                <div className={`bg-[#F1F5F9] dark:bg-[#151b2b]/50 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    
                    {/* Dotted Texture Background */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none rounded-[2.5rem]" 
                         style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                    </div>

                    <div className="text-center mb-10 pb-6 border-b border-slate-200/50 dark:border-slate-700/50 relative z-10">
                        <h3 className="text-2xl font-display font-bold text-slate-700 dark:text-slate-300">Other Platforms</h3>
                    </div>
                    
                    <ul className="space-y-6 relative z-10">
                        {otherPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[14px] font-bold">close</span>
                                </div>
                                <span className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-snug">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Card: UDX3 (Highlighted) */}
                <div className={`relative bg-white dark:bg-[#1a2230] rounded-[2.5rem] p-10 border-2 border-blue-100 dark:border-blue-900/30 shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] transition-all duration-1000 delay-400 transform hover:-translate-y-2 z-10 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    
                    {/* Top Glow & Accent */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-600/10 dark:to-transparent rounded-t-[2.5rem] pointer-events-none"></div>
                    <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>

                    {/* Header with Logo Badge */}
                    <div className="relative text-center mb-10 pb-6 border-b border-blue-50 dark:border-slate-700/50 flex justify-center">
                        <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-600/20 transform transition-transform hover:scale-105">
                            <div className="size-6 bg-white/20 rounded-md flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight">UDX3</span>
                        </div>
                    </div>

                    <ul className="space-y-6 relative z-10">
                        {udxPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="size-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-green-500/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                                </div>
                                <span className="text-slate-800 dark:text-white font-semibold text-lg leading-snug">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    </section>
  );
};

// --- ABOUT & MISSION SECTION ---
const AboutMissionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    { name: "Olivia Brown", text: "Incredible courses that exceeded my expectations. Worth every penny!", avatar: "https://i.pravatar.cc/100?img=5" },
    { name: "Liam Davis", text: "The community support is fantastic. Very engaging and helpful.", avatar: "https://i.pravatar.cc/100?img=11" },
    { name: "Sophia Wilson", text: "UDX3 made it easy to find the right AI tools for my projects.", avatar: "https://i.pravatar.cc/100?img=9" },
    { name: "Noah Martinez", text: "Clean design, fast tools, and super useful resources.", avatar: "https://i.pravatar.cc/100?img=3" }
  ];

  return (
    <section className="py-20 px-6 bg-[#F8FAFC] dark:bg-[#080B14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10" ref={sectionRef}>
            
            {/* LEFT: Hero Image Card with Marquee */}
            <div className={`relative h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {/* Background Image of People */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80")' }}></div>
                
                {/* Blue Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-blue-500/40 to-transparent mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-blue-900/80"></div>

                {/* Top Logo */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="size-20 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                        <div className="size-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner">
                            <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
                        </div>
                    </div>
                </div>

                {/* Floating Testimonial Slider (Marquee) */}
                <div className="absolute bottom-8 left-0 right-0 z-20 overflow-hidden py-4 mask-fade-edges">
                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee-testimonials {
                            display: flex;
                            gap: 1rem;
                            width: max-content;
                            animation: marquee 25s linear infinite;
                        }
                        .animate-marquee-testimonials:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
                    <div className="animate-marquee-testimonials pl-4">
                        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                            <div key={i} className="w-72 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50 flex flex-col gap-2 cursor-default hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-3">
                                    <img src={t.avatar} alt={t.name} className="size-10 rounded-full object-cover border border-slate-200" />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                                        <div className="flex text-amber-400 text-[10px]">
                                            {'★★★★★'.split('').map((s, si) => <span key={si}>{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Content */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-6">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">groups</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">About Us</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                    Learn More About UDX3 and <br className="hidden lg:block"/> Our Mission
                </h2>
                
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    At UDX3, we are dedicated to revolutionizing the creative workflow with innovative AI tools and prompts tailored to your needs. Our mission is to empower creators worldwide through accessible, engaging, and high-quality resources, supported by a passionate community of experts and professionals.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                    <button 
                        onClick={() => navigate('/signup')}
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                    >
                        Get Started Now
                    </button>
                    <button className="px-8 py-3.5 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        Contact Us
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div>
                        <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center">
                            3,420<span className="text-blue-600 text-xl ml-0.5">+</span>
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Successful Users</p>
                    </div>
                    <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
                        <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center">
                            850<span className="text-blue-600 text-xl ml-0.5">+</span>
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">AI Tools & Prompts</p>
                    </div>
                    <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
                        <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center">
                            297<span className="text-blue-600 text-xl ml-0.5">+</span>
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Contributors</p>
                    </div>
                </div>
            </div>

        </div>
    </section>
  );
};

// --- WHO CAN USE SECTION ---
const WhoCanUseSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const accordionItems = [
    {
      title: "Students and Lifelong Learners",
      icon: "person_book",
      desc: "Empower individuals who want to explore AI tools, prompts, and modern skills beyond traditional learning, helping them grow personally and professionally."
    },
    {
      title: "Educators and Trainers",
      icon: "school",
      desc: "Support educators, mentors, and trainers who want to integrate AI tools, prompts, and workflows into teaching, content creation, and curriculum development."
    },
    {
      title: "Corporate Professionals and Teams",
      icon: "groups",
      desc: "Enable professionals, startups, and teams to discover AI solutions, optimize workflows, improve productivity, and make data-driven decisions."
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#F8FAFC] dark:bg-[#080B14] relative overflow-hidden border-t border-slate-100 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        
        {/* Header */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-6">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">how_to_reg</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Who Can Use</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                Ideal Users, Who UDX3 <br className="hidden md:block"/> Empowers
            </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* LEFT: Accordion */}
            <div className={`flex flex-col gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {accordionItems.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <div 
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`cursor-pointer transition-all duration-500 ease-in-out ${isActive ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'} rounded-2xl border ${isActive ? 'border-slate-100 dark:border-slate-700' : 'border-transparent'}`}
                        >
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <span className={`material-symbols-outlined text-2xl ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {item.icon}
                                    </span>
                                    <h3 className={`text-lg font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {item.title}
                                    </h3>
                                </div>
                                <div className={`size-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-slate-100 dark:bg-slate-700 rotate-45' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>add</span>
                                </div>
                            </div>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed pl-[3.5rem]">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* RIGHT: Visual Card */}
            <div className={`relative h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                {/* Image Section (Top 75%) */}
                <div className="absolute top-0 left-0 right-0 bottom-[140px] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6 bg-white dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                        <img src="https://i.pravatar.cc/100?img=12" alt="Pro" className="size-6 rounded-full border border-white" />
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Made for professionals</span>
                    </div>
                </div>

                {/* Bottom CTA Area (Bottom 25%) */}
                <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-white dark:bg-[#151b2b] p-8 flex items-center justify-between">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ready to Get Started?</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Connect with us now</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full font-bold transition-all group">
                        Contact Us 
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

// --- TEAM SECTION ---
const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const team = [
    { 
      name: "Anik Hossen Tonmoy", 
      role: "Founder & Product Lead", 
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Ifteker Sulaiman", 
      role: "AI Research & Tools Specialist", 
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Partho Biswas", 
      role: "Frontend / UI Engineer", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Mr X", 
      role: "Operations & Strategy", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#F8FAFC] dark:bg-[#080B14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-6">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">badge</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                Our Team Members
            </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
                <div 
                    key={index}
                    className={`bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                >
                    {/* Image Container with Dotted Background */}
                    <div className="relative h-64 rounded-3xl bg-slate-50 dark:bg-slate-900/50 mb-4 overflow-hidden flex items-end justify-center">
                        {/* Dotted Texture */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }}>
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-50"></div>
                        
                        <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex justify-between items-end px-2 pb-2">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{member.role}</p>
                        </div>
                        <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 hover:opacity-100 transition-opacity">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                             </svg>
                        </a>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

// --- FAQ SECTION ---
const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: "How secure is my data on UDX3?",
      a: "UDX3 follows industry-standard security practices to protect user data and ensure safe access across the platform. We utilize end-to-end encryption for sensitive information."
    },
    {
      q: "Is UDX3 free to use?",
      a: "UDX3 offers free access to selected tools and resources, with additional premium features available as the platform grows to support advanced needs."
    },
    {
      q: "Do I need technical knowledge to use UDX3?",
      a: "No. UDX3 is designed to be user-friendly for beginners while still powerful for advanced users. Our interface is intuitive and requires no coding skills."
    },
    {
      q: "Can I use UDX3 on mobile devices?",
      a: "Yes. UDX3 is fully responsive and works seamlessly across desktop, tablet, and mobile devices, allowing you to access tools on the go."
    },
    {
      q: "How often is the platform updated?",
      a: "UDX3 is continuously improved with new tools, prompts, and features added regularly based on community feedback and emerging AI trends."
    },
    {
        q: "What kind of support do you offer?",
        a: "We provide comprehensive support through our documentation, community forums, and direct email support for account-related inquiries."
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#F8FAFC] dark:bg-[#080B14] relative overflow-hidden">
      <div className="max-w-4xl mx-auto" ref={sectionRef}>
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-6">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">help</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">FAQ's</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                Frequently Asked Questions
            </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
            {faqs.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                    <div 
                        key={index}
                        onClick={() => setActiveIndex(isActive ? -1 : index)} 
                        className={`group cursor-pointer rounded-3xl border transition-all duration-500 overflow-hidden ${
                            isActive 
                            ? 'bg-white dark:bg-[#151b2b] border-slate-200 dark:border-slate-700 shadow-lg' 
                            : 'bg-[#F1F5F9] dark:bg-slate-800/30 border-transparent hover:bg-white dark:hover:bg-slate-800'
                        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div className="p-6 md:p-8 flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h3 className={`text-lg md:text-xl font-bold transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                    {item.q}
                                </h3>
                                <div 
                                    className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Icon */}
                            <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isActive 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-180' 
                                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900'
                            }`}>
                                <span className="material-symbols-outlined text-[24px] font-bold">
                                    {isActive ? 'remove' : 'add'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

      </div>
    </section>
  );
};

// --- FINAL CTA SECTION (CUSTOM) ---
const UDX3FinalCTA = () => {
  return (
    <section className="final-cta">
      <style>{`
        .final-cta {
          padding: 72px 16px;
          display: flex;
          justify-content: center;
          /* Ensure it respects dark mode background of parent if needed, though it has its own background */
        }

        .final-cta__card {
          width: min(1100px, 100%);
          border-radius: 44px;
          position: relative;
          overflow: hidden;
          padding: 64px 24px;
          border: 2px solid rgba(255,255,255,0.7);
          box-shadow: 0 30px 90px rgba(0,0,0,0.18);
          text-align: center;

          /* BLUE BASE + GRID MUST LOOK LIKE INSPO */
          background:
            radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%),
            radial-gradient(900px 500px at 15% 10%, rgba(5,35,80,0.35), rgba(5,35,80,0) 60%),
            radial-gradient(900px 500px at 85% 10%, rgba(5,35,80,0.35), rgba(5,35,80,0) 60%),
            linear-gradient(135deg, #2b8cff 0%, #1f6fff 45%, #2b8cff 100%);
        }

        .final-cta__card::before {
          /* Perspective grid floor effect */
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%),
            repeating-linear-gradient(to right, rgba(255,255,255,0.20) 0 1px, transparent 1px 42px),
            repeating-linear-gradient(to bottom, rgba(255,255,255,0.20) 0 1px, transparent 1px 42px);
          transform: perspective(800px) rotateX(55deg) translateY(120px);
          transform-origin: bottom;
          opacity: 0.35;
          pointer-events: none;
        }

        .final-cta__card::after {
          /* subtle diagonal texture */
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            135deg,
            rgba(255,255,255,0.10) 0px,
            rgba(255,255,255,0.10) 2px,
            transparent 2px,
            transparent 10px
          );
          opacity: 0.10;
          pointer-events: none;
        }

        .final-cta__logoWrap {
          position: relative;
          width: 84px;
          height: 84px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          margin: 0 auto 18px;
          isolation: isolate;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
        }

        .final-cta__logo {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 999px;
          position: relative;
          z-index: 3;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          user-select: none;
          -webkit-user-drag: none;
        }

        .final-cta__halo {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          z-index: 2;
          border: 1px solid rgba(255,255,255,0.35);
          box-shadow:
            0 0 0 1px rgba(0,170,255,0.18) inset,
            0 0 24px rgba(0,170,255,0.20);
          pointer-events: none;
        }

        /* Flame glow ring */
        .final-cta__logoWrap::before {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: inherit;
          z-index: 1;
          background:
            radial-gradient(closest-side, rgba(255,255,255,0.80), rgba(255,255,255,0.00) 62%),
            radial-gradient(closest-side, rgba(0,170,255,0.70), rgba(0,170,255,0.00) 65%);
          filter: blur(10px);
          opacity: 0.85;
          transform: rotate(0deg) scale(1);
          animation: udx3FlamePulse 2.4s ease-in-out infinite;
        }

        /* Flame shimmer */
        .final-cta__logoWrap::after {
          content: "";
          position: absolute;
          inset: -18px;
          border-radius: inherit;
          z-index: 0;
          background:
            conic-gradient(
              from 0deg,
              rgba(0,180,255,0.00),
              rgba(0,180,255,0.65),
              rgba(255,255,255,0.55),
              rgba(0,180,255,0.65),
              rgba(0,180,255,0.00)
            );
          filter: blur(18px);
          opacity: 0.65;
          transform: rotate(0deg) scale(1);
          animation: udx3FlameSpin 3.6s linear infinite;
        }

        @keyframes udx3FlamePulse {
          0%   { transform: rotate(0deg) scale(0.98); opacity: 0.65; }
          35%  { transform: rotate(10deg) scale(1.05); opacity: 0.95; }
          70%  { transform: rotate(-8deg) scale(1.02); opacity: 0.80; }
          100% { transform: rotate(0deg) scale(0.98); opacity: 0.65; }
        }

        @keyframes udx3FlameSpin {
          0%   { transform: rotate(0deg) scale(1.02); opacity: 0.50; }
          50%  { transform: rotate(180deg) scale(1.08); opacity: 0.78; }
          100% { transform: rotate(360deg) scale(1.02); opacity: 0.50; }
        }

        .final-cta__title {
          color: #fff;
          font-size: clamp(34px, 4.2vw, 56px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 10px 0 8px;
          position: relative;
          z-index: 10;
        }

        .final-cta__subtitle {
          color: rgba(255,255,255,0.88);
          max-width: 760px;
          margin: 0 auto 22px;
          font-size: 16px;
          line-height: 1.6;
          position: relative;
          z-index: 10;
        }

        .final-cta__pills {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 26px;
          position: relative;
          z-index: 10;
        }

        .final-cta__pill {
          background: rgba(255,255,255,0.92);
          color: rgba(0,0,0,0.8);
          padding: 10px 20px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .final-cta__tick {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .final-cta__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: rgba(0,0,0,0.78);
          font-weight: 700;
          border-radius: 999px;
          padding: 14px 26px;
          text-decoration: none;
          box-shadow: 0 16px 40px rgba(0,0,0,0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 10;
        }

        .final-cta__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 55px rgba(0,0,0,0.22);
        }

        @media (prefers-reduced-motion: reduce) {
          .final-cta__logoWrap::before,
          .final-cta__logoWrap::after { animation: none; }
        }
      `}</style>
      <div className="final-cta__card">
        <div className="final-cta__logoWrap" aria-label="UDX3">
          <span className="final-cta__halo" />
          <img
            className="final-cta__logo"
            src="/IMG_2789.JPG"
            alt="UDX3"
            draggable="false"
          />
        </div>

        <h2 className="final-cta__title">Get Started with UDX3</h2>
        <p className="final-cta__subtitle">
          Ready to explore AI tools, curated prompts, and platform features? Join UDX3 and start building smarter today.
        </p>

        <div className="final-cta__pills">
          <span className="final-cta__pill">
            <img src="/check-mark.png" alt="✓" className="final-cta__tick" />
            Instant Access
          </span>
          <span className="final-cta__pill">
            <img src="/check-mark.png" alt="✓" className="final-cta__tick" />
            Curated AI Tools
          </span>
          <span className="final-cta__pill">
            <img src="/check-mark.png" alt="✓" className="final-cta__tick" />
            Community Support
          </span>
        </div>

        <a className="final-cta__button" href="/signup">Get Started Now</a>
      </div>
    </section>
  );
};

// --- FEATURE SCREENS COMPONENTS (Stable References) ---
const ToolsScreen = () => (
    <div className="w-full h-full p-6 flex flex-col gap-4 select-none">
        <div className="flex justify-between items-center mb-2">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-8 w-24 bg-blue-600 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="size-10 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-lg mb-3"></div>
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded mb-1"></div>
                    <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                </div>
            ))}
        </div>
    </div>
);

const PromptsScreen = () => (
    <div className="w-full h-full flex select-none">
        <div className="w-16 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full flex flex-col items-center py-4 gap-4">
            {[1,2,3].map(i => <div key={i} className="size-8 rounded-lg bg-slate-300 dark:bg-slate-600"></div>)}
        </div>
        <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1 space-y-4">
                <div className="flex gap-3">
                    <div className="size-8 rounded-full bg-blue-600 flex-shrink-0"></div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl rounded-tl-none p-3 w-3/4 h-16"></div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                    <div className="size-8 rounded-full bg-green-500 flex-shrink-0"></div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl rounded-tr-none p-3 w-2/3 h-24 border border-blue-200 dark:border-blue-800"></div>
                </div>
            </div>
            <div className="mt-4 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full"></div>
        </div>
    </div>
);

const AnalyticsScreen = () => (
    <div className="w-full h-full p-6 flex flex-col gap-6 select-none">
        <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="h-2 w-8 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="h-5 w-16 bg-slate-900 dark:bg-slate-200 rounded"></div>
                </div>
            ))}
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-end justify-between gap-2">
            {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
                <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group">
                    <div 
                        className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-sm transition-all duration-1000"
                        style={{ height: `${h}%` }}
                    ></div>
                </div>
            ))}
        </div>
    </div>
);

const CommunityScreen = () => (
    <div className="w-full h-full p-6 flex flex-col gap-4 select-none">
        <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20"></div>
            <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
            </div>
        </div>
        <div className="space-y-3">
            {[1,2].map(i => (
                <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-3/4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                        <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- FEATURE SHOWCASE SECTION ---
const FeatureShowcaseSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const slides = [
    { id: 'tools', title: 'AI Tools Directory', component: <ToolsScreen /> },
    { id: 'prompts', title: 'Prompt Library', component: <PromptsScreen /> },
    { id: 'analytics', title: 'Analytics Dashboard', component: <AnalyticsScreen /> },
    { id: 'community', title: 'Community Learning', component: <CommunityScreen /> }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <section className="py-24 px-6 bg-white dark:bg-[#0B0F19] relative overflow-hidden border-t border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide mb-6 border border-blue-100 dark:border-blue-800">
                    <span className="material-symbols-outlined text-[16px]">web</span>
                    <span>Platform Preview</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-[1.15]">
                    Explore UDX3 Platform <br/> Features in Action
                </h2>
                
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                    Dive into a seamless ecosystem designed for creators and businesses. Discover advanced AI tools, curated prompts, interactive learning paths, and real-time analytics—all in one unified dashboard.
                </p>

                <div className="flex flex-col gap-4">
                    {slides.map((slide, index) => (
                        <div 
                            key={slide.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                activeSlide === index 
                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                            onClick={() => setActiveSlide(index)}
                        >
                            <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${activeSlide === index ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <span className="material-symbols-outlined text-[20px]">
                                    {index === 0 ? 'grid_view' : index === 1 ? 'lightbulb' : index === 2 ? 'query_stats' : 'school'}
                                </span>
                            </div>
                            <span className={`font-bold transition-colors ${activeSlide === index ? 'text-blue-900 dark:text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                {slide.title}
                            </span>
                            {activeSlide === index && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT MOCKUP */}
            <div 
                className="relative perspective-1000"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Browser Frame */}
                <div className="relative bg-white dark:bg-[#1a2230] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform rotate-y-[-5deg] rotate-x-[2deg] transition-transform duration-500 hover:rotate-0">
                    {/* Browser Bar */}
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="size-3 rounded-full bg-red-400"></div>
                            <div className="size-3 rounded-full bg-yellow-400"></div>
                            <div className="size-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 mx-4 h-6 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                            udx3-platform.ai/dashboard
                        </div>
                    </div>

                    {/* Viewport Area */}
                    <div className="relative h-[400px] bg-slate-50 dark:bg-[#0B0F19] overflow-hidden">
                        {slides.map((slide, index) => (
                            <div 
                                key={index}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                {slide.component}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Decorative Elements around mockup */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -left-5 top-10 w-20 h-20 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>
            </div>

        </div>
    </section>
  );
};

// --- MOBILE APP FEATURES SECTION (MATCHING REFERENCE) ---
const MobileAppSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: "wifi_off", label: "Offline Access" },
    { icon: "notifications_active", label: "Push Notifications" },
    { icon: "quiz", label: "Interactive Quizzes" },
    { icon: "insights", label: "Progress Tracking" },
    { icon: "download_for_offline", label: "Resource Downloads" },
    { icon: "chat", label: "In-App Messaging" },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white dark:bg-[#0B0F19] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT: Phone Visual */}
            <div className={`relative transition-all duration-1000 ease-out z-10 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {/* Blue Gradient Background Card */}
                <div className="relative w-full max-w-md mx-auto aspect-square lg:aspect-[4/3] rounded-[3rem] bg-gradient-to-br from-blue-500 to-blue-600 overflow-visible shadow-2xl flex items-center justify-center p-8 sm:p-12 group">
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.4) 0%, transparent 20%)' }}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

                    {/* Phone Mockup (CSS Only) */}
                    <div className="relative w-[260px] h-[520px] bg-[#0f172a] rounded-[2.5rem] border-[8px] border-[#1e293b] shadow-2xl overflow-hidden transform rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500 ease-out-expo">
                        {/* Dynamic Island */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-b-xl z-20"></div>
                        
                        {/* Screen Content */}
                        <div className="w-full h-full bg-slate-50 dark:bg-[#0B0F19] pt-8 flex flex-col relative select-none">
                            {/* Header */}
                            <div className="px-4 py-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="flex flex-col">
                                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                        <div className="h-1.5 w-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 text-lg">notifications</span>
                            </div>

                            {/* Search */}
                            <div className="px-4 mb-4">
                                <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-full flex items-center px-3">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
                                </div>
                            </div>

                            {/* Ongoing Projects */}
                            <div className="px-4 mb-2"><div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
                            <div className="px-4 flex-1 space-y-3 overflow-hidden">
                                {/* Card 1 */}
                                <div className="p-3 bg-white dark:bg-[#151b2b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between mb-2">
                                        <div className="h-4 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold">High Priority</div>
                                        <div className="text-[8px] text-gray-400">Due 25 May</div>
                                    </div>
                                    <div className="h-3 w-3/4 bg-gray-800 dark:bg-gray-200 rounded mb-2"></div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mb-1"></div>
                                    <div className="h-2 w-2/3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex -space-x-1.5">
                                            {[1,2,3].map(i => <div key={i} className="size-5 rounded-full bg-gray-200 border border-white"></div>)}
                                        </div>
                                        <div className="text-[8px] text-gray-400">16 Comments</div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="p-3 bg-white dark:bg-[#151b2b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 opacity-90">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-[10px] font-bold text-gray-800 dark:text-white">Meeting with Clients</div>
                                        <div className="size-4 rounded-full bg-blue-500 text-white flex items-center justify-center"><span className="material-symbols-outlined text-[10px]">check</span></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] text-gray-400 mb-2">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span> 10:00 am - 12:00 pm
                                    </div>
                                    <div className="flex -space-x-1.5">
                                        {[1,2,3].map(i => <div key={i} className="size-5 rounded-full bg-gray-200 border border-white"></div>)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bottom Nav */}
                            <div className="h-14 bg-white dark:bg-[#151b2b] border-t border-gray-100 dark:border-gray-800 flex justify-around items-center px-2">
                                <span className="material-symbols-outlined text-blue-600 text-xl">home</span>
                                <span className="material-symbols-outlined text-gray-300 text-xl">grid_view</span>
                                <span className="material-symbols-outlined text-gray-300 text-xl">chat</span>
                                <span className="material-symbols-outlined text-gray-300 text-xl">person</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Labels */}
                    <div className={`absolute top-[40%] -right-6 lg:-right-10 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 z-30 transition-all duration-700 delay-300 hover:scale-105 cursor-default ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        <span className="material-symbols-outlined text-blue-500 text-lg">add</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">Smart Prioritization</span>
                    </div>

                    <div className={`absolute bottom-[25%] -left-6 lg:-left-10 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 z-30 transition-all duration-700 delay-500 hover:scale-105 cursor-default ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">database</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">Real-Time Sync</span>
                    </div>

                </div>
            </div>

            {/* RIGHT: Content */}
            <div className={`transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide mb-6 border border-blue-100 dark:border-blue-800">
                    <span className="material-symbols-outlined text-[16px]">smartphone</span>
                    <span>Mobile App</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-[1.15]">
                    Explore Our Mobile <br/> App Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-10">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 group">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                            <span className="text-base font-medium text-slate-700 dark:text-slate-300">{feature.label}</span>
                        </div>
                    ))}
                </div>

                {/* Demo Card */}
                <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-800 p-2 pr-6 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                    <div className="size-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white group-hover:text-white text-2xl ml-1">play_arrow</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Learn how to use the app</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Watch the demo</p>
                    </div>
                </div>
            </div>

        </div>
    </section>
  );
};

// --- NEW IMPRESSIVE FIGURES & FACTS SECTION ---
const InnovationStats = () => {
  return (
    <section className="py-24 px-6 bg-[#F8FAFC] dark:bg-[#0B0F19] relative overflow-hidden">
      {/* Background Decor - Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" 
               style={{ 
                   backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)', 
                   backgroundSize: '40px 40px' 
               }}>
          </div>
          {/* Soft central fade for grid */}
          <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-b from-white/0 via-white to-white/0 dark:from-[#0B0F19]/0 dark:via-[#0B0F19] dark:to-[#0B0F19]/0 transform -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Side - Stats Grid (Connected Node Structure) */}
        <div className="relative flex flex-col items-center justify-center py-8">
            {/* Connection Lines (Desktop Only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-slate-200 dark:border-slate-800 rounded-3xl -z-10 hidden sm:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-slate-200 dark:border-slate-800 -z-10 bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-800 to-transparent hidden sm:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-slate-200 dark:border-slate-800 -z-10 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent hidden sm:block"></div>

            {/* Top Card: Total Users */}
            <div className="mb-8 relative z-10 group">
                <div className="w-64 h-40 bg-white dark:bg-[#151b2b] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-5xl font-display font-bold text-slate-900 dark:text-white mb-2 flex items-start">
                        <CountUp end={3400} duration={2000} />
                        <span className="text-blue-600 text-3xl mt-1">+</span>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">Total Users</p>
                </div>
            </div>

            {/* Middle Row: Prompts & Years */}
            <div className="flex flex-col sm:flex-row justify-between w-full max-w-lg mb-8 gap-4 relative z-10">
                {/* Left Card: Prompts */}
                <div className="group w-full flex justify-center">
                    <div className="w-52 h-36 bg-white dark:bg-[#151b2b] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-4 transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-1 flex items-start">
                            <CountUp end={1200} duration={1500} />
                            <span className="text-purple-500 text-2xl mt-1">+</span>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide">Pro Prompts</p>
                    </div>
                </div>

                {/* Right Card: Experience */}
                <div className="group w-full flex justify-center">
                    <div className="w-52 h-36 bg-white dark:bg-[#151b2b] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-4 transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-1 flex items-start">
                            <CountUp end={2} duration={1000} />
                            <span className="text-indigo-500 text-2xl mt-1">+</span>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide">Years Active</p>
                    </div>
                </div>
            </div>

            {/* Bottom Card: Tools */}
            <div className="relative z-10 group">
                <div className="w-64 h-40 bg-white dark:bg-[#151b2b] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-5xl font-display font-bold text-slate-900 dark:text-white mb-2 flex items-start">
                        <CountUp end={850} duration={1800} />
                        <span className="text-green-500 text-3xl mt-1">+</span>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">AI Tools</p>
                </div>
            </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="text-center lg:text-left relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-sm mb-8 border border-blue-100 dark:border-blue-800">
                <span className="material-symbols-outlined text-[20px]">ads_click</span>
                <span>Numbers</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Impressive Figures <br/> <span className="text-slate-400 dark:text-slate-600">and Facts</span>
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Explore our key statistics and milestones that showcase our growth, impact, and success in transforming the AI learning experience for users worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-base transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-1"
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                >
                    Get Started Now
                </button>
                <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-full font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-1">
                    Contact Us
                </button>
            </div>
        </div>

      </div>
    </section>
  );
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

// --- CINEMATIC 3D HERO (3 SCENES) ---
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
    // Height 800vh for slower, more deliberate pacing across 3 scenes
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

        /* --- SCENE 2 STYLES --- */
        .scene-2 {
            opacity: calc(1 - max(0, abs(var(--scroll) - 0.45) - 0.2) * 10);
            transform: translateZ(calc((var(--scroll) - 0.45) * 500px));
            display: flex;
        }

        .prompt-cloud {
            transform-style: preserve-3d;
            transform: rotateX(calc(var(--mouse-y) * 8deg)) rotateY(calc(var(--mouse-x) * 8deg));
        }

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
        
        @keyframes float-fast {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float-3s { animation: float-fast 3s ease-in-out infinite; }

        /* --- SCENE 3 STYLES --- */
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
            .hero-camera { 
                position: relative; 
                height: auto; 
                overflow: visible; 
                display: flex; 
                flex-direction: column; 
                padding-bottom: 0px;
            }
            
            .scene-layer { 
                position: relative; 
                height: auto; 
                min-height: 100vh; 
                transform: none !important; 
                opacity: 1 !important; 
                display: flex !important; 
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .scene-1 { 
                padding-top: 60px;
                justify-content: center;
            }
            .ai-core-container { 
                margin-right: 0; 
                margin-bottom: 30px; 
                transform: scale(0.65); 
            }
            .ai-core-orb { width: 220px; height: 220px; }
            .ring-1 { width: 280px; height: 280px; }
            .ring-2 { width: 320px; height: 320px; }
            .ring-3 { width: 360px; height: 360px; }
            
            .scene-1-text { 
                transform: none !important; 
                text-align: center; 
                width: 100%;
            }
            .scene-1-text h1 { font-size: 3rem; line-height: 1; }
            .scene-1-text p { font-size: 1rem; max-width: 90%; margin-left: auto; margin-right: auto; }
            
            .scene-2 { 
                opacity: 1 !important; 
                transform: none !important; 
                display: flex !important; 
                flex-direction: column; 
                gap: 20px; 
                overflow: visible; 
                padding-top: 40px;
                padding-bottom: 40px;
            }
            .prompt-cloud { 
                transform: scale(0.85) !important; 
                margin-bottom: 0; 
                height: auto; 
            }
            .terminal-window { 
                width: 90vw; 
                max-width: 400px; 
                height: auto; 
                min-height: 280px; 
            }
            
            /* Hide complex floating cards on mobile to prevent clutter */
            .absolute.p-4.rounded-2xl { display: none; }
            
            .scene-3 { 
                opacity: 1 !important; 
                pointer-events: auto !important; 
                min-height: 80vh;
            }
            .scene-3 h2 { font-size: 2.5rem; }
            .tool-matrix { 
                transform: none !important; 
                grid-template-columns: repeat(3, 1fr); 
                gap: 12px; 
                opacity: 1 !important; 
                margin-bottom: 40px;
            }
            .matrix-tile { width: 64px; height: 64px; border-radius: 12px; }
            .matrix-tile img { width: 28px; height: 28px; }
            
            .bg-noise {
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
            }
        }
      `}</style>
    </div>
  );
};

const Discovery = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-[#080B14]">
      <CinematicHero />
      <InnovationStats />
      <FeatureShowcaseSection />
      <FeaturesSection />
      <MobileAppSection />
      <PlatformHighlights />
      <StepsToStartSection />
      <CommunitySection />
      <ComparisonSection />
      <WhoCanUseSection />
      <AboutMissionSection />
      <TeamSection />
      <FAQSection />
      <UDX3FinalCTA />
    </div>
  );
};

export default Discovery;
