
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tool, Prompt, Video, User } from '../types';

interface DataContextType {
  tools: Tool[];
  prompts: Prompt[];
  videos: Video[];
  users: User[];
  addTool: (tool: Tool) => void;
  addTools: (newTools: Tool[]) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  addPrompt: (prompt: Prompt) => void;
  deleteTool: (id: string) => void;
  deletePrompt: (id: string) => void;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to generate a tool object quickly
const createTool = (id: string, name: string, url: string, category: string, desc: string, isPaid: boolean = false, reviews: number = 0, verified: boolean = false): Tool => {
  // Extract domain for favicon and display
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  
  return {
    id,
    name,
    url: domain,
    category,
    rating: Number((3.8 + Math.random() * 1.2).toFixed(1)), // Random rating between 3.8 and 5.0
    reviews: reviews || Math.floor(Math.random() * 2000) + 50,
    isPaid,
    pricingModel: isPaid ? 'Paid' : 'Freemium',
    isActive: true,
    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    shortDescription: desc,
    description: desc,
    verified: verified || (reviews > 10000), // Auto verify popular tools
    features: ['AI Powered', 'Cloud Sync', '24/7 Support', 'API Access'],
    pricing: ['Free Starter', 'Pro ($20/mo)', 'Enterprise'],
    plans: [
        { name: 'Free', price: '0', billing: 'forever', features: ['Basic Access', 'Community Support'] },
        { name: 'Pro', price: '20', billing: 'monthly', features: ['Full Access', 'Priority Support', 'No Limits'] },
        { name: 'Enterprise', price: 'Contact', billing: 'custom', features: ['SSO', 'Dedicated Account Manager'] }
    ],
    lastVerified: new Date().toISOString(),
    screenshots: [`https://image.thum.io/get/width/800/crop/800:400/https://${domain}`] // Dynamic screenshot placeholder
  };
};

const INITIAL_TOOLS: Tool[] = [
  // ... (keeping existing tools mock data for brevity, assumes standard mock tools list from previous context) ...
  createTool('chat-1', 'ChatGPT', 'https://chat.openai.com', 'AI Chat & Assistant', 'The industry-leading conversational AI model by OpenAI.', false, 500000, true),
  createTool('chat-2', 'Claude 3', 'https://anthropic.com', 'AI Chat & Assistant', 'Anthropic\'s most capable and safe AI model.', false, 180000, true),
  createTool('img-1', 'Midjourney', 'https://midjourney.com', 'Image Generators', 'Create stunning, photorealistic AI art.', true, 450000, true),
  createTool('dev-1', 'GitHub Copilot', 'https://github.com/features/copilot', 'Developer Tools', 'Your AI pair programmer.', true, 180000, true),
];

const INITIAL_PROMPTS: Prompt[] = [
   {
    id: 'img-1',
    title: 'Ultra-Realistic Fantasy Character',
    description: 'Generate a highly detailed fantasy warrior portrait with cinematic lighting.',
    content: 'Create an ultra-realistic portrait of a fantasy warrior with glowing eyes, cinematic lighting, 8k detail.',
    category: 'Image Generation',
    tags: ['Fantasy', 'Portrait', 'Realistic'],
    views: 12500,
    likes: 843,
    author: { name: 'ArtMaster', avatar: 'https://i.pravatar.cc/150?u=art', handle: '@artmaster' },
    model: 'NanoBanana',
    tool: 'NanoBanana AI',
    images: ['https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=600&auto=format&fit=crop'], 
    difficulty: 'Intermediate',
    status: 'Published',
    date: '1 day ago'
  }
];

const INITIAL_VIDEOS: Video[] = [
    {
        id: 'usr-1',
        videoId: '',
        searchQuery: 'How to Use ChatGPT (2025) AIxploria',
        title: 'How to Use ChatGPT (2025)',
        thumbnail: 'https://ui-avatars.com/api/?name=ChatGPT&background=10a37f&color=fff&size=400&font-size=0.33', 
        channelName: 'AIxploria',
        channelAvatar: 'https://ui-avatars.com/api/?name=AIxploria&background=random&color=fff',
        views: 'Hot',
        duration: '18min',
        publishedAt: '2025',
        category: 'LLMs',
        sourceType: 'youtube'
    }
];

const INITIAL_USERS: User[] = [
    { id: 'u1', name: 'Alex Admin', email: 'alex@trendhub.ai', role: 'Admin', status: 'Active', joinedDate: '2023-01-15', avatar: 'https://ui-avatars.com/api/?name=Alex+Admin&background=0D8ABC&color=fff' },
    { id: 'u2', name: 'Sarah Moderator', email: 'sarah@trendhub.ai', role: 'Moderator', status: 'Active', joinedDate: '2023-03-22', avatar: 'https://ui-avatars.com/api/?name=Sarah+Mod&background=22c55e&color=fff' },
    { id: 'u3', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joinedDate: '2024-02-10', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
    { id: 'u4', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Pending', joinedDate: '2024-02-12', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random' },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // LocalStorage Helper
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage`, error);
      return fallback;
    }
  };

  const [tools, setTools] = useState<Tool[]>(() => loadFromStorage('trendhub_tools_v1', INITIAL_TOOLS));
  const [prompts, setPrompts] = useState<Prompt[]>(() => loadFromStorage('trendhub_prompts_v1', INITIAL_PROMPTS));
  const [videos, setVideos] = useState<Video[]>(() => loadFromStorage('trendhub_videos_v1', INITIAL_VIDEOS));
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('trendhub_users_v1', INITIAL_USERS));

  // Sync to LocalStorage
  useEffect(() => { try { window.localStorage.setItem('trendhub_tools_v1', JSON.stringify(tools)); } catch (e) {} }, [tools]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_prompts_v1', JSON.stringify(prompts)); } catch (e) {} }, [prompts]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_videos_v1', JSON.stringify(videos)); } catch (e) {} }, [videos]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_users_v1', JSON.stringify(users)); } catch (e) {} }, [users]);


  const addTool = (tool: Tool) => {
    setTools(prev => {
        if (prev.some(t => t.id === tool.id)) return prev;
        return [tool, ...prev];
    });
  };

  const addTools = (newTools: Tool[]) => {
    setTools(prev => {
        const uniqueNewTools = newTools.filter(nt => !prev.some(pt => pt.id === nt.id));
        if (uniqueNewTools.length === 0) return prev;
        return [...uniqueNewTools, ...prev];
    });
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addPrompt = (prompt: Prompt) => {
    setPrompts(prev => [prompt, ...prev]);
  };

  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const addVideo = (video: Video) => {
    setVideos(prev => [video, ...prev]);
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const addUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider value={{ tools, prompts, videos, users, addTool, addTools, updateTool, addPrompt, deleteTool, deletePrompt, addVideo, deleteVideo, addUser, deleteUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
