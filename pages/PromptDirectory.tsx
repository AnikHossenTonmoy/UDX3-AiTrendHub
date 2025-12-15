
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PromptDirectory = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expanded Categories with IDs matching common Galaxy themes
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

  // Logic: Filtering
  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory || (activeCategory === 'Art' && (p.category === 'Image Generation' || p.category === 'Art'));
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Logic: Copy to Clipboard
  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Logic: Spotlight Effect on Mouse Move
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors font-sans selection:bg-blue-500/30">
      
      {/* HERO SECTION - GALAXY STYLE */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden" onMouseMove={handleMouseMove}>
        {/* Galaxy Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100"></div>
            <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">The Largest AI Prompt Library</span>
            </div>

            {/* Huge Headline */}
            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight drop-shadow-sm">
                Find the perfect <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                    AI Prompt
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Unlock the full potential of ChatGPT, Midjourney, and Claude with our curated collection of copy-paste prompts.
            </p>

            {/* Main Search Bar - Floating */}
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

        {/* 4 HERO CARDS - Compact & Darker */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {/* Card 1 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-emerald-500/30 hover:bg-white/20 dark:hover:bg-[#131620]">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.1), transparent 40%)` }}
                />
                <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">database</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">500k+</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">AI Prompts</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Quality Prompts</span>
            </div>

            {/* Card 2 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500/30 hover:bg-white/20 dark:hover:bg-[#131620]">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)` }}
                />
                <div className="mb-3 p-3 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">group</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">Growing</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">Community</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">Active Users</span>
            </div>

            {/* Card 3 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-emerald-500/30 hover:bg-white/20 dark:hover:bg-[#131620]">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.1), transparent 40%)` }}
                />
                <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">memory</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">High</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">Quality Focus</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Curated Content</span>
            </div>

            {/* Card 4 */}
            <div className="spotlight-card group relative bg-white/10 dark:bg-[#0f111a] border border-slate-200/50 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-orange-500/30 hover:bg-white/20 dark:hover:bg-[#131620]">
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(249, 115, 22, 0.1), transparent 40%)` }}
                />
                <div className="mb-3 p-3 rounded-xl bg-orange-500/10 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-0.5">50+</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-3 text-sm">Categories</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">Specialized Areas</span>
            </div>
        </div>

      </section>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-16 z-30 bg-slate-50/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800/60 py-4 transition-all">
          <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 min-w-max justify-center md:justify-start lg:justify-center">
                  {categories.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                            activeCategory === cat.id 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-lg scale-105' 
                            : 'bg-white dark:bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                          {cat.label}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* PROMPT GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 min-h-[600px]">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredPrompts.length > 0 ? filteredPrompts.map((prompt) => (
                 <div 
                    key={prompt.id} 
                    onClick={() => navigate(`/prompts/${prompt.id}`)}
                    className="group relative bg-white dark:bg-[#151b2b] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
                 >
                     {/* Gradient Hover Border Effect (Top Line) */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                     {/* Header */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                             <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                 prompt.model?.includes('Image') || prompt.category === 'Art'
                                 ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' 
                                 : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                             }`}>
                                 <span className="material-symbols-outlined text-[14px]">{prompt.model?.includes('Image') ? 'image' : 'smart_toy'}</span>
                                 {prompt.model || 'AI'}
                             </span>
                        </div>
                        <button 
                            onClick={(e) => handleCopy(e, prompt.content, prompt.id)}
                            className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${
                                copiedId === prompt.id 
                                ? 'bg-green-500 text-white' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-blue-600'
                            }`}
                            title="Copy Prompt"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {copiedId === prompt.id ? 'check' : 'content_copy'}
                            </span>
                        </button>
                     </div>

                     {/* Content */}
                     <div className="flex-1 mb-6">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                             {prompt.title}
                         </h3>
                         <div className="relative">
                            <p className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 line-clamp-4 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                                {prompt.content}
                            </p>
                            {/* Fade out effect for text */}
                            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-50 dark:from-black/20 to-transparent pointer-events-none rounded-b-lg"></div>
                         </div>
                     </div>

                     {/* Footer */}
                     <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                         <span className="text-xs font-bold text-slate-500 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                             {prompt.category}
                         </span>
                         <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                             <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><span className="material-symbols-outlined text-[14px]">visibility</span> {prompt.views}</span>
                             <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><span className="material-symbols-outlined text-[14px]">thumb_up</span> {prompt.likes}</span>
                         </div>
                     </div>
                 </div>
             )) : (
                 /* Empty State */
                 <div className="col-span-full py-20 text-center">
                     <div className="inline-flex items-center justify-center size-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 animate-pulse">
                         <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No prompts found</h2>
                     <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or category filter to find what you need.</p>
                     <button 
                        onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                     >
                         Reset Filters
                     </button>
                 </div>
             )}
         </div>
      </section>
    </div>
  );
};

export default PromptDirectory;
