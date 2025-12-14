import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { GeminiBackend } from '../services/GeminiBackend';

const ToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tools, updateTool } = useData();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEnriching, setIsEnriching] = useState(false);

  const tool = tools.find(t => t.id === id);

  useEffect(() => {
    // Automatically enrich tool data if it's missing features or pricing
    // This ensures every tool page looks complete without manual data entry
    const checkAndEnrichData = async () => {
        if (tool && (!tool.features || tool.features.length === 0 || !tool.pricing)) {
            // Check if we have an API key before trying
            if (!process.env.API_KEY) return;

            setIsEnriching(true);
            try {
                const enrichedData = await GeminiBackend.enrichToolDetails(tool.name, tool.category, tool.url);
                updateTool(tool.id, enrichedData);
            } catch (err) {
                console.error("Failed to auto-enrich tool", err);
            } finally {
                setIsEnriching(false);
            }
        }
    };

    checkAndEnrichData();
  }, [tool?.id]); // Only re-run if ID changes, effectively on mount for this tool

  if (!tool) {
    return <div className="p-10 text-center text-slate-500">Tool not found</div>;
  }

  return (
    <div className="pb-20">
      {/* Header Background */}
      <div className="h-64 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center pt-8">
             <button onClick={() => navigate('/ai-tools')} className="text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium z-10">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back to Tools
             </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column (Main Info) */}
            <div className="flex-1">
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-dark-border shadow-lg mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
                        <img 
                            src={tool.logo} 
                            alt={tool.name} 
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=128`;
                            }}
                            className="size-24 rounded-2xl border-2 border-white dark:border-slate-700 shadow-md bg-white object-contain p-2" 
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{tool.name}</h1>
                                {tool.verified && <span className="material-symbols-outlined text-blue-500" title="Verified">verified</span>}
                                {isEnriching && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full animate-pulse">
                                        <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                                        Generating Details...
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-3 py-1 rounded-full font-bold">{tool.category}</span>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{tool.rating || 'New'}</span>
                                    <span className="text-slate-400">({tool.reviews || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <a href={`https://${tool.url}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                                Visit Website
                                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                            </a>
                        </div>
                    </div>

                    <div className="mb-8">
                         {isEnriching && !tool.description ? (
                             <div className="space-y-2 animate-pulse">
                                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
                             </div>
                         ) : (
                             <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                {tool.description || tool.shortDescription}
                             </p>
                         )}
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        {['Overview', 'Features', 'Pricing'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                                    activeTab === tab 
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[300px]">
                        {activeTab === 'Overview' && (
                             <div className="space-y-6">
                                {tool.screenshots && tool.screenshots.length > 0 && (
                                    <>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Screenshots</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {tool.screenshots.map((src, i) => (
                                                <img key={i} src={src} alt="Screenshot" className="rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm w-full" />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {!tool.screenshots && (
                                    <div className="text-center py-10 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                                        <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                                        <p>No screenshots available yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'Features' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isEnriching && (!tool.features || tool.features.length === 0) ? (
                                    [1, 2, 3, 4, 5, 6].map(i => (
                                         <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                    ))
                                ) : (tool.features && tool.features.length > 0) ? (
                                    tool.features.map(feat => (
                                        <div key={feat} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-dark-border">
                                            <span className="material-symbols-outlined text-green-500 flex-shrink-0">check_circle</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500">No features listed.</p>
                                )}
                            </div>
                        )}

                         {activeTab === 'Pricing' && (
                             <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border overflow-hidden">
                                {isEnriching && (!tool.pricing || tool.pricing.length === 0) ? (
                                    <div className="p-6 space-y-4">
                                         <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
                                         <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                                    </div>
                                ) : (tool.pricing && tool.pricing.length > 0) ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {tool.pricing.map((price, i) => (
                                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                                    <span className="material-symbols-outlined">payments</span>
                                                </div>
                                                <span className="text-base font-semibold text-slate-700 dark:text-slate-200">{price}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-500">
                                        <p>Pricing information not available.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm sticky top-24">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Pricing Summary</h3>
                    <div className="space-y-3">
                        {tool.pricingModel && (
                             <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Model</span>
                                <span className={`text-sm font-bold ${
                                    tool.pricingModel === 'Free' ? 'text-green-600' : 
                                    tool.pricingModel === 'Paid' ? 'text-purple-600' : 'text-blue-600'
                                }`}>{tool.pricingModel}</span>
                             </div>
                        )}
                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                         {isEnriching && (!tool.pricing || tool.pricing.length === 0) ? (
                             <div className="space-y-2">
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                             </div>
                         ) : tool.pricing && tool.pricing.slice(0, 3).map((price, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="size-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                {price}
                            </div>
                        ))}
                    </div>
                    
                    <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                        Get Started
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ToolDetails;