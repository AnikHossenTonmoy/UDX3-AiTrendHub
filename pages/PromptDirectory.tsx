
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PromptDirectory = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Trending'); // Trending, New, Top
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('trendhub_saved_prompts');
    if (saved) {
        try {
            setSavedPromptIds(new Set(JSON.parse(saved)));
        } catch (e) {
            console.error("Failed to load saved prompts", e);
        }
    }
  }, []);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(savedPromptIds);
    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }
    setSavedPromptIds(next);
    localStorage.setItem('trendhub_saved_prompts', JSON.stringify(Array.from(next)));
  };

  const categories = [
    'All', 
    'Image Generation', 
    'Writing', 
    'Coding', 
    'Business', 
    'Social Media', 
    'Marketing', 
    'Productivity', 
    'Video'
  ];

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort based on active tab
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (activeTab === 'Trending') return b.views - a.views;
    if (activeTab === 'Top') return b.likes - a.likes;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest (mock)
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
      
       {/* Inject styles for filled icons and new Card Design */}
       <style>{`
          .material-symbols-outlined.fill-1 {
            font-variation-settings: 'FILL' 1;
          }

          /* New Card Design from Uiverse.io */
          .uiverse-card {
             width: 100%;
             height: 254px;
             background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
             border-radius: 20px;
             transition: all .3s;
             position: relative;
             box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
          }
          
          .uiverse-card2 {
             width: 100%;
             height: 100%;
             background-color: #1a1a1a;
             border-radius: 20px; /* Matching border radius initially */
             transition: all .2s;
             display: flex;
             flex-direction: column;
             justify-content: space-between;
             padding: 16px;
             cursor: pointer;
             overflow: hidden;
          }
          
          .uiverse-card2:hover {
             transform: scale(0.98);
             border-radius: 20px;
          }
          
          .uiverse-card:hover {
             box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.30);
          }

          /* Scrollbar for tags inside card if needed */
          .hide-scrollbar::-webkit-scrollbar {
              display: none;
          }
       `}</style>

      {/* Hero Section */}
      <section className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-6">
               Find the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Prompt</span>
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group mb-8">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors">search</span>
               </div>
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search prompts (e.g., 'Cyberpunk City', 'SEO Blog', 'React Code')..." 
                 className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl leading-5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm transition-all"
               />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
               {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
               ))}
            </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 mt-8">
        
        {/* Filters / Tabs */}
        <div className="flex items-center justify-between mb-6">
           <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
              {['Trending', 'New', 'Top'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === tab 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
              ))}
           </div>
           <p className="text-sm text-slate-500 hidden sm:block">
              Showing {sortedPrompts.length} prompts
           </p>
        </div>

        {/* New Compact Grid - Increased columns for smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedPrompts.map((prompt) => {
            const isSaved = savedPromptIds.has(prompt.id);
            return (
              <div key={prompt.id} className="uiverse-card">
                 <div 
                    className="uiverse-card2"
                    onClick={() => navigate(`/prompts/${prompt.id}`)}
                 >
                    {/* Top Section */}
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/5 truncate max-w-[70%]">
                                {prompt.category}
                            </span>
                            <button 
                                onClick={(e) => toggleSave(e, prompt.id)}
                                className={`text-slate-400 hover:text-blue-400 transition-colors ${isSaved ? 'text-blue-500' : ''}`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
                            </button>
                        </div>
                        
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-2">
                            {prompt.title}
                        </h3>
                        
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                            {prompt.description}
                        </p>
                    </div>

                    {/* Bottom Section */}
                    <div>
                        {/* Tags */}
                        <div className="flex gap-1 overflow-x-auto hide-scrollbar mb-4 opacity-70">
                             {prompt.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] bg-black/40 text-slate-300 px-1.5 py-0.5 rounded whitespace-nowrap border border-white/10">#{tag}</span>
                             ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <span className="flex items-center gap-0.5" title="Views">
                                    <span className="material-symbols-outlined text-[14px]">visibility</span> {prompt.views >= 1000 ? (prompt.views/1000).toFixed(1)+'k' : prompt.views}
                                </span>
                            </div>
                            
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/prompts/${prompt.id}`);
                                }}
                                className="px-3 py-1 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Use
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
            )})}
        </div>
        
        {/* Empty State */}
        {sortedPrompts.length === 0 && (
             <div className="py-20 text-center bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 mt-6">
                <div className="inline-flex justify-center items-center size-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No prompts found</h3>
                <p className="text-slate-500">Try adjusting your search or category filters.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default PromptDirectory;
