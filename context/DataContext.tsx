
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tool, Prompt, Video, User } from '../types';

interface DataContextType {
  tools: Tool[];
  prompts: Prompt[];
  videos: Video[];
  users: User[];
  maintenanceMode: boolean;
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
  setMaintenanceMode: (enabled: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to generate a tool object quickly
const createTool = (id: string, name: string, url: string, category: string, desc: string, pricing: 'Free' | 'Freemium' | 'Paid' = 'Freemium'): Tool => {
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  return {
    id,
    name,
    url: domain,
    category,
    rating: Number((4.0 + Math.random()).toFixed(1)),
    reviews: Math.floor(Math.random() * 5000) + 100,
    isPaid: pricing === 'Paid',
    pricingModel: pricing,
    isActive: true,
    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    shortDescription: desc,
    description: desc,
    verified: true,
    features: ['AI Powered', 'Cloud Sync', '24/7 Support'],
    pricing: ['Free Starter', 'Pro ($20/mo)', 'Enterprise'],
    plans: [
        { name: 'Free', price: '0', billing: 'forever', features: ['Basic Access'] },
        { name: 'Pro', price: '20', billing: 'monthly', features: ['Full Access', 'Priority Support'] }
    ],
    lastVerified: new Date().toISOString(),
    screenshots: [`https://image.thum.io/get/width/800/crop/800:400/https://${domain}`]
  };
};

// --- PERMANENT TOOL DATABASE ---
const INITIAL_TOOLS: Tool[] = [
  // Image Generators
  createTool('img-1', 'Midjourney', 'https://midjourney.com', 'Image Generators', 'Create stunning, photorealistic AI art via Discord.', 'Paid'),
  createTool('img-2', 'DALL-E 3', 'https://openai.com/dall-e-3', 'Image Generators', 'OpenAI\'s latest image model integrated into ChatGPT.', 'Paid'),
  createTool('img-3', 'Stable Diffusion', 'https://stability.ai', 'Image Generators', 'Open-source image generation model for high control.', 'Free'),
  createTool('img-4', 'Leonardo.ai', 'https://leonardo.ai', 'Image Generators', 'Create production-quality visual assets for your projects.', 'Freemium'),
  createTool('img-5', 'Adobe Firefly', 'https://firefly.adobe.com', 'Image Generators', 'Generative AI made for creators, integrated into Photoshop.', 'Freemium'),
  createTool('img-6', 'NightCafe', 'https://nightcafe.studio', 'Image Generators', 'AI Art Generator App and Community.', 'Freemium'),
  createTool('img-7', 'BlueWillow', 'https://bluewillow.ai', 'Image Generators', 'User-friendly AI image generation tool on Discord.', 'Free'),
  createTool('img-8', 'Playground AI', 'https://playgroundai.com', 'Image Generators', 'Free-to-use online AI image creator.', 'Freemium'),
  createTool('img-9', 'Jasper Art', 'https://jasper.ai/art', 'Image Generators', 'Create amazing art and images in seconds.', 'Paid'),
  createTool('img-10', 'Canva AI', 'https://canva.com', 'Image Generators', 'Magic Media text-to-image generation within Canva.', 'Freemium'),
  createTool('img-11', 'DreamStudio', 'https://dreamstudio.ai', 'Image Generators', 'Stability AI’s official web interface for Stable Diffusion.', 'Paid'),
  createTool('img-12', 'Bing Image Creator', 'https://bing.com/create', 'Image Generators', 'Free AI image generator powered by DALL-E 3.', 'Free'),

  // Writing & Web SEO
  createTool('wrt-1', 'Jasper', 'https://jasper.ai', 'Writing & Web SEO', 'AI copywriter and content generator for teams.', 'Paid'),
  createTool('wrt-2', 'Copy.ai', 'https://copy.ai', 'Writing & Web SEO', 'Write better marketing copy and content with AI.', 'Freemium'),
  createTool('wrt-3', 'Writesonic', 'https://writesonic.com', 'Writing & Web SEO', 'Best AI writer for creating SEO-optimized content.', 'Freemium'),
  createTool('wrt-4', 'Rytr', 'https://rytr.me', 'Writing & Web SEO', 'An AI writing assistant that helps you create high-quality content.', 'Freemium'),
  createTool('wrt-5', 'Surfer SEO', 'https://surferseo.com', 'Writing & Web SEO', 'Optimize your content for search engines.', 'Paid'),
  createTool('wrt-6', 'Frase', 'https://frase.io', 'Writing & Web SEO', 'AI for SEO content and research.', 'Paid'),
  createTool('wrt-7', 'Quillbot', 'https://quillbot.com', 'Writing & Web SEO', 'Paraphrasing tool to rewrite text.', 'Freemium'),
  createTool('wrt-8', 'GrammarlyGO', 'https://grammarly.com', 'Writing & Web SEO', 'AI writing assistance for communication.', 'Freemium'),
  createTool('wrt-9', 'Anyword', 'https://anyword.com', 'Writing & Web SEO', 'Data-driven copywriting for marketing pros.', 'Paid'),
  createTool('wrt-10', 'Sudowrite', 'https://sudowrite.com', 'Writing & Web SEO', 'The non-judgmental AI partner for fiction writers.', 'Paid'),
  createTool('wrt-11', 'Scalenut', 'https://scalenut.com', 'Writing & Web SEO', 'All-in-one SEO and content marketing platform.', 'Paid'),
  createTool('wrt-12', 'Neuroflash', 'https://neuroflash.com', 'Writing & Web SEO', 'Europe\'s No. 1 AI content suite.', 'Freemium'),
  createTool('wrt-13', 'Wordtune', 'https://wordtune.com', 'Writing & Web SEO', 'Your personal writing companion.', 'Freemium'),
  createTool('wrt-14', 'ChatGPT Writer', 'https://chatgptwriter.ai', 'Writing & Web SEO', 'Chrome extension to write emails with AI.', 'Free'),

  // AI Chat & Assistant
  createTool('chat-1', 'ChatGPT', 'https://chat.openai.com', 'AI Chat & Assistant', 'The industry-leading conversational AI model by OpenAI.', 'Free'),
  createTool('chat-2', 'Claude 3', 'https://anthropic.com', 'AI Chat & Assistant', 'Anthropic\'s most capable and safe AI model.', 'Paid'),
  createTool('chat-3', 'Gemini', 'https://gemini.google.com', 'AI Chat & Assistant', 'Google\'s most capable AI model.', 'Free'),
  createTool('chat-4', 'Perplexity', 'https://perplexity.ai', 'AI Chat & Assistant', 'AI-powered answer engine.', 'Freemium'),
  createTool('chat-5', 'Microsoft Copilot', 'https://copilot.microsoft.com', 'AI Chat & Assistant', 'Your everyday AI companion.', 'Free'),
  createTool('chat-6', 'Poe', 'https://poe.com', 'AI Chat & Assistant', 'Fast, helpful AI chat from Quora.', 'Freemium'),
  createTool('chat-7', 'HuggingChat', 'https://huggingface.co/chat', 'AI Chat & Assistant', 'Open source alternative to ChatGPT.', 'Free'),
  createTool('chat-8', 'Character.ai', 'https://character.ai', 'AI Chat & Assistant', 'Chat with fictional characters and personas.', 'Free'),
  createTool('chat-9', 'Pi', 'https://pi.ai', 'AI Chat & Assistant', 'A supportive and empathetic personal AI.', 'Free'),

  // Video Generators
  createTool('vid-1', 'Runway', 'https://runwayml.com', 'Video Generators', 'Advance video editing and generation tools (Gen-2).', 'Freemium'),
  createTool('vid-2', 'Pika Labs', 'https://pika.art', 'Video Generators', 'Idea-to-video platform that sets your creativity in motion.', 'Freemium'),
  createTool('vid-3', 'Sora', 'https://openai.com/sora', 'Video Generators', 'Create realistic and imaginative scenes from text.', 'Paid'),
  createTool('vid-4', 'HeyGen', 'https://heygen.com', 'Video Generators', 'AI video generator for business avatars.', 'Paid'),
  createTool('vid-5', 'Synthesia', 'https://synthesia.io', 'Video Generators', 'Create professional AI videos from text in 120 languages.', 'Paid'),
  createTool('vid-6', 'D-ID', 'https://d-id.com', 'Video Generators', 'Create Digital People from just one photo.', 'Paid'),
  createTool('vid-7', 'InVideo', 'https://invideo.io', 'Video Generators', 'Turn text into videos with AI.', 'Freemium'),
  createTool('vid-8', 'Fliki', 'https://fliki.ai', 'Video Generators', 'Turn text into videos with AI voices.', 'Freemium'),
  createTool('vid-9', 'Pictory', 'https://pictory.ai', 'Video Generators', 'Automatically create short, highly-sharable branded videos.', 'Paid'),
  
  // Developer Tools
  createTool('dev-1', 'GitHub Copilot', 'https://github.com/features/copilot', 'Developer Tools', 'Your AI pair programmer.', 'Paid'),
  createTool('dev-2', 'Replit Ghostwriter', 'https://replit.com', 'Developer Tools', 'AI coding partner integrated into Replit.', 'Paid'),
  createTool('dev-3', 'Amazon CodeWhisperer', 'https://aws.amazon.com/codewhisperer', 'Developer Tools', 'Build applications faster with ML-powered coding recommendations.', 'Free'),
  createTool('dev-4', 'Tabnine', 'https://tabnine.com', 'Developer Tools', 'AI assistant for software developers.', 'Freemium'),
  
  // Productivity
  createTool('prod-1', 'Notion AI', 'https://notion.so', 'Productivity', 'Access the limitless power of AI, right inside Notion.', 'Paid'),
  createTool('prod-2', 'Otter.ai', 'https://otter.ai', 'Productivity', 'AI meeting assistant that records audio and writes notes.', 'Freemium'),
  createTool('prod-3', 'Mem', 'https://mem.ai', 'Productivity', 'The self-organizing workspace for your personal knowledge.', 'Freemium'),
  createTool('prod-4', 'Taskade', 'https://taskade.com', 'Productivity', 'AI-powered productivity for teams.', 'Freemium'),
  createTool('prod-5', 'Beautiful.ai', 'https://beautiful.ai', 'Productivity', 'Presentation software that designs for you.', 'Paid'),
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
  
  // Maintenance Mode State
  const [maintenanceMode, setMaintenanceModeState] = useState<boolean>(() => loadFromStorage('trendhub_maintenance_mode', false));

  // Sync to LocalStorage
  useEffect(() => { try { window.localStorage.setItem('trendhub_tools_v1', JSON.stringify(tools)); } catch (e) {} }, [tools]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_prompts_v1', JSON.stringify(prompts)); } catch (e) {} }, [prompts]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_videos_v1', JSON.stringify(videos)); } catch (e) {} }, [videos]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_users_v1', JSON.stringify(users)); } catch (e) {} }, [users]);
  
  useEffect(() => { try { window.localStorage.setItem('trendhub_maintenance_mode', JSON.stringify(maintenanceMode)); } catch (e) {} }, [maintenanceMode]);


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

  const setMaintenanceMode = (enabled: boolean) => {
      setMaintenanceModeState(enabled);
  };

  return (
    <DataContext.Provider value={{ tools, prompts, videos, users, maintenanceMode, addTool, addTools, updateTool, addPrompt, deleteTool, deletePrompt, addVideo, deleteVideo, addUser, deleteUser, setMaintenanceMode }}>
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
