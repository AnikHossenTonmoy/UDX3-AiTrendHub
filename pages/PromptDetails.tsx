
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PromptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prompts } = useData();

  const prompt = prompts.find(p => p.id === id);
  const relatedPrompts = prompts
    .filter(p => p.category === prompt?.category && p.id !== prompt?.id)
    .slice(0, 3);

  if (!prompt) {
    return <div className="p-10 text-center text-slate-500">Prompt not found</div>;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    // Could add toast notification here
    alert('Prompt copied to clipboard!');
  };

  const handleRunInStudio = () => {
      // Determine prompt type
      const isImage = prompt.category === 'Image Generation' || prompt.category === 'Art' || prompt.tags.includes('Image');
      navigate('/studio', { 
          state: { 
              prompt: prompt.content,
              type: isImage ? 'Image Generation' : 'Chat' 
          }
      });
  };

  return (
    <div className="pb-20 pt-6 min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <button 
            onClick={() => navigate('/prompts')} 
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span>
          Back to Library
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Preview (if image gen) or Info */}
          <div className="lg:col-span-5 order-2 lg:order-1">
             {prompt.images && prompt.images.length > 0 ? (
                 <div className="sticky top-24">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <img 
                            src={prompt.images[0]} 
                            alt={prompt.title} 
                            className="w-full h-auto object-cover"
                        />
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Generated with {prompt.tool || prompt.model}</p>
                        </div>
                    </div>
                    
                    {/* Visual Tags */}
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {prompt.difficulty && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                prompt.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                                prompt.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-red-50 text-red-700 border-red-200'
                            }`}>
                                {prompt.difficulty} Level
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {prompt.category}
                        </span>
                    </div>
                 </div>
             ) : (
                <div className="sticky top-24 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col justify-between min-h-[400px]">
                    <div>
                        <span className="material-symbols-outlined text-6xl opacity-50 mb-4">format_quote</span>
                        <h2 className="text-3xl font-display font-bold leading-tight mb-4">{prompt.title}</h2>
                        <p className="opacity-80 text-lg">{prompt.description}</p>
                    </div>
                    <div className="pt-8 border-t border-white/20">
                         <div className="flex items-center gap-3">
                            <img src={prompt.author.avatar} alt="author" className="size-10 rounded-full border-2 border-white/30" />
                            <div>
                                <p className="font-bold">{prompt.author.name}</p>
                                <p className="text-xs opacity-70">Prompt Engineer</p>
                            </div>
                         </div>
                    </div>
                </div>
             )}
          </div>

          {/* Right Column: Prompt Data */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider">
                        {prompt.tool || prompt.model}
                     </span>
                     <span className="flex items-center text-xs font-medium text-slate-500">
                        <span className="material-symbols-outlined text-[16px] mr-1">schedule</span> {prompt.date}
                     </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                    {prompt.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prompt.description}
                </p>
            </div>

            {/* Prompt Box Area */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-lg overflow-hidden mb-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">terminal</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Prompt</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                             {prompt.content.length} chars
                        </span>
                    </div>
                </div>
                
                <div className="p-6 bg-slate-50/30 dark:bg-transparent">
                    <pre className="font-mono text-sm md:text-base text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {prompt.content}
                    </pre>
                </div>

                <div className="p-4 bg-white dark:bg-dark-surface border-t border-slate-100 dark:border-dark-border flex flex-col sm:flex-row gap-3 justify-end">
                    <button 
                        onClick={copyToClipboard}
                        className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined">content_copy</span>
                        Copy
                    </button>
                     <button 
                        onClick={handleRunInStudio}
                        className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                        <span className="material-symbols-outlined">play_circle</span>
                        Run in Studio
                    </button>
                </div>
            </div>

            {/* Author & Stats */}
            <div className="flex items-center justify-between py-6 border-y border-slate-200 dark:border-slate-800 mb-10">
                <div className="flex items-center gap-3">
                    <img src={prompt.author.avatar} alt={prompt.author.name} className="size-12 rounded-full ring-2 ring-white dark:ring-slate-700 shadow-sm" />
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{prompt.author.name}</p>
                        <p className="text-xs text-slate-500">{prompt.author.handle}</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{prompt.views.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Views</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{prompt.likes.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Likes</p>
                    </div>
                </div>
            </div>

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Prompts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedPrompts.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => navigate(`/prompts/${p.id}`)}
                                className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-200 dark:border-dark-border hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors flex gap-4 items-start"
                            >
                                {p.images && p.images.length > 0 ? (
                                    <img src={p.images[0]} className="size-20 rounded-lg object-cover bg-slate-100" alt="" />
                                ) : (
                                    <div className="size-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                         <span className="material-symbols-outlined text-slate-400">text_fields</span>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{p.title}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{p.description}</p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded uppercase">{p.tool || p.model}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetails;
