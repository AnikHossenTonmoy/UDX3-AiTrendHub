
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GeminiBackend } from '../services/GeminiBackend';

const AnimatedNumber = ({ number, isHovered }: { number: string; isHovered: boolean }) => {
  const [display, setDisplay] = useState(number);
  useEffect(() => {
    if (isHovered) {
      let count = 0;
      const interval = setInterval(() => {
        setDisplay(Math.floor(Math.random() * 99).toString().padStart(2, '0'));
        count++;
        if (count > 8) {
          clearInterval(interval);
          setDisplay(number);
        }
      }, 40);
      return () => clearInterval(interval);
    } else {
      setDisplay(number);
    }
  }, [isHovered, number]);
  return <span>{display}</span>;
};

const PromptDirectory = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const { requireAuth } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genInputs, setGenInputs] = useState({
      category: '',
      tone: '',
      audience: '',
      purpose: '',
      details: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatorRef = useRef<HTMLDivElement>(null);
  const [isGeneratorVisible, setIsGeneratorVisible] = useState(false);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false);
  const creationRef = useRef<HTMLDivElement>(null);
  const [isCreationVisible, setIsCreationVisible] = useState(false);

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

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory || (activeCategory === 'Art' && (p.category === 'Image Generation' || p.category === 'Art'));
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName('spotlight-card');
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
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
      `}</style>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100"></div>
            <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">The Largest AI Prompt Library</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight drop-shadow-sm">
                Find the perfect <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    AI Prompt
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Unlock the full potential of ChatGPT, Midjourney, and Claude with our curated collection of copy-paste prompts.
            </p>

            <div className="max-w-3xl mx-auto relative group z-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-white dark:bg-[#151b2b] rounded-full shadow-2xl border border-slate-200 dark:border-slate-700/60 p-2 transition-all group-hover:border-blue-500/50 group-focus-within:ring-4 ring-blue-500/10">
                    <div className="pl-6 text-slate-400">
                        <span className="material-symbols-outlined text-2xl">search</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search for 'SEO Blog Post', 'Cyberpunk Art', 'Python Script'..." 
                        className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 text-lg h-14"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-bold transition-all hover:scale-105 active:scale-95 hidden sm:block shadow-lg shadow-blue-600/20">
                        Search
                    </button>
                </div>
            </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-8">
            {/* Card 1 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-500/50 hover:bg-white/20 dark:hover:bg-[#131620] cursor-pointer">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300" style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.1), transparent 40%)` }} />
                <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">database</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">500k+</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">AI Prompts</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Quality Prompts</span>
            </div>

            {/* Card 2 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500/50 hover:bg-white/20 dark:hover:bg-[#131620] cursor-pointer">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300" style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)` }} />
                <div className="mb-3 p-3 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">group</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">Growing</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">Community</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">Active Users</span>
            </div>

            {/* Card 3 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-500/50 hover:bg-white/20 dark:hover:bg-[#131620] cursor-pointer">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300" style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.1), transparent 40%)` }} />
                <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">memory</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">High</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">Quality Focus</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Curated Content</span>
            </div>

            {/* Card 4 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50 hover:bg-white/20 dark:hover:bg-[#131620] cursor-pointer">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300" style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(249, 115, 22, 0.1), transparent 40%)` }} />
                <div className="mb-3 p-3 rounded-xl bg-orange-500/10 text-orange-500 dark:text-orange-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">50+</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">Categories</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">Specialized Areas</span>
            </div>
        </div>

        {/* AI PROMPT GENERATOR */}
        <div ref={generatorRef} className={`relative z-20 max-w-7xl mx-auto px-4 mb-16 transform transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) ${isGeneratorVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
            {!isGeneratorOpen ? (
                <div onClick={() => setIsGeneratorOpen(true)} className="group cursor-pointer rounded-2xl bg-slate-900/50 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/10 p-6 flex items-center justify-between backdrop-blur-md transition-all hover:border-green-500/50">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center relative">
                            <span className="material-symbols-outlined text-2xl">neurology</span>
                            <span className="absolute top-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#0f111a]"></span>
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wide">AI Prompt Generator</h3>
                            <p className="text-sm text-green-500 font-bold">Generate custom expert prompts in seconds</p>
                        </div>
                    </div>
                    <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all"><span className="material-symbols-outlined">expand_more</span></div>
                </div>
            ) : (
                <div className="rounded-3xl bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-fadeIn">
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
        <section className="py-24 px-6 relative overflow-hidden bg-slate-900/20">
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
      </section>

      {/* CATEGORY FILTER PILLS */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 justify-center">
              {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${activeCategory === cat.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white dark:bg-[#151b2b] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50'}`}>{cat.label}</button>
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
    </div>
  );
};
export default PromptDirectory;
