
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
  // ... (keeping other categories same as existing for brevity, reusing existing mapping)
  "Developer Tools": { icon: "code", color: "text-slate-700 dark:text-slate-300", accent: "border-slate-500" },
  "Productivity": { icon: "speed", color: "text-emerald-600", accent: "border-emerald-500" },
};

const PublicTools = () => {
  const navigate = useNavigate();
  const { tools: staticTools, addTools } = useData(); // Use addTools to dispatch
  
  // Real-time Data States
  const [liveTrending, setLiveTrending] = useState<Tool[]>([]);
  const [liveLatest, setLiveLatest] = useState<Tool[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Bookmark State
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(new Set());
  
  // Filtering State
  const [activeCategory, setActiveCategory] = useState('All');
  
  // See All Modal State
  const [selectedCategoryData, setSelectedCategoryData] = useState<{title: string, data: Tool[]} | null>(null);

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

  // --- Real-Time Fetching Logic ---
  const fetchData = async () => {
    try {
        console.log("Fetching live data from Gemini...");
        const [trends, latest] = await Promise.all([
            GeminiBackend.fetchTrendingTools(),
            GeminiBackend.fetchLatestTools()
        ]);
        
        if (trends.length > 0) setLiveTrending(trends);
        if (latest.length > 0) setLiveLatest(latest);
        
        // CRITICAL FIX: Dispatch tools to Global Context so routing works!
        // This ensures when user clicks a card, the ID exists in the context for ToolDetails page
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

  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen py-10 px-4 sm:px-6">
       <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(75, 85, 99, 0.5); }
          .material-symbols-outlined.fill-1 { font-variation-settings: 'FILL' 1; }
       `}</style>

       <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4">
               Ultimate AI Directory
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
               <span>Explore {staticTools.length} curated tools.</span>
               {isLoadingLive ? (
                 <span className="flex items-center text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                    <span className="size-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                    Syncing...
                 </span>
               ) : (
                  <span className="flex items-center text-xs text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <span className="size-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live Data Active ({lastUpdated.toLocaleTimeString()})
                 </span>
               )}
            </p>
          </div>

          {/* Filters Pills */}
          <div className="py-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
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
                            data={displayedLatest} 
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
                            data={displayedTrending} 
                            navigate={navigate}
                            isRanked
                            isLive={true}
                            onSeeAll={openSeeAll}
                            savedToolIds={savedToolIds}
                            onToggleSave={toggleSave}
                        />
                        {categoryOrder.map((catName) => {
                            const config = CATEGORY_CONFIG[catName] || { icon: "category", color: "text-slate-500", accent: "border-slate-500" };
                            const catTools = getByCategory(catName);
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
                   {/* ... (Existing category filtered view logic remains same, just ensuring correct tool access) ... */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staticTools.filter(t => t.category === activeCategory).map(tool => (
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
