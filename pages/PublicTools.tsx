
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Tool } from '../types';
import { GeminiBackend } from '../services/GeminiBackend';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

// Configuration for all categories (Icon mapping and Colors)
const CATEGORY_CONFIG: Record<string, { icon: string; color: string; accent: string }> = {
  "Image Generators": { icon: "image", color: "text-purple-600", accent: "border-purple-500" },
  "Writing & Web SEO": { icon: "edit_square", color: "text-green-600", accent: "border-green-500" },
  "AI Chat & Assistant": { icon: "chat_spark", color: "text-blue-600", accent: "border-blue-500" },
  "Video Generators": { icon: "movie_creation", color: "text-pink-600", accent: "border-pink-500" },
  "Developer Tools": { icon: "code", color: "text-slate-700 dark:text-slate-300", accent: "border-slate-500" },
  "Productivity": { icon: "speed", color: "text-emerald-600", accent: "border-emerald-500" },
};

// --- Animated Number Component ---
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

const PublicTools = () => {
  const navigate = useNavigate();
  const { tools: staticTools, addTools } = useData(); 
  
  // Real-time Data States
  const [liveTrending, setLiveTrending] = useState<Tool[]>([]);
  const [liveLatest, setLiveLatest] = useState<Tool[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Bookmark State
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(new Set());
  
  // Filtering & Search State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // See All Modal State
  const [selectedCategoryData, setSelectedCategoryData] = useState<{title: string, data: Tool[]} | null>(null);

  // Hover state for How it Works cards
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // System Advantages Data
  const ADVANTAGES = [
    {
      title: "Verified AI Database",
      desc: "Every tool is manually verified and tested to ensure functionality and safety for our users.",
      icon: "verified_user",
      badge: "QUALITY"
    },
    {
      title: "Real-Time Trends",
      desc: "Live tracking of tool popularity and user engagement metrics to find what's hot.",
      icon: "trending_up",
      badge: "LIVE"
    },
    {
      title: "Daily Updates",
      desc: "New tools added daily to keep you at the bleeding edge of AI technology and innovation.",
      icon: "update",
      badge: "FRESH"
    },
    {
      title: "Smart Categorization",
      desc: "Intelligent tagging and categorization for effortless discovery of specific use-cases.",
      icon: "category",
      badge: "ORGANIZED"
    }
  ];

  // How It Works Data
  const HOW_IT_WORKS = [
    { number: "01", title: "Browse Categories", desc: "Explore our extensive directory of AI tools organized by specific use-cases.", icon: "manage_search" },
    { number: "02", title: "Filter & Search", desc: "Narrow down results by pricing, features, and user ratings to find the perfect fit.", icon: "filter_list" },
    { number: "03", title: "View Details", desc: "Get in-depth insights, pricing plans, and feature breakdowns for each tool.", icon: "visibility" },
    { number: "04", title: "Launch & Use", desc: "Direct access to the tool's official website to start building immediately.", icon: "rocket_launch" }
  ];

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('trendhub_saved_tools');
    if (saved) {
        try {
            setSavedToolIds(new Set(JSON.parse(saved)));
        } catch (e) {
            console.error("Failed to load saved tools", e);
        }
    }
  }, []);

  // Bookmark Handler
  const toggleSave = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    const next = new Set(savedToolIds);
    if (next.has(toolId)) {
        next.delete(toolId);
    } else {
        next.add(toolId);
    }
    setSavedToolIds(next);
    localStorage.setItem('trendhub_saved_tools', JSON.stringify(Array.from(next)));
  };

  const uniqueCategories = ['All', ...Array.from(new Set(staticTools.map(t => t.category))).sort()];

  const categoryOrder = [
    "Image Generators", "Writing & Web SEO", "AI Chat & Assistant", "Video Generators", "Text to Speech", 
    "Education / Studies", "Social Networks", "Data & Analytics", "Real Estate / Architecture", "Developer Tools", 
    "SEO", "Marketing", "Audio Editing", "3D Model", "Business", "Presentation", "Productivity"
  ];

  const getByCategory = (cat: string) => staticTools.filter(t => t.category === cat || t.category.includes(cat));

  // --- Search Filtering ---
  const filterTools = (toolsList: Tool[]) => {
      if (!searchQuery) return toolsList;
      const lower = searchQuery.toLowerCase();
      return toolsList.filter(t => 
        t.name.toLowerCase().includes(lower) || 
        (t.shortDescription && t.shortDescription.toLowerCase().includes(lower)) ||
        t.category.toLowerCase().includes(lower)
      );
  };

  // --- Real-Time Fetching Logic ---
  const fetchData = async () => {
    try {
        const [trends, latest] = await Promise.all([
            GeminiBackend.fetchTrendingTools(),
            GeminiBackend.fetchLatestTools()
        ]);
        
        if (trends.length > 0) setLiveTrending(trends);
        if (latest.length > 0) setLiveLatest(latest);
        
        addTools([...trends, ...latest]);

        setLastUpdated(new Date());
    } catch (err) {
        console.error("Error updating live feeds", err);
    } finally {
        setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const displayedTrending = liveTrending.length > 0 ? liveTrending : [...staticTools].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 30);
  const displayedLatest = liveLatest.length > 0 ? liveLatest : [...staticTools].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 20);

  const openSeeAll = (title: string, data: Tool[]) => {
      setSelectedCategoryData({ title, data });
  };

  // Logic to handle mouse move for spotlight effect (optional polish)
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

  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen font-sans" onMouseMove={handleMouseMove}>
       <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(75, 85, 99, 0.5); }
          .material-symbols-outlined.fill-1 { font-variation-settings: 'FILL' 1; }
       `}</style>

       {/* HERO SECTION START */}
       <section className="relative pt-24 pb-20 px-6 overflow-hidden mb-8">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40"></div>
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm animate-fadeIn">
                    {isLoadingLive ? (
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    ) : (
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                        {isLoadingLive ? 'Syncing Database...' : `Live AI Database • Updated ${lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight drop-shadow-sm flex flex-col items-center">
                    <span className="block opacity-0 animate-slideInLeft">Discover Top</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 opacity-0 animate-slideInRight [animation-delay:200ms]">
                        AI Tools & Apps
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium opacity-0 animate-fadeIn [animation-delay:400ms]">
                    Explore {staticTools.length}+ curated AI tools updated daily. Find the perfect software to automate your workflow.
                </p>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto relative group z-20 opacity-0 animate-fadeIn [animation-delay:600ms]">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative flex items-center bg-white dark:bg-[#151b2b] rounded-full shadow-2xl border border-slate-200 dark:border-slate-700/60 p-2 transition-all group-hover:border-blue-500/50 group-focus-within:ring-4 ring-blue-500/10">
                        <div className="pl-6 text-slate-400">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search 'Video Editor', 'Copywriting', 'Free'..." 
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
       </section>
       {/* HERO SECTION END */}

       <div className="max-w-[1800px] mx-auto px-4 sm:px-6 pb-20">
          {/* Filters Pills */}
          <div className="py-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all sticky top-16 z-30 bg-slate-50/80 dark:bg-dark-bg/80 backdrop-blur-xl border-y border-transparent">
              <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center">
                {uniqueCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            activeCategory === cat
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md transform scale-105'
                            : 'bg-white dark:bg-dark-surface text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
              </div>
          </div>

          {/* Main Content Area */}
          {activeCategory === 'All' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                 {/* Show Loader if still initializing */}
                 {isLoadingLive && displayedTrending.length === 0 ? (
                     <div className="col-span-full flex justify-center items-center py-20">
                         <Loader />
                     </div>
                 ) : (
                    <>
                        <CategoryCard 
                            title="Latest AI" 
                            icon="bolt" 
                            color="text-blue-500" 
                            data={filterTools(displayedLatest)} 
                            navigate={navigate}
                            isLive={true}
                            onSeeAll={openSeeAll}
                            savedToolIds={savedToolIds}
                            onToggleSave={toggleSave}
                        />
                        <CategoryCard 
                            title="Top 50 Trends [24H]" 
                            icon="trending_up" 
                            color="text-slate-900 dark:text-white" 
                            data={filterTools(displayedTrending)} 
                            navigate={navigate}
                            isRanked
                            isLive={true}
                            onSeeAll={openSeeAll}
                            savedToolIds={savedToolIds}
                            onToggleSave={toggleSave}
                        />
                        {categoryOrder.map((catName) => {
                            const config = CATEGORY_CONFIG[catName] || { icon: "category", color: "text-slate-500", accent: "border-slate-500" };
                            const catTools = filterTools(getByCategory(catName));
                            if (catTools.length === 0) return null;
                            return (
                            <CategoryCard 
                                key={catName}
                                title={catName}
                                icon={config.icon}
                                color={config.color}
                                data={catTools}
                                navigate={navigate}
                                isRanked
                                onSeeAll={openSeeAll}
                                savedToolIds={savedToolIds}
                                onToggleSave={toggleSave}
                            />
                            );
                        })}
                    </>
                 )}
              </div>
          ) : (
              <div className="animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filterTools(staticTools.filter(t => t.category === activeCategory)).map(tool => (
                                <div 
                                    key={tool.id} 
                                    onClick={() => navigate(`/ai-tools/${tool.id}`)} 
                                    className="group bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <img 
                                            src={tool.logo} 
                                            alt={tool.name} 
                                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random` }}
                                            className="size-14 rounded-xl object-contain bg-white p-1 border border-slate-100" 
                                        />
                                        <button 
                                            onClick={(e) => toggleSave(e, tool.id)}
                                            className={`p-2 rounded-full transition-colors ${savedToolIds.has(tool.id) ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            <span className={`material-symbols-outlined text-[22px] ${savedToolIds.has(tool.id) ? 'fill-1' : ''}`}>bookmark</span>
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{tool.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{tool.shortDescription || tool.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-border">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${tool.pricingModel === 'Free' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{tool.pricingModel || 'Freemium'}</span>
                                    </div>
                                </div>
                        ))}
                   </div>
              </div>
          )}
       </div>

       {/* --- SYSTEM ADVANTAGES SECTION --- */}
       <section className="py-24 px-6 relative bg-[#07182E] overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white text-center mb-20 tracking-tight">
                    SYSTEM <span className="text-teal-400">ADVANTAGES</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ADVANTAGES.map((adv, i) => (
                        <div key={i} className="group relative bg-[#0B0F19] rounded-[2rem] p-8 border border-white/5 hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-2">
                            {/* Icon Container */}
                            <div className="mb-6 relative">
                                <span className="absolute -top-6 -right-6 bg-teal-500/20 text-teal-400 text-[10px] font-bold px-2 py-1 rounded-bl-xl border-l border-b border-teal-500/20">
                                    {adv.badge}
                                </span>
                                <div className="size-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:rotate-[360deg] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all duration-700 ease-out">
                                    <span className="material-symbols-outlined text-4xl">{adv.icon}</span>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-3">{adv.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {adv.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
       </section>

       {/* --- HOW IT WORKS SECTION --- */}
       <section className="py-24 px-6 relative bg-black pb-32">
            <div className="relative z-10 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white text-center mb-20 tracking-tight">
                    HOW IT <span className="text-emerald-400">WORKS</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 border-t border-dashed border-emerald-500/30 z-0"></div>

                    {HOW_IT_WORKS.map((step, i) => (
                        <div 
                            key={i} 
                            className="group relative z-10 text-center"
                            onMouseEnter={() => setHoveredStep(i)}
                            onMouseLeave={() => setHoveredStep(null)}
                        >
                            {/* Circle Step Number */}
                            <div className="mx-auto size-24 rounded-full bg-[#0B0F19] border-4 border-emerald-500/20 group-hover:border-emerald-500 flex items-center justify-center relative mb-8 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                <span className="text-3xl font-bold text-white font-mono">
                                    <AnimatedNumber number={step.number} isHovered={hoveredStep === i} />
                                </span>
                                {/* Small floating icon */}
                                <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg border-4 border-black">
                                    <span className="material-symbols-outlined text-sm">{step.icon}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
       </section>

       {/* See All Modal */}
       <Modal 
         isOpen={!!selectedCategoryData} 
         onClose={() => setSelectedCategoryData(null)} 
         title={selectedCategoryData ? `${selectedCategoryData.title} (${selectedCategoryData.data.length})` : ''}
       >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCategoryData?.data.map((tool, i) => (
                   <div 
                      key={tool.id}
                      onClick={() => navigate(`/ai-tools/${tool.id}`)}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                   >
                        <span className="text-xs font-bold text-slate-400 w-6 flex-shrink-0">#{i+1}</span>
                        <img src={tool.logo} alt={tool.name} className="size-10 rounded-lg object-contain bg-white p-1 border border-slate-200" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">{tool.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{tool.shortDescription || tool.category}</p>
                        </div>
                   </div>
              ))}
          </div>
       </Modal>
    </div>
  );
};

const CategoryCard = ({ title, icon, color, data, navigate, isRanked, isLive, onSeeAll, savedToolIds, onToggleSave }: any) => {
    return (
        <div className={`bg-white dark:bg-dark-surface rounded-2xl border ${isLive ? 'border-blue-200 dark:border-blue-900/30 shadow-blue-500/5' : 'border-slate-200 dark:border-dark-border'} shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden`}>
            {isLive && (
                <div className="absolute top-0 right-0 p-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                </div>
            )}
            <div className="p-5 pb-0 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`material-symbols-outlined ${color} text-[24px]`}>{icon}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{title}</h3>
                </div>
                <div className={`h-1 w-20 mx-auto rounded-full ${color.replace('text-', 'bg-')} opacity-80 mb-2`}></div>
                <div className="h-px w-full bg-slate-100 dark:bg-dark-border mt-3"></div>
            </div>
            <div className="flex-1 p-2 overflow-y-auto max-h-[500px] min-h-[300px] custom-scrollbar">
                {data.length > 0 ? (
                <ul className="space-y-1">
                    {data.map((tool: Tool, i: number) => (
                        <li 
                            key={tool.id}
                            style={{ animationDelay: `${i * 30}ms` }}
                            onClick={() => navigate(`/ai-tools/${tool.id}`)} 
                            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer animate-fadeIn opacity-0"
                        >
                            {isRanked && <span className="text-sm font-bold text-slate-400 w-5 text-center flex-shrink-0">{i + 1}.</span>}
                            <img src={tool.logo} alt={tool.name} className="size-8 rounded-lg object-contain bg-white p-0.5 flex-shrink-0 border border-slate-200" />
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <h4 className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">{tool.name}</h4>
                                {(isLive && tool.trendScore) && (
                                    <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded font-medium flex items-center">
                                        <span className="material-symbols-outlined text-[10px] mr-0.5">trending_up</span>{tool.trendScore}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={(e) => onToggleSave && onToggleSave(e, tool.id)}
                                    className={`p-1 rounded-full transition-colors ${savedToolIds?.has(tool.id) ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${savedToolIds?.has(tool.id) ? 'fill-1' : ''}`}>bookmark</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                        <span className="material-symbols-outlined mb-2 opacity-50 text-4xl">block</span>
                        <span className="text-sm">No tools found</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-dark-border mt-auto">
                <button 
                    onClick={() => onSeeAll(title, data)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    See all ({data.length}) <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                </button>
            </div>
        </div>
    );
}

export default PublicTools;
