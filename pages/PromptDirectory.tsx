import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PromptDirectory = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Trending'); // Trending, New, Top

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

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedPrompts.map((prompt) => (
            <div 
              key={prompt.id}
              className="group bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Image Preview (if available) */}
              <div 
                className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800"
                onClick={() => navigate(`/prompts/${prompt.id}`)}
              >
                 {prompt.images && prompt.images.length > 0 ? (
                    <img 
                        src={prompt.images[0]} 
                        alt={prompt.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                 ) : (
                    // Fallback pattern if no image
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(prompt.category)} flex items-center justify-center p-6`}>
                         <span className="material-symbols-outlined text-white/50 text-6xl">format_quote</span>
                    </div>
                 )}
                 
                 {/* Tool Badge */}
                 <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {prompt.tool || prompt.model}
                    </span>
                 </div>

                 {/* Hover Overlay */}
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Prompt
                    </button>
                 </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <h3 
                        onClick={() => navigate(`/prompts/${prompt.id}`)}
                        className="font-bold text-slate-900 dark:text-white text-lg leading-tight line-clamp-1 hover:text-blue-600 transition-colors"
                    >
                        {prompt.title}
                    </h3>
                 </div>
                 
                 <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {prompt.description}
                 </p>

                 {/* Tags */}
                 <div className="flex flex-wrap gap-1.5 mb-4">
                    {prompt.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                            #{tag}
                        </span>
                    ))}
                 </div>

                 {/* Footer Actions */}
                 <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                        <img src={prompt.author.avatar} className="size-6 rounded-full" alt="author" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[80px]">{prompt.author.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(prompt.content);
                                alert("Prompt copied!");
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Copy Prompt"
                        >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        </button>
                        <button 
                             onClick={() => navigate(`/prompts/${prompt.id}`)}
                             className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Use
                        </button>
                    </div>
                 </div>
              </div>
            </div>
          ))}

           {sortedPrompts.length === 0 && (
             <div className="col-span-full py-20 text-center">
                <div className="inline-flex justify-center items-center size-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No prompts found</h3>
                <p className="text-slate-500">Try adjusting your search or category filters.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// Helper for gradient backgrounds if no image
const getGradient = (category: string) => {
    switch(category) {
        case 'Coding': return 'from-blue-500 to-cyan-500';
        case 'Image Generation': return 'from-purple-500 to-pink-500';
        case 'Marketing': return 'from-orange-500 to-red-500';
        case 'Writing': return 'from-green-500 to-emerald-500';
        default: return 'from-slate-500 to-gray-500';
    }
};

export default PromptDirectory;