import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Discovery = () => {
  const navigate = useNavigate();
  const { prompts } = useData();

  // Get top 2 trending prompts (mock logic: just first 2)
  const trendingPrompts = prompts.slice(0, 2);

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <section className="relative px-6 py-12 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 mb-6 shadow-sm animate-fadeIn">
           <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Updated Today</span>
        </div>

        <h2 className="text-6xl md:text-8xl font-league font-normal tracking-wide text-slate-900 dark:text-white mb-4 leading-none uppercase flex flex-col items-center">
          <span className="block opacity-0 animate-slideInLeft">
            Discover Trending
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block mt-1 opacity-0 animate-slideInRight [animation-delay:150ms]">
            AI Prompts & Tools
          </span>
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8 text-lg animate-fadeIn [animation-delay:300ms] opacity-0">
          Your curated hub for the internet's best AI resources to supercharge your workflow.
        </p>

        <div className="w-full max-w-lg relative group mb-8 animate-fadeIn [animation-delay:400ms] opacity-0">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors">search</span>
           <input 
             type="text" 
             placeholder="Search prompts, tools, categories..." 
             className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-lg shadow-slate-200/50 dark:shadow-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
           />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fadeIn [animation-delay:500ms] opacity-0">
            <button 
                onClick={() => navigate('/prompts')}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
                <span className="material-symbols-outlined">chat_spark</span>
                Browse Prompts
            </button>
             <button 
                onClick={() => navigate('/ai-tools')}
                className="flex-1 py-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-700 dark:text-white font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <span className="material-symbols-outlined">grid_view</span>
                Explore Tools
            </button>
        </div>
      </section>

      {/* Categories Scroller */}
      <section className="px-4 mb-8">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-center">
            {['All', 'Writing', 'Marketing', 'Coding', 'Image Gen', 'Productivity'].map((cat, i) => (
                <button key={cat} className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-transform active:scale-95 ${i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300'}`}>
                    {cat}
                </button>
            ))}
          </div>
      </section>

      {/* Trending Prompts */}
      <section className="px-6 mb-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trending Prompts</h3>
            <button onClick={() => navigate('/prompts')} className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingPrompts.map(prompt => (
                <div key={prompt.id} onClick={() => navigate(`/prompts/${prompt.id}`)} className="group bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border hover:-translate-y-1 transition-transform relative overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">{prompt.category}</span>
                        <button className="text-slate-400 hover:text-blue-600"><span className="material-symbols-outlined">bookmark</span></button>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{prompt.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{prompt.description}</p>
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