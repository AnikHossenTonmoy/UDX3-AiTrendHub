
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
  // --- IMAGE GENERATION ---
  {
    id: 'p-img-1',
    title: 'Ultra-Realistic Fantasy Portrait',
    description: 'Generate a highly detailed fantasy warrior portrait with cinematic lighting.',
    content: 'Create an ultra-realistic portrait of a fantasy warrior with glowing eyes, cinematic lighting, 8k detail, intricate armor design, unreal engine 5 render style.',
    category: 'Image Generation',
    tags: ['Art', 'Fantasy', 'Realistic', 'Midjourney'],
    views: 12500,
    likes: 843,
    author: { name: 'ArtMaster', avatar: 'https://ui-avatars.com/api/?name=ArtMaster&background=random', handle: '@artmaster' },
    model: 'Midjourney',
    tool: 'Midjourney',
    images: ['https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=600&auto=format&fit=crop'], 
    difficulty: 'Intermediate',
    status: 'Published',
    date: '1 day ago'
  },
  {
    id: 'p-img-2',
    title: 'Cyberpunk Cityscape',
    description: 'Neon-soaked futuristic city street at night with rain reflections.',
    content: 'A futuristic cyberpunk city street at night, heavy rain, neon lights reflecting on wet pavement, towering skyscrapers with holographic ads, cinematic composition, photorealistic, 8k resolution.',
    category: 'Image Generation',
    tags: ['Art', 'Sci-Fi', 'Cyberpunk', 'DALL-E 3'],
    views: 8900,
    likes: 560,
    author: { name: 'NeonDreams', avatar: 'https://ui-avatars.com/api/?name=NeonDreams&background=random', handle: '@neondreams' },
    model: 'DALL-E 3',
    tool: 'DALL-E 3',
    images: ['https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=600&auto=format&fit=crop'],
    difficulty: 'Beginner',
    status: 'Published',
    date: '2 days ago'
  },
  {
    id: 'p-img-3',
    title: 'Minimalist Vector Logo',
    description: 'Create a clean, modern vector logo for a tech startup.',
    content: 'A flat vector logo for a technology startup named "Nexus", minimalist design, geometric shapes, shades of blue and white, clean lines, white background, high quality.',
    category: 'Image Generation',
    tags: ['Logo', 'Design', 'Minimalist'],
    views: 15400,
    likes: 1200,
    author: { name: 'DesignPro', avatar: 'https://ui-avatars.com/api/?name=DesignPro&background=random', handle: '@designpro' },
    model: 'Midjourney',
    tool: 'Midjourney',
    images: ['https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=600&auto=format&fit=crop'],
    difficulty: 'Beginner',
    status: 'Published',
    date: '3 days ago'
  },

  // --- WRITING ---
  {
    id: 'p-wrt-1',
    title: 'Compelling Blog Post Intro',
    description: 'Write a hook-filled introduction for an article about AI adoption.',
    content: 'Write a compelling introduction for a blog post titled "Why AI Will Not Replace You, But Someone Using AI Will". Start with a provocative hook, use data to support the claim, and transition into the main argument. Tone: Professional yet urgent.',
    category: 'Writing',
    tags: ['Blog', 'Copywriting', 'Content'],
    views: 5600,
    likes: 320,
    author: { name: 'ContentKing', avatar: 'https://ui-avatars.com/api/?name=ContentKing&background=random', handle: '@contentking' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '1 week ago'
  },
  {
    id: 'p-wrt-2',
    title: 'Storytelling Framework',
    description: 'Rewrite a boring business case study as a hero\'s journey story.',
    content: 'Take the following business case study about a software migration and rewrite it using the "Hero\'s Journey" storytelling framework. The "Hero" is the client, the "Villain" is the legacy system, and the "Guide" is our consulting firm. Make it engaging and emotional.',
    category: 'Writing',
    tags: ['Storytelling', 'Business', 'Creative'],
    views: 4100,
    likes: 210,
    author: { name: 'StoryTeller', avatar: 'https://ui-avatars.com/api/?name=StoryTeller&background=random', handle: '@storyteller' },
    model: 'Claude 3',
    tool: 'Claude 3',
    difficulty: 'Advanced',
    status: 'Published',
    date: '5 days ago'
  },
  {
    id: 'p-wrt-3',
    title: 'Cold Email Outreach',
    description: 'Generate a high-conversion cold email for B2B sales.',
    content: 'Write a cold email to a VP of Marketing at a SaaS company offering them a new SEO tool. Use the PAS (Problem-Agitate-Solution) framework. Keep it under 150 words. Subject line should be catchy but not clickbaity.',
    category: 'Writing',
    tags: ['Sales', 'Email', 'Marketing'],
    views: 9200,
    likes: 650,
    author: { name: 'SalesGuru', avatar: 'https://ui-avatars.com/api/?name=SalesGuru&background=random', handle: '@salesguru' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '3 days ago'
  },

  // --- MARKETING & SEO ---
  {
    id: 'p-mkt-1',
    title: '30-Day Social Media Calendar',
    description: 'Create a month-long content plan for a coffee brand.',
    content: 'Create a 30-day social media content calendar for a sustainable coffee brand. The platforms are Instagram and LinkedIn. Themes: Sustainability, Morning Routine, and Coffee Education. Output as a table with columns: Day, Platform, Content Idea, Caption Draft.',
    category: 'Marketing',
    tags: ['Social Media', 'Strategy', 'Planning'],
    views: 11000,
    likes: 900,
    author: { name: 'SocialSavvy', avatar: 'https://ui-avatars.com/api/?name=SocialSavvy&background=random', handle: '@socialsavvy' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '2 days ago'
  },
  {
    id: 'p-seo-1',
    title: 'SEO Keyword Strategy',
    description: 'Generate long-tail keywords for a fitness blog.',
    content: 'Act as an SEO expert. Generate a list of 20 long-tail keywords for a new blog about "Home Calisthenics Workouts". Sort them by search intent (Informational, Commercial, Transactional). For each keyword, suggest a blog post title.',
    category: 'SEO',
    tags: ['Keywords', 'Strategy', 'Ranking'],
    views: 6700,
    likes: 430,
    author: { name: 'SEOWhiz', avatar: 'https://ui-avatars.com/api/?name=SEOWhiz&background=random', handle: '@seowhiz' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '4 days ago'
  },
  {
    id: 'p-mkt-2',
    title: 'Product Launch Tweet Thread',
    description: 'Write a viral Twitter thread for a new productivity app.',
    content: 'Write a 10-tweet thread announcing the launch of "FocusFlow", a new AI productivity app. The hook should address the problem of distraction. Use emojis sparingly. Include a CTA in the final tweet. Tone: Exciting and revolutionary.',
    category: 'Social Media',
    tags: ['Twitter', 'Launch', 'Viral'],
    views: 5500,
    likes: 340,
    author: { name: 'TweetMaster', avatar: 'https://ui-avatars.com/api/?name=TweetMaster&background=random', handle: '@tweetmaster' },
    model: 'GPT-3.5',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '1 week ago'
  },

  // --- CODING ---
  {
    id: 'p-code-1',
    title: 'Python Web Scraper',
    description: 'Script to scrape product prices using BeautifulSoup.',
    content: 'Write a Python script using BeautifulSoup and Requests to scrape product names and prices from an e-commerce demo site (example.com). Include error handling for network requests and comments explaining each step.',
    category: 'Coding',
    tags: ['Python', 'Automation', 'Scripting'],
    views: 14200,
    likes: 1100,
    author: { name: 'CodeNinja', avatar: 'https://ui-avatars.com/api/?name=CodeNinja&background=random', handle: '@codeninja' },
    model: 'GPT-4',
    tool: 'GitHub Copilot',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '2 weeks ago'
  },
  {
    id: 'p-code-2',
    title: 'React Custom Hook: useFetch',
    description: 'Create a reusable React hook for data fetching.',
    content: 'Create a custom React hook named "useFetch" that accepts a URL. It should return data, loading state, and error state. Handle the component unmount cleanup using AbortController. Provide a usage example.',
    category: 'Coding',
    tags: ['React', 'JavaScript', 'Frontend'],
    views: 9800,
    likes: 780,
    author: { name: 'ReactDev', avatar: 'https://ui-avatars.com/api/?name=ReactDev&background=random', handle: '@reactdev' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '5 days ago'
  },
  {
    id: 'p-code-3',
    title: 'SQL Query Optimizer',
    description: 'Optimize a slow SQL query for a large dataset.',
    content: 'I have a slow SQL query: [INSERT QUERY HERE]. Act as a Database Administrator. Explain why it might be slow on a table with 1 million rows and rewrite it to be more efficient. Suggest indexes that should be added.',
    category: 'Coding',
    tags: ['SQL', 'Database', 'Performance'],
    views: 4500,
    likes: 310,
    author: { name: 'DBAdmin', avatar: 'https://ui-avatars.com/api/?name=DBAdmin&background=random', handle: '@dbadmin' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Advanced',
    status: 'Published',
    date: '3 days ago'
  },

  // --- BUSINESS & PRODUCTIVITY ---
  {
    id: 'p-biz-1',
    title: 'SWOT Analysis Generator',
    description: 'Perform a SWOT analysis for a local restaurant.',
    content: 'Act as a Business Consultant. Perform a SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) for a high-end Italian restaurant located in a busy downtown area facing rising food costs but high demand.',
    category: 'Business',
    tags: ['Strategy', 'Analysis', 'Consulting'],
    views: 7800,
    likes: 520,
    author: { name: 'BizGuru', avatar: 'https://ui-avatars.com/api/?name=BizGuru&background=random', handle: '@bizguru' },
    model: 'Claude 3',
    tool: 'Claude 3',
    difficulty: 'Beginner',
    status: 'Published',
    date: '4 days ago'
  },
  {
    id: 'p-prod-1',
    title: 'Excel Formula Expert',
    description: 'Complex VLOOKUP and IF statement combination.',
    content: 'I need an Excel formula that looks up a value in Column A of Sheet2. If found, return the value in Column B. If not found, check Column A of Sheet3. If still not found, return "Not Available". Explain how the formula works.',
    category: 'Productivity',
    tags: ['Excel', 'Data', 'Office'],
    views: 13000,
    likes: 950,
    author: { name: 'ExcelWizard', avatar: 'https://ui-avatars.com/api/?name=ExcelWizard&background=random', handle: '@excelwizard' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '1 week ago'
  },
  {
    id: 'p-biz-2',
    title: 'Job Interview Prep',
    description: 'Simulate a job interview for a Project Manager role.',
    content: 'Act as a hiring manager for a tech company. I am applying for a Senior Project Manager role. Ask me 5 tough behavioral interview questions one by one, waiting for my response before asking the next. After my response, give me feedback.',
    category: 'Business',
    tags: ['Career', 'Interview', 'Coaching'],
    views: 8100,
    likes: 600,
    author: { name: 'CareerCoach', avatar: 'https://ui-avatars.com/api/?name=CareerCoach&background=random', handle: '@careercoach' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: '2 days ago'
  },
  {
    id: 'p-learn-1',
    title: 'Explain Quantum Physics',
    description: 'Explain complex physics to a 5-year-old.',
    content: 'Explain the concept of Quantum Entanglement to a 5-year-old using a simple analogy involving toys or socks. Keep it fun and under 100 words.',
    category: 'Productivity',
    tags: ['Education', 'Learning', 'Science'],
    views: 6200,
    likes: 480,
    author: { name: 'ProfAI', avatar: 'https://ui-avatars.com/api/?name=ProfAI&background=random', handle: '@profai' },
    model: 'GPT-3.5',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    status: 'Published',
    date: '3 weeks ago'
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
