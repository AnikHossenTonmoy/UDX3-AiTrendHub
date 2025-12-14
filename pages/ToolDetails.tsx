
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
    // Automatically enrich tool data if it's missing features or pricing structure
    const checkAndEnrichData = async () => {
        if (tool && (!tool.features || tool.features.length === 0 || !tool.plans || tool.plans.length === 0)) {
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

    if (tool) checkAndEnrichData();
  }, [tool?.id]); 

  // --- 404 STATE (Tool Not Found) ---
  if (!tool) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6 text-center">
            <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-slate-400">search_off</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Tool Not Found</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                The AI tool you are looking for might have been removed or the link is incorrect.
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate('/ai-tools')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">grid_view</span>
                    Browse Directory
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-700 dark:text-white font-bold rounded-xl transition-colors"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
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
                                        Updating Data...
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
                         <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            {tool.description || tool.shortDescription}
                         </p>
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
                                {tool.features && tool.features.length > 0 ? (
                                    tool.features.map(feat => (
                                        <div key={feat} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-dark-border">
                                            <span className="material-symbols-outlined text-green-500 flex-shrink-0">check_circle</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500">No specific features listed.</p>
                                )}
                            </div>
                        )}

                        {/* STRUCTURED PRICING TAB */}
                         {activeTab === 'Pricing' && (
                             <div className="space-y-6">
                                {isEnriching ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                         {[1,2,3].map(i => (
                                             <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                                         ))}
                                    </div>
                                ) : (
                                    tool.plans && tool.plans.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {tool.plans.map((plan, i) => (
                                                <div key={i} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col hover:border-blue-500 transition-colors">
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{plan.name}</h3>
                                                    <div className="flex items-baseline gap-1 mb-4">
                                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                                            {plan.price === 'Contact' || plan.price === 'Free' ? '' : '$'}{plan.price}
                                                        </span>
                                                        <span className="text-sm text-slate-500">{plan.price === 'Contact' ? '' : `/${plan.billing || 'mo'}`}</span>
                                                    </div>
                                                    <ul className="space-y-3 mb-6 flex-1">
                                                        {(plan.features || []).map((feat, fi) => (
                                                            <li key={fi} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                                <span className="material-symbols-outlined text-green-500 text-[18px]">check</span>
                                                                {feat}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <button className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20 font-bold transition-colors">
                                                        Choose {plan.name}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                                            <p className="text-slate-500 mb-2">Detailed pricing not available.</p>
                                            <a href={`https://${tool.url}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Check official website</a>
                                        </div>
                                    )
                                )}
                                
                                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 px-2">
                                     <span>* Prices are subject to change by the vendor.</span>
                                     {tool.lastVerified && <span>Last verified: {new Date(tool.lastVerified).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm sticky top-24">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Summary</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Model</span>
                            <span className={`text-sm font-bold ${
                                tool.pricingModel === 'Free' ? 'text-green-600' : 
                                tool.pricingModel === 'Paid' ? 'text-purple-600' : 'text-blue-600'
                            }`}>{tool.pricingModel || 'Freemium'}</span>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                        {tool.plans && tool.plans.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starting at</span>
                                <div className="font-mono text-slate-700 dark:text-slate-200">
                                    {tool.plans[0].price === '0' || tool.plans[0].price === 'Free' ? 'Free' : `$${tool.plans[0].price}`}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <a href={`https://${tool.url}`} target="_blank" rel="noreferrer" className="w-full mt-6 block text-center py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                        Get Started
                    </a>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ToolDetails;