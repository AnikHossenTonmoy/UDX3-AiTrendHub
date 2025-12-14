import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { Tool } from '../types';
import { GeminiBackend } from '../services/GeminiBackend';

const Tools = () => {
  const { tools, addTool, addTools, deleteTool } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Tool>>({
    name: '',
    url: '',
    category: 'Productivity',
    shortDescription: '',
    isPaid: false,
    verified: false,
    pricingModel: 'Freemium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = formData.url?.replace(/^https?:\/\//, '').split('/')[0] || '';
    const newTool: Tool = {
      id: Date.now().toString(),
      name: formData.name || 'Untitled',
      url: formData.url || '',
      category: formData.category || 'Productivity',
      rating: 0,
      reviews: 0,
      saves: 0,
      isPaid: formData.isPaid || false,
      pricingModel: formData.pricingModel as any || 'Freemium',
      isActive: true,
      logo: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'AI')}&background=random`,
      shortDescription: formData.shortDescription,
      description: formData.shortDescription, // reusing for simplicity
      features: ['New Feature'],
      pricing: ['Free Trial'],
      screenshots: ['https://picsum.photos/seed/screen/800/450'],
      verified: formData.verified || false
    };
    addTool(newTool);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', category: 'Productivity', shortDescription: '', isPaid: false, verified: false, pricingModel: 'Freemium' });
  };

  const handleAutoDiscover = async () => {
    // Note: API Key is now handled inside GeminiBackend service file.
    setIsGenerating(true);
    try {
        const toolsToAdd = await GeminiBackend.discoverTools();
        
        if (toolsToAdd.length > 0) {
            addTools(toolsToAdd);
            alert(`Successfully discovered ${toolsToAdd.length} new tools!`);
        } else {
            alert("No tools generated. Try again.");
        }

    } catch (error) {
        console.error("Discovery Error:", error);
        alert("Failed to auto-discover tools. Check console for details.");
    } finally {
        setIsGenerating(false);
    }
  };

  const filteredTools = filter === 'All' ? tools : tools.filter(t => 
    filter === 'Verified' ? t.verified : filter === 'Draft' ? !t.isActive : true
  );

  return (
    <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tools Manager</h2>
            </div>
            
            <div className="flex gap-3">
                 <button 
                    onClick={handleAutoDiscover}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isGenerating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg shadow-purple-500/30'}`}
                 >
                    {isGenerating ? (
                        <span className="size-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    )}
                    {isGenerating ? 'Discovering...' : 'Auto-Discover with Gemini'}
                 </button>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                <input 
                    type="text" 
                    placeholder="Search AI Tools..." 
                    className="w-full h-11 pl-10 pr-4 rounded-full bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="flex gap-2">
                <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'All' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-dark-surface text-slate-600 dark:text-slate-300'}`}>All</button>
                <button onClick={() => setFilter('Verified')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'Verified' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-dark-surface text-slate-600 dark:text-slate-300'}`}>Verified</button>
            </div>
        </div>

        <div className="space-y-4">
            {filteredTools.map((tool) => (
                <div key={tool.id} className="group bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <img 
                                src={tool.logo} 
                                alt={tool.name} 
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=64`;
                                }}
                                className="size-12 rounded-xl object-contain bg-white p-1 border border-slate-100 shadow-sm" 
                            />
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">{tool.name}</h3>
                                <p className="text-xs text-slate-500">{tool.url}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             {tool.verified && <span className="material-symbols-outlined text-blue-500 text-[20px]">verified</span>}
                             <button onClick={() => deleteTool(tool.id)} className="size-8 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-400 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">{tool.category}</span>
                        <span className={`text-xs font-bold ${
                            tool.pricingModel === 'Free' ? 'text-green-600' : 
                            tool.pricingModel === 'Freemium' ? 'text-blue-600' : 
                            'text-purple-600'
                        }`}>
                            {tool.pricingModel || (tool.isPaid ? 'Paid' : 'Free')}
                        </span>
                    </div>
                </div>
            ))}
        </div>
        
        {/* FAB */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-6 size-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 transition-transform z-40"
        >
            <span className="material-symbols-outlined text-[32px]">add</span>
        </button>

        {/* Add Tool Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New AI Tool">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tool Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. SuperAI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
                <input 
                  required
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. superai.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Copywriting</option>
                        <option>Image Gen</option>
                        <option>Coding</option>
                        <option>Video</option>
                        <option>Productivity</option>
                        <option>Chatbot</option>
                        <option>Audio</option>
                        <option>Business</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pricing Model</label>
                    <select 
                        value={formData.pricingModel}
                        onChange={e => setFormData({...formData, pricingModel: e.target.value as any})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Free</option>
                        <option>Freemium</option>
                        <option>Paid</option>
                        <option>Contact for Pricing</option>
                    </select>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
              <textarea 
                required
                value={formData.shortDescription}
                onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 h-24" 
                placeholder="Briefly describe what this tool does..."
              />
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.verified}
                  onChange={e => setFormData({...formData, verified: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Verified Badge</span>
              </label>
            </div>

            <button type="submit" className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              Add Tool to Directory
            </button>
          </form>
        </Modal>
    </div>
  );
};

export default Tools;