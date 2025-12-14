import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const SavedCollection = () => {
  const navigate = useNavigate();
  const { tools, prompts } = useData();
  const [activeTab, setActiveTab] = useState<'Tools' | 'Prompts'>('Tools');
  
  // Local state for saved IDs (loaded from localStorage)
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(new Set());
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load Tools
    const savedTools = localStorage.getItem('trendhub_saved_tools');
    if (savedTools) {
        try { setSavedToolIds(new Set(JSON.parse(savedTools))); } catch (e) {}
    }

    // Load Prompts
    const savedPrompts = localStorage.getItem('trendhub_saved_prompts');
    if (savedPrompts) {
        try { setSavedPromptIds(new Set(JSON.parse(savedPrompts))); } catch (e) {}
    }
  }, []);

  // Sync back to localStorage if user unsaves items here
  const toggleSaveTool = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(savedToolIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSavedToolIds(next);
    localStorage.setItem('trendhub_saved_tools', JSON.stringify(Array.from(next)));
  };

  const toggleSavePrompt = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(savedPromptIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSavedPromptIds(next);
    localStorage.setItem('trendhub_saved_prompts', JSON.stringify(Array.from(next)));
  };

  // Filter Data
  const savedToolsList = tools.filter(t => savedToolIds.has(t.id));
  const savedPromptsList = prompts.filter(p => savedPromptIds.has(p.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
       <style>{`
          .material-symbols-outlined.fill-1 {
            font-variation-settings: 'FILL' 1;
          }
       `}</style>

       {/* Header */}
       <div className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border py-10 px-6">
           <div className="max-w-7xl mx-auto">
               <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
                   My Collection
               </h1>
               <p className="text-slate-500 dark:text-slate-400">
                   Your saved tools and prompts in one place.
               </p>
           </div>
       </div>

       <div className="max-w-7xl mx-auto px-6 mt-8">
           
           {/* Tabs */}
           <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700 mb-8">
               <button 
                  onClick={() => setActiveTab('Tools')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                      activeTab === 'Tools' 
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
               >
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                  Saved Tools ({savedToolsList.length})
               </button>
               <button 
                  onClick={() => setActiveTab('Prompts')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                      activeTab === 'Prompts' 
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
               >
                  <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                  Saved Prompts ({savedPromptsList.length})
               </button>
           </div>

           {/* Content Grid */}
           {activeTab === 'Tools' ? (
                savedToolsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedToolsList.map(tool => (
                             <div 
                                key={tool.id}
                                onClick={() => navigate(`/ai-tools/${tool.id}`)}
                                className="group bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-all cursor-pointer"
                             >
                                <div className="flex justify-between items-start mb-4">
                                    <img 
                                        src={tool.logo} 
                                        alt={tool.name} 
                                        className="size-12 rounded-xl object-contain bg-white p-1 border border-slate-100" 
                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}` }}
                                    />
                                    <button 
                                        onClick={(e) => toggleSaveTool(e, tool.id)}
                                        className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        title="Remove from saved"
                                    >
                                        <span className="material-symbols-outlined text-[20px] fill-1">bookmark</span>
                                    </button>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600">{tool.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{tool.shortDescription || tool.description}</p>
                                <div className="flex items-center gap-2">
                                     <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">{tool.category}</span>
                                     {tool.pricingModel && <span className="text-[10px] font-medium text-slate-400">{tool.pricingModel}</span>}
                                </div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">bookmark_border</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tools saved yet</h3>
                        <p className="text-slate-500 mb-6">Explore the directory to find tools you like.</p>
                        <button onClick={() => navigate('/ai-tools')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Browse Tools</button>
                    </div>
                )
           ) : (
               savedPromptsList.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedPromptsList.map(prompt => (
                            <div 
                                key={prompt.id}
                                onClick={() => navigate(`/prompts/${prompt.id}`)}
                                className="group bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col"
                             >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase">{prompt.category}</span>
                                    <button 
                                        onClick={(e) => toggleSavePrompt(e, prompt.id)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] fill-1">bookmark</span>
                                    </button>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-blue-600">{prompt.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{prompt.description}</p>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                     <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{prompt.tool || prompt.model}</span>
                                </div>
                             </div>
                        ))}
                   </div>
               ) : (
                    <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">lightbulb</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No prompts saved yet</h3>
                        <p className="text-slate-500 mb-6">Discover creative prompts to boost your workflow.</p>
                        <button onClick={() => navigate('/prompts')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Browse Prompts</button>
                    </div>
               )
           )}

       </div>
    </div>
  );
};

export default SavedCollection;