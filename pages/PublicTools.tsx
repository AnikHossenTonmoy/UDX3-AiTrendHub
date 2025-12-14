import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Tool } from '../types';
import { GeminiBackend } from '../services/GeminiBackend';
import Modal from '../components/Modal';

// Configuration for all categories (Icon mapping and Colors)
const CATEGORY_CONFIG: Record<string, { icon: string; color: string; accent: string }> = {
  "Image Generators": { icon: "image", color: "text-purple-600", accent: "border-purple-500" },
  "Writing & Web SEO": { icon: "edit_square", color: "text-green-600", accent: "border-green-500" },
  "AI Chat & Assistant": { icon: "chat_spark", color: "text-blue-600", accent: "border-blue-500" },
  "Video Generators": { icon: "movie_creation", color: "text-pink-600", accent: "border-pink-500" },
  "Text to Speech": { icon: "record_voice_over", color: "text-orange-500", accent: "border-orange-500" },
  "Education / Studies": { icon: "school", color: "text-yellow-600", accent: "border-yellow-500" },
  "Social Networks": { icon: "share", color: "text-indigo-500", accent: "border-indigo-500" },
  "Data & Analytics": { icon: "analytics", color: "text-cyan-600", accent: "border-cyan-500" },
  "Real Estate / Architecture": { icon: "apartment", color: "text-amber-700", accent: "border-amber-600" },
  "Developer Tools": { icon: "code", color: "text-slate-700 dark:text-slate-300", accent: "border-slate-500" },
  "SEO": { icon: "search_check", color: "text-lime-600", accent: "border-lime-500" },
  "Marketing": { icon: "campaign", color: "text-red-500", accent: "border-red-500" },
  "Audio Editing": { icon: "graphic_eq", color: "text-violet-500", accent: "border-violet-500" },
  "3D Model": { icon: "view_in_ar", color: "text-teal-600", accent: "border-teal-500" },
  "Business": { icon: "business_center", color: "text-blue-800", accent: "border-blue-700" },
  "Presentation": { icon: "present_to_all", color: "text-orange-600", accent: "border-orange-500" },
  "Productivity": { icon: "speed", color: "text-emerald-600", accent: "border-emerald-500" },
  "Avatars": { icon: "face", color: "text-rose-500", accent: "border-rose-500" },
  "Fashion": { icon: "checkroom", color: "text-fuchsia-500", accent: "border-fuchsia-500" },
  "Finance": { icon: "attach_money", color: "text-green-700", accent: "border-green-600" },
  "Summarizer": { icon: "summarize", color: "text-sky-500", accent: "border-sky-500" },
  "Sales & Conversion": { icon: "monetization_on", color: "text-green-500", accent: "border-green-500" },
  "Research & Science": { icon: "science", color: "text-indigo-700", accent: "border-indigo-600" },
  "Transcriber": { icon: "transcribe", color: "text-yellow-500", accent: "border-yellow-500" },
  "Storytelling": { icon: "auto_stories", color: "text-amber-800", accent: "border-amber-700" },
  "ChatBots": { icon: "smart_toy", color: "text-blue-400", accent: "border-blue-400" },
  "Logo Creation": { icon: "design_services", color: "text-purple-500", accent: "border-purple-500" },
  "Translation": { icon: "translate", color: "text-blue-500", accent: "border-blue-500" },
  "Robots & Devices": { icon: "precision_manufacturing", color: "text-slate-600", accent: "border-slate-500" },
  "Future Tools": { icon: "rocket_launch", color: "text-purple-700", accent: "border-purple-600" },
  "E-commerce": { icon: "shopping_cart", color: "text-indigo-600", accent: "border-indigo-500" },
  "Files & Spreadsheets": { icon: "table_view", color: "text-green-600", accent: "border-green-500" },
  "Gaming": { icon: "sports_esports", color: "text-violet-600", accent: "border-violet-500" },
  "No Code / Low Code": { icon: "build", color: "text-orange-500", accent: "border-orange-500" },
  "Customer Support": { icon: "support_agent", color: "text-cyan-500", accent: "border-cyan-500" },
  "Healthcare": { icon: "medical_services", color: "text-red-500", accent: "border-red-500" },
  "Legal Assistants": { icon: "gavel", color: "text-slate-700", accent: "border-slate-600" },
  "Voice Cloning": { icon: "record_voice_over", color: "text-rose-600", accent: "border-rose-500" },
  "Video Editing": { icon: "video_settings", color: "text-pink-500", accent: "border-pink-500" },
  "Image Editing": { icon: "photo_filter", color: "text-purple-400", accent: "border-purple-400" },
  "Life Assistants": { icon: "favorite", color: "text-red-400", accent: "border-red-400" },
  "Dating & Relationships": { icon: "favorite_border", color: "text-pink-400", accent: "border-pink-400" },
  "Travel": { icon: "flight", color: "text-sky-400", accent: "border-sky-400" },
  "Search Engine": { icon: "search", color: "text-blue-500", accent: "border-blue-500" },
  "Prompts & Aids": { icon: "lightbulb", color: "text-yellow-400", accent: "border-yellow-400" },
  "Writing Tools": { icon: "history_edu", color: "text-slate-500", accent: "border-slate-400" },
  "AI detection": { icon: "radar", color: "text-red-600", accent: "border-red-500" },
  "E-mail": { icon: "mail", color: "text-orange-400", accent: "border-orange-400" },
  "Human Resources": { icon: "badge", color: "text-blue-800", accent: "border-blue-700" }
};

