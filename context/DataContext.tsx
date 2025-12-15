
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

// Helper to generate prompts
const createPrompt = (id: string, title: string, category: string, desc: string): Prompt => ({
    id, title, category, description: desc,
    content: `Detailed prompt content for ${title}. Includes specific instructions, tone, and context for best results.`,
    tags: [category, 'Featured'],
    views: Math.floor(Math.random() * 5000) + 500,
    likes: Math.floor(Math.random() * 500) + 50,
    author: { name: 'PromptPro', avatar: `https://ui-avatars.com/api/?name=${category}&background=random`, handle: '@promptpro' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Intermediate',
    status: 'Published',
    date: 'Recently'
});

const INITIAL_PROMPTS: Prompt[] = [
  // --- MARKETING & SEO ---
  createPrompt('mkt-1', 'Complete SEO Audit Checklist', 'Marketing', 'A comprehensive step-by-step checklist to audit any website for technical and on-page SEO issues.'),
  createPrompt('mkt-2', 'Instagram Reels Strategy 2025', 'Marketing', 'Viral content strategy for Instagram Reels focusing on hook retention and algorithm triggers.'),
  createPrompt('mkt-3', 'LinkedIn B2B Lead Gen', 'Marketing', 'Outreach scripts and content planning to generate high-quality B2B leads on LinkedIn.'),
  createPrompt('mkt-4', 'Email Drip Campaign Sequence', 'Marketing', '5-part email welcome series designed to nurture leads and convert them into paying customers.'),
  createPrompt('mkt-5', 'Google Ads Copy Generator', 'Marketing', 'Framework to generate high-CTR headlines and descriptions for Google Search Ads.'),
  createPrompt('mkt-6', 'Blog Post Topic Ideation', 'Marketing', 'Generate 50 blog post ideas based on a seed keyword using semantic clustering.'),
  createPrompt('mkt-7', 'Competitor Analysis Framework', 'Marketing', 'Prompt to analyze competitor strengths, weaknesses, and keyword gaps using AI.'),
  createPrompt('mkt-8', 'Landing Page CRO Tips', 'Marketing', 'Analyze a landing page copy and suggest improvements for higher conversion rates.'),
  createPrompt('mkt-9', 'TikTok Viral Scripts', 'Marketing', 'Script templates for 15-second TikTok videos that hook viewers in the first 3 seconds.'),
  createPrompt('mkt-10', 'Press Release Writer', 'Marketing', 'Professional press release format for launching a new product or service.'),
  createPrompt('mkt-11', 'YouTube Description Optimizer', 'Marketing', 'SEO-optimized YouTube video description template with timestamps and hashtags.'),
  createPrompt('mkt-12', 'Facebook Ad Targeting', 'Marketing', 'Brainstorm detailed interest-based targeting options for Facebook Ad sets.'),
  createPrompt('mkt-13', 'Influencer Outreach Template', 'Marketing', 'Cold DM scripts for reaching out to micro-influencers for brand collaborations.'),
  createPrompt('mkt-14', 'Newsletter Content Plan', 'Marketing', 'Weekly newsletter content strategy to build authority and trust with subscribers.'),
  createPrompt('mkt-15', 'Product Launch Strategy', 'Marketing', 'A 4-week timeline and checklist for a successful digital product launch.'),
  createPrompt('mkt-16', 'Keyword Research Plan', 'SEO', 'Step-by-step guide to finding low-competition, high-volume keywords for a niche site.'),
  createPrompt('mkt-17', 'Meta Description Creator', 'SEO', 'Generate click-worthy meta titles and descriptions for e-commerce product pages.'),
  createPrompt('mkt-18', 'Twitter Thread Hook', 'Marketing', 'Write 10 viral hooks for Twitter threads that encourage retweets and engagement.'),
  createPrompt('mkt-19', 'Customer Persona Builder', 'Marketing', 'Create detailed buyer personas including pain points, goals, and demographics.'),
  createPrompt('mkt-20', 'Sales Funnel Architecture', 'Marketing', 'Map out a complete sales funnel from awareness to retention for a SaaS product.'),

  // --- SOCIAL MEDIA ---
  createPrompt('soc-1', 'Viral TikTok Hook Generator', 'Social Media', 'Create scroll-stopping hooks for TikTok videos that increase retention.'),
  createPrompt('soc-2', 'LinkedIn Thought Leadership', 'Social Media', 'Draft a professional thought leadership post about industry trends.'),
  createPrompt('soc-3', 'Instagram Carousel Storyboard', 'Social Media', 'Plan a 10-slide educational carousel for Instagram growth.'),
  createPrompt('soc-4', 'Twitter/X Thread Composer', 'Social Media', 'Turn a blog post into an engaging Twitter thread.'),
  createPrompt('soc-5', 'YouTube Video Script Intro', 'Social Media', 'Write a high-energy intro script for a tech review channel.'),
  createPrompt('soc-6', 'Social Media Content Calendar', 'Social Media', 'Generate a 30-day content calendar for a lifestyle brand.'),
  createPrompt('soc-7', 'Facebook Community Engagement', 'Social Media', 'Questions and polls to boost engagement in a Facebook Group.'),
  createPrompt('soc-8', 'Pinterest Pin Descriptions', 'Social Media', 'SEO-optimized descriptions for Pinterest pins to drive traffic.'),
  createPrompt('soc-9', 'Influencer Collaboration Pitch', 'Social Media', 'Professional DM script to pitch a collaboration to influencers.'),
  createPrompt('soc-10', 'Crisis Management Response', 'Social Media', 'Draft a public response to a negative social media comment.'),
  createPrompt('soc-11', 'Instagram Bio Optimizer', 'Social Media', 'Create a compelling Instagram bio with keywords and CTA.'),
  createPrompt('soc-12', 'YouTube Thumbnail Concepts', 'Social Media', 'Brainstorm 5 click-worthy thumbnail concepts for a video.'),
  createPrompt('soc-13', 'Podcast Episode Outline', 'Social Media', 'Structure a 30-minute podcast episode about entrepreneurship.'),
  createPrompt('soc-14', 'User Generated Content Brief', 'Social Media', 'Brief for creators to generate authentic UGC for a brand.'),
  createPrompt('soc-15', 'Hashtag Strategy Generator', 'Social Media', 'Generate niche-specific hashtags for maximum reach.'),
  createPrompt('soc-16', 'Social Media Audit Checklist', 'Social Media', 'Checklist to audit brand presence across all platforms.'),
  createPrompt('soc-17', 'Live Stream Run of Show', 'Social Media', 'Plan a 1-hour live stream Q&A session.'),
  createPrompt('soc-18', 'Engagement Reply Bank', 'Social Media', 'Witty and professional replies to common user comments.'),
  createPrompt('soc-19', 'Social Media Contest Rules', 'Social Media', 'Draft clear terms and conditions for an Instagram giveaway.'),
  createPrompt('soc-20', 'Trend Jacking Ideas', 'Social Media', 'How to leverage current trending memes for a corporate brand.'),

  // --- CODING ---
  createPrompt('code-1', 'React Component Generator', 'Coding', 'Create a reusable React functional component with TypeScript interfaces.'),
  createPrompt('code-2', 'Python Data Analysis Script', 'Coding', 'Pandas script to clean and visualize a CSV dataset.'),
  createPrompt('code-3', 'SQL Query Optimizer', 'Coding', 'Optimize a complex SQL query for better performance.'),
  createPrompt('code-4', 'Regex Pattern Builder', 'Coding', 'Generate a Regex pattern to validate email addresses strictly.'),
  createPrompt('code-5', 'Unit Test Writer (Jest)', 'Coding', 'Write comprehensive unit tests for a JavaScript utility function.'),
  createPrompt('code-6', 'API Documentation Generator', 'Coding', 'Generate Swagger/OpenAPI documentation from a JSON response.'),
  createPrompt('code-7', 'Docker Compose Setup', 'Coding', 'Create a docker-compose.yml for a Node.js + Postgres stack.'),
  createPrompt('code-8', 'CSS Flexbox Layout', 'Coding', 'Generate CSS code for a responsive 3-column flexbox layout.'),
  createPrompt('code-9', 'Git Command Cheat Sheet', 'Coding', 'List essential Git commands for branching and merging.'),
  createPrompt('code-10', 'Debugging Assistant', 'Coding', 'Analyze a stack trace and suggest potential fixes.'),
  createPrompt('code-11', 'HTML5 Boilerplate', 'Coding', 'Create a semantic HTML5 starter template with meta tags.'),
  createPrompt('code-12', 'Node.js Express Server', 'Coding', 'Setup a basic Express server with error handling and logging.'),
  createPrompt('code-13', 'Tailwind CSS Component', 'Coding', 'Create a modern card component using Tailwind CSS utility classes.'),
  createPrompt('code-14', 'Python Web Scraper (Bs4)', 'Coding', 'Scrape product titles and prices from a static HTML page.'),
  createPrompt('code-15', 'JavaScript Array Methods', 'Coding', 'Explain map, filter, and reduce with practical examples.'),
  createPrompt('code-16', 'TypeScript Interface from JSON', 'Coding', 'Convert a JSON object into a TypeScript interface definition.'),
  createPrompt('code-17', 'Bash Script Automation', 'Coding', 'Write a shell script to automate file backups.'),
  createPrompt('code-18', 'GraphQL Schema Design', 'Coding', 'Design a GraphQL schema for a blog application.'),
  createPrompt('code-19', 'Next.js API Route', 'Coding', 'Create a Next.js API route to handle form submissions.'),
  createPrompt('code-20', 'Code Refactoring Tips', 'Coding', 'Suggest improvements to make code more readable and dry.'),

  // --- BUSINESS ---
  createPrompt('biz-1', 'Business Plan Executive Summary', 'Business', 'Draft a compelling executive summary for a SaaS startup.'),
  createPrompt('biz-2', 'SWOT Analysis Generator', 'Business', 'Conduct a detailed SWOT analysis for a local coffee shop.'),
  createPrompt('biz-3', 'Investor Pitch Deck Outline', 'Business', 'Structure a 12-slide pitch deck for raising seed funding.'),
  createPrompt('biz-4', 'Mission & Vision Statement', 'Business', 'Create inspiring mission and vision statements for a non-profit.'),
  createPrompt('biz-5', 'Cold Email for Sales', 'Business', 'Write a persuasive cold email to book a demo with a prospect.'),
  createPrompt('biz-6', 'Job Description Creator', 'Business', 'Write a detailed job description for a Senior Project Manager.'),
  createPrompt('biz-7', 'Meeting Agenda Template', 'Business', 'Create an agenda for a weekly team sync to ensure efficiency.'),
  createPrompt('biz-8', 'OKR Setting Framework', 'Business', 'Define Objectives and Key Results for a marketing team quarter.'),
  createPrompt('biz-9', 'Customer Feedback Survey', 'Business', 'Design a 5-question survey to measure customer satisfaction (NPS).'),
  createPrompt('biz-10', 'Revenue Model Brainstorming', 'Business', 'Brainstorm 5 potential revenue streams for a fitness app.'),
  createPrompt('biz-11', 'Competitor Research Matrix', 'Business', 'Create a matrix to compare features of top 3 competitors.'),
  createPrompt('biz-12', 'Product Launch Checklist', 'Business', 'Comprehensive checklist for launching a physical product.'),
  createPrompt('biz-13', 'Employee Onboarding Plan', 'Business', '30-60-90 day onboarding plan for a new hire.'),
  createPrompt('biz-14', 'Partnership Proposal Letter', 'Business', 'Draft a formal proposal for a strategic business partnership.'),
  createPrompt('biz-15', 'Risk Management Plan', 'Business', 'Identify potential risks and mitigation strategies for an event.'),
  createPrompt('biz-16', 'Brand Value Proposition', 'Business', 'Articulate a unique value proposition for a consulting firm.'),
  createPrompt('biz-17', 'Negotiation Script', 'Business', 'Script for negotiating a better rate with a vendor.'),
  createPrompt('biz-18', 'Quarterly Business Review', 'Business', 'Structure a presentation for a Quarterly Business Review (QBR).'),
  createPrompt('biz-19', 'Exit Strategy Planning', 'Business', 'Outline potential exit strategies for a small business owner.'),
  createPrompt('biz-20', 'Team Building Activity Ideas', 'Business', 'List 5 remote-friendly team building activities.'),

  // --- BRANDING & COPYWRITING (Writing) ---
  createPrompt('brand-1', 'Brand Tone of Voice Guide', 'Writing', 'Define a quirky and friendly tone of voice for a pet brand.'),
  createPrompt('brand-2', 'Catchy Slogan Generator', 'Branding', 'Generate 10 catchy slogans for a sustainable clothing line.'),
  createPrompt('brand-3', 'Website About Us Page', 'Writing', 'Write an engaging "About Us" story for a family bakery.'),
  createPrompt('brand-4', 'Product Description (SEO)', 'Writing', 'Write a persuasive, SEO-friendly description for noise-canceling headphones.'),
  createPrompt('brand-5', 'Brand Name Ideas', 'Branding', 'Brainstorm 20 unique names for a new tech startup.'),
  createPrompt('brand-6', 'Landing Page Headline', 'Writing', 'Create 5 high-converting headlines for a webinar landing page.'),
  createPrompt('brand-7', 'Company Manifesto', 'Branding', 'Draft a company manifesto that outlines core values and beliefs.'),
  createPrompt('brand-8', 'Press Release for Launch', 'Writing', 'Write a press release announcing a new mobile app launch.'),
  createPrompt('brand-9', 'Email Newsletter Subject Lines', 'Writing', 'Generate 10 open-worthy subject lines for a weekly newsletter.'),
  createPrompt('brand-10', 'Brand Archetype Definition', 'Branding', 'Determine the brand archetype for a luxury watch company.'),
  createPrompt('brand-11', 'Video Ad Script (30s)', 'Writing', 'Write a script for a 30-second video ad focusing on emotion.'),
  createPrompt('brand-12', 'Tagline Brainstorming', 'Branding', 'Create short, punchy taglines for a coffee subscription service.'),
  createPrompt('brand-13', 'FAQ Section Writer', 'Writing', 'Write clear answers for a "Frequently Asked Questions" page.'),
  createPrompt('brand-14', 'Brand Color Psychology', 'Branding', 'Suggest a color palette based on psychology for a health brand.'),
  createPrompt('brand-15', 'Case Study Narrative', 'Writing', 'Structure a compelling case study about a client success story.'),
  createPrompt('brand-16', 'Social Media Bio (Brand)', 'Branding', 'Write a professional yet approachable bio for a LinkedIn company page.'),
  createPrompt('brand-17', 'Event Invitation Copy', 'Writing', 'Write an inviting email invitation for an exclusive VIP dinner.'),
  createPrompt('brand-18', 'Brand Storytelling Framework', 'Branding', 'Outline the hero\'s journey for a brand story.'),
  createPrompt('brand-19', 'Customer Testimonial Rewrite', 'Writing', 'Polish a rough customer testimonial into a marketing asset.'),
  createPrompt('brand-20', 'Unique Selling Proposition', 'Branding', 'Define the USP for an eco-friendly cleaning product.'),

  // --- ART & IMAGE GEN ---
  createPrompt('art-1', 'Cyberpunk Cityscape', 'Art', 'A futuristic cyberpunk city street at night, neon lights, rain reflection, 8k render.'),
  createPrompt('art-2', 'Fantasy Character Portrait', 'Art', 'Close-up portrait of an elven ranger, intricate armor, forest background, cinematic lighting.'),
  createPrompt('art-3', 'Minimalist Logo Design', 'Art', 'Vector logo for a coffee shop, minimalist line art, cup icon, modern style.'),
  createPrompt('art-4', 'Isometric Room Design', 'Art', '3D isometric view of a cozy gamer room, purple lighting, detailed clutter, unreal engine 5.'),
  createPrompt('art-5', 'Watercolor Landscape', 'Art', 'Serene mountain landscape with a lake, watercolor style, soft pastel colors, dreamy atmosphere.'),
  createPrompt('art-6', 'Pixel Art Game Asset', 'Art', '16-bit pixel art sprite of a knight character running animation frame.'),
  createPrompt('art-7', 'Abstract Oil Painting', 'Art', 'Abstract expressionist oil painting, vibrant swirls of blue and gold, thick texture.'),
  createPrompt('art-8', 'Photorealistic Food Photography', 'Art', 'Gourmet burger with melting cheese, macro shot, professional food photography, depth of field.'),
  createPrompt('art-9', 'Sci-Fi Space Station', 'Art', 'Exterior view of a massive space station orbiting a blue planet, cinematic sci-fi art.'),
  createPrompt('art-10', 'Vintage Travel Poster', 'Art', 'Retro travel poster style illustration of Paris, Eiffel Tower, flat colors, vintage font.'),
  createPrompt('art-11', '3D Character Model', 'Art', 'Cute 3D rendered character, pixar style, fluffy monster, bright colors, studio lighting.'),
  createPrompt('art-12', 'Concept Art Landscape', 'Art', 'Epic fantasy landscape concept art, floating islands, waterfalls, digital painting style.'),
  createPrompt('art-13', 'T-Shirt Design Vector', 'Art', 'Cool skull design with roses for t-shirt print, vector illustration, sharp lines.'),
  createPrompt('art-14', 'Anime Style Portrait', 'Art', 'Anime girl with blue hair, city background, Makoto Shinkai style, lens flare.'),
  createPrompt('art-15', 'Pattern Design', 'Art', 'Seamless floral pattern, vintage wallpaper style, muted colors.'),
  createPrompt('art-16', 'Double Exposure Animal', 'Art', 'Double exposure silhouette of a bear combined with a forest landscape.'),
  createPrompt('art-17', 'Architecture Visualization', 'Art', 'Modern glass house in the woods, architectural visualization, photorealistic, evening light.'),
  createPrompt('art-18', 'Sticker Design', 'Art', 'Cute cat sticker design, white border, kawaii style, flat vector.'),
  createPrompt('art-19', 'Surrealist Collage', 'Art', 'Surreal digital collage, man with cloud head, floating objects, dreamlike.'),
  createPrompt('art-20', 'UI App Mockup', 'Art', 'Clean mobile app UI design for a travel app, dashboard view, modern aesthetics.'),

  // --- VIDEO GENERATION ---
  createPrompt('vid-gen-1', 'Cinematic Drone Shot', 'Video Generation', 'Drone view soaring over a Norwegian fjord at sunrise, 4k cinematic lighting, slow smooth motion.'),
  createPrompt('vid-gen-2', 'Cyberpunk Street Walk', 'Video Generation', 'First-person view walking down a rainy cyberpunk street at night, neon signs reflecting in puddles.'),
  createPrompt('vid-gen-3', 'Underwater Coral Reef', 'Video Generation', 'Vibrant coral reef teeming with exotic fish, sunlight shafts piercing through the water surface.'),
  createPrompt('vid-gen-4', 'Time-Lapse Blooming Flower', 'Video Generation', 'A pink rose blooming in time-lapse, studio black background, high detail macro shot.'),
  createPrompt('vid-gen-5', 'Abstract Liquid Ink', 'Video Generation', 'Swirling colorful ink in water, slow motion, abstract art style, blue and gold colors.'),
  createPrompt('vid-gen-6', 'Space Nebula Flythrough', 'Video Generation', 'Flying through a colorful nebula in deep space, stars passing by, epic orchestral feel.'),
  createPrompt('vid-gen-7', 'Cute Robot Animation', 'Video Generation', 'A small cute robot waving hello, pixar style animation, bright studio lighting.'),
  createPrompt('vid-gen-8', 'Stormy Ocean Waves', 'Video Generation', 'Rough ocean waves crashing during a storm, dark moody lighting, realistic water physics.'),
  createPrompt('vid-gen-9', 'Medieval Battle Scene', 'Video Generation', 'Wide shot of a medieval army marching across a field, cinematic epic movie style.'),
  createPrompt('vid-gen-10', 'Cooking Steak Sizzle', 'Video Generation', 'Close up of a steak sizzling on a grill, smoke rising, appetizing food videography.'),

  // --- MUSIC GENERATION ---
  createPrompt('mus-gen-1', 'Lo-Fi Study Beat', 'Audio Generation', 'Chill lo-fi hip hop beat for studying, rain sounds in background, slow tempo, relaxing piano.'),
  createPrompt('mus-gen-2', 'Epic Orchestral Trailer', 'Audio Generation', 'Epic orchestral music for a movie trailer, building tension, massive drums, choir, heroic climax.'),
  createPrompt('mus-gen-3', 'Synthwave Retrowave', 'Audio Generation', 'Upbeat 80s synthwave track, neon retro feel, driving bassline, analog synthesizers.'),
  createPrompt('mus-gen-4', 'Ambient Meditation', 'Audio Generation', 'Deep ambient drone music for meditation, 432hz, peaceful, airy pads, nature textures.'),
  createPrompt('mus-gen-5', 'Upbeat Pop Song', 'Audio Generation', 'Catchy summer pop song, female vocals, upbeat guitar strumming, feel-good vibes.'),
  createPrompt('mus-gen-6', 'Cyberpunk Industrial', 'Audio Generation', 'Dark industrial techno for a cyberpunk club, heavy bass, distorted drums, futuristic fx.'),
  createPrompt('mus-gen-7', 'Acoustic Folk Guitar', 'Audio Generation', 'Gentle acoustic guitar fingerpicking, folk style, warm and nostalgic atmosphere.'),
  createPrompt('mus-gen-8', 'Jazz Cafe Piano', 'Audio Generation', 'Smooth jazz piano trio, upright bass, brushed drums, sophisticated coffee shop vibe.'),
  createPrompt('mus-gen-9', '8-Bit Chiptune', 'Audio Generation', 'Energetic 8-bit chiptune track for a retro video game level, fast tempo, catchy melody.'),
  createPrompt('mus-gen-10', 'Trap Beat Instrumental', 'Audio Generation', 'Hard hitting trap beat, 808 bass, rapid hi-hats, dark melody, modern hip hop style.'),
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

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  // LocalStorage Helper - Updated Keys to V3 to flush old data and load new prompts
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

  const [tools, setTools] = useState<Tool[]>(() => loadFromStorage('trendhub_tools_v3', INITIAL_TOOLS));
  const [prompts, setPrompts] = useState<Prompt[]>(() => loadFromStorage('trendhub_prompts_v5', INITIAL_PROMPTS)); // Bumped version to v5 to force refresh
  const [videos, setVideos] = useState<Video[]>(() => loadFromStorage('trendhub_videos_v3', INITIAL_VIDEOS));
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('trendhub_users_v3', INITIAL_USERS));
  
  // Maintenance Mode State
  const [maintenanceMode, setMaintenanceModeState] = useState<boolean>(() => loadFromStorage('trendhub_maintenance_mode', false));

  // Sync to LocalStorage - Updated Keys
  useEffect(() => { try { window.localStorage.setItem('trendhub_tools_v3', JSON.stringify(tools)); } catch (e) {} }, [tools]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_prompts_v5', JSON.stringify(prompts)); } catch (e) {} }, [prompts]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_videos_v3', JSON.stringify(videos)); } catch (e) {} }, [videos]);
  useEffect(() => { try { window.localStorage.setItem('trendhub_users_v3', JSON.stringify(users)); } catch (e) {} }, [users]);
  
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
