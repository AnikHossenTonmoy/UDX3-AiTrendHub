
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
    content: 'Create an ultra-realistic portrait of a fantasy warrior with glowing eyes, cinematic lighting, 8k detail, professional studio lighting, dramatic shadows.',
    category: 'Image Generation',
    tags: ['Fantasy', 'Portrait', 'Realistic'],
    views: 12500,
    likes: 843,
    author: { name: 'ArtMaster', avatar: 'https://i.pravatar.cc/150?u=art', handle: '@artmaster' },
    model: 'NanoBanana',
    tool: 'Midjourney',
    images: ['https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=600&auto=format&fit=crop'],
    difficulty: 'Intermediate',
    status: 'Published',
    date: '1 day ago'
  },
  {
    id: 'img-2',
    title: 'Cyberpunk Neon City',
    description: 'Create a futuristic cyberpunk cityscape with neon lights and flying vehicles.',
    content: 'A sprawling cyberpunk metropolis at night, filled with neon signs in Japanese characters, flying cars, holographic billboards, rain reflections, ultra detailed, 8K, cinematic.',
    category: 'Image Generation',
    tags: ['Cyberpunk', 'Landscape', 'Urban'],
    views: 18932,
    likes: 1502,
    author: { name: 'VisualDesigner', avatar: 'https://i.pravatar.cc/150?u=designer', handle: '@vizdesigner' },
    model: 'DALL-E 3',
    tool: 'DALL-E 3',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '2 days ago'
  },
  {
    id: 'wrt-1',
    title: 'SEO-Optimized Blog Post',
    description: 'Create compelling blog content that ranks on Google with SEO best practices.',
    content: 'Write a comprehensive 2000-word blog post about [TOPIC] with: engaging introduction, 5 main sections with H2 headers, internal linking suggestions, meta description (155 chars), keyword variations in first 100 words, strong CTA at end. Make it conversational and expert-level.',
    category: 'Writing',
    tags: ['SEO', 'Content', 'Blog'],
    views: 8764,
    likes: 512,
    author: { name: 'ContentPro', avatar: 'https://i.pravatar.cc/150?u=contentpro', handle: '@contentpro' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '3 hours ago'
  },
  {
    id: 'wrt-2',
    title: 'LinkedIn Post Generator',
    description: 'Generate engaging LinkedIn posts that drive engagement and showcase expertise.',
    content: 'Create a professional yet personable LinkedIn post about [TOPIC] that: includes relevant emoji strategically, tells a brief story or insight, asks an engaging question, includes 3-5 bullet points if applicable, ends with a relevant hashtag. Max 1300 characters.',
    category: 'Writing',
    tags: ['Social Media', 'Professional', 'Engagement'],
    views: 5432,
    likes: 289,
    author: { name: 'SocialMaster', avatar: 'https://i.pravatar.cc/150?u=social', handle: '@socialmstr' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '5 hours ago'
  },
  {
    id: 'code-1',
    title: 'React Component Best Practices',
    description: 'Generate a production-ready React component with hooks, error handling, and testing.',
    content: 'Create a React functional component that implements [FEATURE]. Include: TypeScript interfaces, custom hooks if needed, error boundaries, proper prop validation, loading states, accessibility attributes, unit test examples with Jest, performance optimizations (memo, useCallback).',
    category: 'Coding',
    tags: ['React', 'JavaScript', 'Components'],
    views: 14200,
    likes: 892,
    author: { name: 'DevExpert', avatar: 'https://i.pravatar.cc/150?u=devexpert', handle: '@devexpert' },
    model: 'GPT-4',
    tool: 'GitHub Copilot',
    difficulty: 'Advanced',
    status: 'Published',
    date: '12 hours ago'
  },
  {
    id: 'code-2',
    title: 'SQL Query Optimization',
    description: 'Write efficient SQL queries with proper indexing and query planning.',
    content: 'Optimize the following query for performance: [INSERT QUERY]. Analyze: table joins, missing indexes, execution plan issues, N+1 problem, proper use of EXPLAIN, denormalization opportunities. Provide index recommendations and alternative query approaches.',
    category: 'Coding',
    tags: ['SQL', 'Database', 'Performance'],
    views: 9876,
    likes: 645,
    author: { name: 'DBArchitect', avatar: 'https://i.pravatar.cc/150?u=dbarch', handle: '@dbarchitect' },
    model: 'Claude 3',
    tool: 'Claude',
    difficulty: 'Advanced',
    status: 'Published',
    date: '1 day ago'
  },
  {
    id: 'biz-1',
    title: 'Business Strategy Canvas',
    description: 'Develop a comprehensive business model using the strategy canvas framework.',
    content: 'Create a Business Strategy Canvas for [COMPANY/PRODUCT]: Key Partners, Key Activities, Value Propositions, Customer Relationships, Customer Segments, Key Resources, Channels, Cost Structure, Revenue Streams. Include competitive analysis and differentiation points.',
    category: 'Business',
    tags: ['Strategy', 'Planning', 'Business Model'],
    views: 6543,
    likes: 402,
    author: { name: 'BusinessConsultant', avatar: 'https://i.pravatar.cc/150?u=busconsult', handle: '@busconsult' },
    model: 'Claude 3',
    tool: 'Claude',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '2 days ago'
  },
  {
    id: 'biz-2',
    title: 'Pitch Deck Outline',
    description: 'Create a compelling investor pitch deck structure with key talking points.',
    content: 'Structure a pitch deck for [COMPANY]: Problem (slide 1-2), Solution (slide 3-4), Market Size (slide 5), Business Model (slide 6), Traction (slide 7), Team (slide 8), Use of Funds (slide 9), Financial Projections (slide 10), Call to Action (slide 11). Include speaker notes for each slide.',
    category: 'Business',
    tags: ['Pitch', 'Fundraising', 'Startup'],
    views: 7821,
    likes: 534,
    author: { name: 'StartupAdvisor', avatar: 'https://i.pravatar.cc/150?u=startupadvsr', handle: '@startupadvsr' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '6 hours ago'
  },
  {
    id: 'social-1',
    title: 'TikTok Viral Script',
    description: 'Generate a script for viral TikTok content with trending hooks and pacing.',
    content: 'Write a 15-30 second TikTok script about [TOPIC]: Hook (first 2 seconds to stop scroll), Story (10-15 seconds), Payoff (3-5 seconds). Include: trending sounds suggestions, text overlay timing, trending hashtags, call-to-action. Make it trendy, relatable, and shareable.',
    category: 'Social Media',
    tags: ['TikTok', 'Viral', 'Video'],
    views: 11234,
    likes: 768,
    author: { name: 'ContentCreator', avatar: 'https://i.pravatar.cc/150?u=contentcreator', handle: '@contentcreat' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '8 hours ago'
  },
  {
    id: 'social-2',
    title: 'Instagram Carousel Post',
    description: 'Create a multi-slide carousel that drives engagement and saves.',
    content: 'Design an Instagram carousel (8-10 slides) about [TOPIC]: Slide 1 (hook), Slides 2-9 (educational content with visuals), Slide 10 (CTA). Include: design specs (1080x1350px), caption suggestions (3000 chars max), optimal posting time, hashtag strategy (30 tags), engagement prompts.',
    category: 'Social Media',
    tags: ['Instagram', 'Carousel', 'Strategy'],
    views: 5678,
    likes: 345,
    author: { name: 'SocialStrategist', avatar: 'https://i.pravatar.cc/150?u=socstrat', handle: '@socstrat' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '4 hours ago'
  },
  {
    id: 'mkt-1',
    title: 'Email Marketing Campaign',
    description: 'Design a high-converting email sequence for customer acquisition.',
    content: 'Create a 5-email marketing sequence for [PRODUCT]: Email 1 (welcome + story), Email 2 (problem awareness), Email 3 (solution intro), Email 4 (social proof/testimonials), Email 5 (limited offer). Include: subject lines (A/B testing), CTR-optimized copy, personalization tags, send timing recommendations.',
    category: 'Marketing',
    tags: ['Email', 'Campaign', 'Conversion'],
    views: 8945,
    likes: 601,
    author: { name: 'MarketingGuru', avatar: 'https://i.pravatar.cc/150?u=mktaguru', handle: '@mktaguru' },
    model: 'Claude 3',
    tool: 'Claude',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '1 day ago'
  },
  {
    id: 'mkt-2',
    title: 'Product Launch Timeline',
    description: 'Plan and execute a strategic product launch with PR and marketing.',
    content: 'Develop a 90-day product launch plan: Weeks 1-4 (teaser campaign), Weeks 5-8 (pre-launch buzz), Week 9 (launch day activities), Weeks 10-12 (post-launch momentum). Include: PR strategy, influencer partnerships, content calendar, paid ad strategy, metrics/KPIs, contingency plans.',
    category: 'Marketing',
    tags: ['Launch', 'Strategy', 'Planning'],
    views: 6234,
    likes: 387,
    author: { name: 'LaunchSpecialist', avatar: 'https://i.pravatar.cc/150?u=launchspec', handle: '@launchspec' },
    model: 'Claude 3',
    tool: 'Claude',
    difficulty: 'Advanced',
    status: 'Published',
    date: '3 days ago'
  },
  {
    id: 'prod-1',
    title: 'Daily Productivity System',
    description: 'Create a structured daily routine for maximum productivity and focus.',
    content: 'Design a personalized daily productivity system: 6 AM - Morning routine (30 min), 6:30-9 AM - Deep work block (2.5 hrs), 9-9:30 AM - Break, 9:30 AM-12 PM - Focused work (2.5 hrs), 12-1 PM - Lunch, 1-3 PM - Meetings/admin, 3-5 PM - Creative work, 5-6 PM - Reflection/planning. Include: time blocking, energy management, weekly review process.',
    category: 'Productivity',
    tags: ['Time Management', 'Routine', 'Focus'],
    views: 13456,
    likes: 924,
    author: { name: 'ProductivityCoach', avatar: 'https://i.pravatar.cc/150?u=prodcoach', handle: '@prodcoach' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '5 hours ago'
  },
  {
    id: 'prod-2',
    title: 'Meeting Agenda Template',
    description: 'Structure effective meetings that drive decisions and outcomes.',
    content: 'Create a meeting agenda for [MEETING TYPE]: Opening (2 min - agenda overview), Context (3 min - background), Discussion (20 min - key topics with time allocation), Decisions (5 min - action items & owners), Closing (2 min - next steps). Include: pre-meeting prep requirements, discussion guidelines, decision-making framework, follow-up format.',
    category: 'Productivity',
    tags: ['Meetings', 'Team', 'Management'],
    views: 4567,
    likes: 278,
    author: { name: 'TeamLead', avatar: 'https://i.pravatar.cc/150?u=teamlead', handle: '@teamlead' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '10 hours ago'
  },
  {
    id: 'vid-1',
    title: 'YouTube Video Script',
    description: 'Write an engaging YouTube video script with strong hooks and pacing.',
    content: 'Create a 10-minute YouTube video script for [TOPIC]: Hook (first 30 seconds), Introduction (1 min), Main Content (6-7 mins with natural transitions), Recap (1 min), CTA (30 seconds). Include: visual suggestions, B-roll descriptions, text overlays, pacing marks, keyword variations for SEO.',
    category: 'Video',
    tags: ['YouTube', 'Video', 'Content'],
    views: 9876,
    likes: 678,
    author: { name: 'VideoCreator', avatar: 'https://i.pravatar.cc/150?u=videocreator', handle: '@videocreator' },
    model: 'Claude 3',
    tool: 'Claude',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '2 days ago'
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