const PublicTools = () => {
  const navigate = useNavigate();
  const { tools: staticTools } = useData();
  
  // Real-time Data States
  const [liveTrending, setLiveTrending] = useState<Tool[]>([]);
  const [liveLatest, setLiveLatest] = useState<Tool[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // See All Modal State
  const [selectedCategoryData, setSelectedCategoryData] = useState<{title: string, data: Tool[]} | null>(null);

  // 3. Prepare Categories
  const categoryOrder = [
    "Image Generators", "Writing & Web SEO", "AI Chat & Assistant", "Video Generators", "Text to Speech", 
    "Education / Studies", "Social Networks", "Data & Analytics", "Real Estate / Architecture", "Developer Tools", 
    "SEO", "Marketing", "Audio Editing", "3D Model", "Business", "Presentation", "Productivity", "Avatars", 
    "Fashion", "Finance", "Summarizer", "Sales & Conversion", "Research & Science", "Transcriber", "Storytelling", 
    "ChatBots", "Logo Creation", "Translation", "Robots & Devices", "Future Tools", "E-commerce", 
    "Files & Spreadsheets", "Gaming", "No Code / Low Code", "Customer Support", "Healthcare", "Legal Assistants", 
    "Voice Cloning", "Video Editing", "Image Editing", "Life Assistants", "Dating & Relationships", "Travel", 
    "Search Engine", "Prompts & Aids", "Writing Tools"
  ];

  // Helper to get tools by category
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
        setLastUpdated(new Date());
    } catch (err) {
        console.error("Error updating live feeds", err);
    } finally {
        setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll every 60 seconds (less aggressive than 30s)
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Use static data as fallback if live data fails or is loading initially
  const displayedTrending = liveTrending.length > 0 ? liveTrending : [...staticTools].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 30);
  const displayedLatest = liveLatest.length > 0 ? liveLatest : [...staticTools].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 20);

  const openSeeAll = (title: string, data: Tool[]) => {
      setSelectedCategoryData({ title, data });
  };

  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen py-10 px-4 sm:px-6">
       
       {/* Inject custom styles for scrollbar */}
       <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 20px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.5);
          }
       `}</style>

       <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4">
               Ultimate AI Directory
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
               <span>Explore {staticTools.length} curated tools.</span>
               {isLoadingLive ? (
                 <span className="flex items-center text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full animate-pulse">
                    Updating Live Feeds...
                 </span>
               ) : (
                  <span className="flex items-center text-xs text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <span className="size-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live Data Active ({lastUpdated.toLocaleTimeString()})
                 </span>
               )}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
             
             {/* 1. Latest AI Card (Live) */}
             <CategoryCard 
                title="Latest AI" 
                icon="bolt" 
                color="text-blue-500" 
                data={displayedLatest} 
                navigate={navigate}
                isLive={true}
                onSeeAll={openSeeAll}
             />

             {/* 2. Trending Card (Live) */}
             <CategoryCard 
                title="Top 50 Trends [24H]" 
                icon="trending_up" 
                color="text-slate-900 dark:text-white" 
                data={displayedTrending} 
                navigate={navigate}
                isRanked
                isLive={true}
                onSeeAll={openSeeAll}
             />

             {/* 3. All Other Categories (Static) */}
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
                   />
                );
             })}
          </div>
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
                        <img 
                            src={tool.logo} 
                            alt={tool.name}
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=64`;
                            }}
                            className="size-10 rounded-lg object-contain bg-white p-1 flex-shrink-0 border border-slate-200" 
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">{tool.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{tool.shortDescription || tool.category}</p>
                        </div>
                        {tool.verified && <span className="material-symbols-outlined text-[16px] text-blue-500">verified</span>}
                   </div>
              ))}
          </div>
       </Modal>
    </div>
  );
};

