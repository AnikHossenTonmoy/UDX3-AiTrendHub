import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { Prompt } from '../types';

const AdminPrompts = () => {
  const { prompts, addPrompt, deletePrompt } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Prompt>>({
    title: '',
    description: '',
    content: '',
    category: 'Marketing',
    model: 'GPT-4',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: formData.title || 'Untitled Prompt',
      description: formData.description || '',
      content: formData.content || '',
      category: formData.category || 'General',
      tags: ['New', formData.category || 'General'],
      views: 0,
      likes: 0,
      author: { name: 'Admin', avatar: 'https://picsum.photos/seed/admin/100', handle: '@admin' },
      model: formData.model || 'GPT-4',
      status: 'Published',
      date: 'Just now'
    };
    addPrompt(newPrompt);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', content: '', category: 'Marketing', model: 'GPT-4' });
  };

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Prompts</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {prompts.map((prompt) => (
                <div key={prompt.id} className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-100 dark:border-dark-border shadow-sm flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">{prompt.category}</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">{prompt.title}</h3>
                        </div>
                        <p className="text-sm text-slate-500 truncate max-w-md">{prompt.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                         <div className="text-right mr-4 hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{prompt.model}</p>
                            <p className="text-xs text-slate-500">{prompt.views} views</p>
                         </div>
                        <button onClick={() => deletePrompt(prompt.id)} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
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

        {/* Add Prompt Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Prompt">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        placeholder="e.g. Masterful Copywriter"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                         <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                         >
                            <option>Marketing</option>
                            <option>Coding</option>
                            <option>Art</option>
                            <option>Writing</option>
                            <option>Productivity</option>
                         </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AI Model</label>
                         <select 
                            value={formData.model}
                            onChange={e => setFormData({...formData, model: e.target.value})}
                            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                         >
                            <option>GPT-4</option>
                            <option>GPT-3.5</option>
                            <option>Claude 2</option>
                            <option>Midjourney</option>
                            <option>Stable Diffusion</option>
                         </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <input 
                        required
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" 
                        placeholder="Short description for the card..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prompt Content</label>
                    <textarea 
                        required
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm h-40" 
                        placeholder="Act as a..."
                    />
                </div>

                <button type="submit" className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                    Publish Prompt
                </button>
             </form>
        </Modal>
    </div>
  );
};

export default AdminPrompts;