// Reusable Card Component
const CategoryCard = ({ title, icon, color, data, navigate, isRanked, isLive, onSeeAll }: any) => {
    return (
        <div className={`bg-white dark:bg-dark-surface rounded-2xl border ${isLive ? 'border-blue-200 dark:border-blue-900/30 shadow-blue-500/5' : 'border-slate-200 dark:border-dark-border'} shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden`}>
            
            {/* Live Indicator Background Effect */}
            {isLive && (
                <div className="absolute top-0 right-0 p-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                </div>
            )}

            {/* Card Header */}
            <div className="p-5 pb-0 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`material-symbols-outlined ${color} text-[24px]`}>{icon}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{title}</h3>
                </div>
                {/* Accent Line */}
                <div className={`h-1 w-20 mx-auto rounded-full ${color.replace('text-', 'bg-')} opacity-80 mb-2`}></div>
                <div className="h-px w-full bg-slate-100 dark:bg-dark-border mt-3"></div>
            </div>

            {/* List with Scroll Animation */}
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
                            {/* Rank Number */}
                            {isRanked && (
                            <span className="text-sm font-bold text-slate-400 w-5 text-center flex-shrink-0">{i + 1}.</span>
                            )}

                            {/* Logo */}
                            <img 
                            src={tool.logo} 
                            alt={tool.name}
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=64`;
                            }}
                            className="size-8 rounded-lg object-contain bg-white p-0.5 flex-shrink-0 border border-slate-200" 
                            />

                            {/* Name & Growth */}
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <h4 className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                                    {tool.name}
                                </h4>
                                {/* Live Trend Score or Static Mock */}
                                {(isLive && tool.trendScore) ? (
                                    <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded font-medium flex items-center">
                                        <span className="material-symbols-outlined text-[10px] mr-0.5">trending_up</span>
                                        {tool.trendScore}
                                    </span>
                                ) : (title.includes("Trends") && (
                                    <span className="text-[10px] text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded font-medium">
                                        +{Math.floor(Math.random() * 500) + 100}
                                    </span>
                                ))}
                            </div>

                            {/* Icons/Badges */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                            {tool.verified && (
                                <span className="material-symbols-outlined text-[16px] text-amber-400" title="Verified">verified</span>
                            )}
                            {tool.isPaid && (
                                <div className="size-4 rounded-full border border-amber-500 text-amber-500 flex items-center justify-center text-[10px] font-bold" title="Paid/Sponsored">S</div>
                            )}
                            <span className="material-symbols-outlined text-[18px] text-slate-300 group-hover:text-blue-500 transition-colors">open_in_new</span>
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

            {/* Footer */}
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