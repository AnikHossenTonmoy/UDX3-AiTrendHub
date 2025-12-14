
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tool, Prompt, Video } from '../types';

interface DataContextType {
  tools: Tool[];
  prompts: Prompt[];
  videos: Video[];
  addTool: (tool: Tool) => void;
  addTools: (newTools: Tool[]) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  addPrompt: (prompt: Prompt) => void;
  deleteTool: (id: string) => void;
  deletePrompt: (id: string) => void;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
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
  // --- AI Chat & Assistant ---
  createTool('chat-1', 'ChatGPT', 'https://chat.openai.com', 'AI Chat & Assistant', 'The industry-leading conversational AI model by OpenAI.', false, 500000, true),
  createTool('chat-2', 'Claude 3', 'https://anthropic.com', 'AI Chat & Assistant', 'Anthropic\'s most capable and safe AI model with large context window.', false, 180000, true),
  createTool('chat-3', 'Gemini', 'https://gemini.google.com', 'AI Chat & Assistant', 'Google\'s largest and most capable multimodal AI model.', false, 220000, true),
  createTool('chat-4', 'Perplexity', 'https://perplexity.ai', 'AI Chat & Assistant', 'An AI-powered answer engine that cites sources.', false, 95000, true),
  createTool('chat-5', 'Copilot', 'https://copilot.microsoft.com', 'AI Chat & Assistant', 'Your everyday AI companion from Microsoft.', false, 150000, true),
  createTool('chat-6', 'Poe', 'https://poe.com', 'AI Chat & Assistant', 'Fast, helpful AI chat with access to multiple models.', false, 40000),
  createTool('chat-7', 'HuggingChat', 'https://huggingface.co/chat', 'AI Chat & Assistant', 'Open source chat interface by Hugging Face.', false, 25000),
  createTool('chat-8', 'Pi', 'https://inflection.ai', 'AI Chat & Assistant', 'A supportive and empathetic personal AI.', false, 30000),
  createTool('chat-9', 'Grok', 'https://x.ai', 'AI Chat & Assistant', 'AI with a rebellious streak, integrated into X.', true, 60000, true),
  createTool('chat-10', 'Mistral Le Chat', 'https://chat.mistral.ai', 'AI Chat & Assistant', 'European open-weight model champion.', false, 15000),
  createTool('chat-11', 'YouChat', 'https://you.com', 'AI Chat & Assistant', 'The AI search engine you control.', false, 20000),
  createTool('chat-12', 'Jasper Chat', 'https://jasper.ai/chat', 'AI Chat & Assistant', 'AI chat built for business and marketing.', true, 12000),

  // --- Image Generators ---
  createTool('img-1', 'Midjourney', 'https://midjourney.com', 'Image Generators', 'Create stunning, photorealistic AI art from text prompts.', true, 450000, true),
  createTool('img-2', 'DALL-E 3', 'https://openai.com/dall-e-3', 'Image Generators', 'OpenAI\'s advanced image generation model integrated with ChatGPT.', true, 320000, true),
  createTool('img-3', 'Stable Diffusion', 'https://stability.ai', 'Image Generators', 'Open-source image generation for everyone.', false, 280000, true),
  createTool('img-4', 'Leonardo.ai', 'https://leonardo.ai', 'Image Generators', 'Generate production-quality assets for creative projects.', false, 150000),
  createTool('img-5', 'Adobe Firefly', 'https://firefly.adobe.com', 'Image Generators', 'Generative AI for creators, safe for commercial use.', false, 120000, true),
  createTool('img-6', 'NightCafe', 'https://nightcafe.studio', 'Image Generators', 'AI Art Generator App.', false, 45000),
  createTool('img-7', 'Playground AI', 'https://playgroundai.com', 'Image Generators', 'Free-to-use online AI image creator.', false, 30000),
  createTool('img-8', 'DreamStudio', 'https://dreamstudio.ai', 'Image Generators', 'Interface for Stable Diffusion by Stability AI.', true, 25000),
  createTool('img-9', 'Bing Image Creator', 'https://bing.com/images/create', 'Image Generators', 'Powered by DALL-E 3, free with Microsoft account.', false, 200000),
  createTool('img-10', 'Civitai', 'https://civitai.com', 'Image Generators', 'Model-sharing hub for the Stable Diffusion community.', false, 80000),
  createTool('img-11', 'Ideogram', 'https://ideogram.ai', 'Image Generators', 'Reliable text integration in generated images.', false, 18000),
  createTool('img-12', 'Clipdrop', 'https://clipdrop.co', 'Image Generators', 'Create stunning visuals in seconds.', true, 22000),
  createTool('img-13', 'Artbreeder', 'https://artbreeder.com', 'Image Generators', 'Mashup and evolve images.', false, 35000),

  // --- Writing & Web SEO ---
  createTool('wri-1', 'Jasper', 'https://jasper.ai', 'Writing & Web SEO', 'AI copywriter for enterprise marketing teams.', true, 45000, true),
  createTool('wri-2', 'Copy.ai', 'https://copy.ai', 'Writing & Web SEO', 'Generate marketing copy in seconds.', false, 38000),
  createTool('wri-3', 'Surfer SEO', 'https://surferseo.com', 'Writing & Web SEO', 'Rank your content with AI-powered SEO optimization.', true, 22000),
  createTool('wri-4', 'Writesonic', 'https://writesonic.com', 'Writing & Web SEO', 'AI writer for blogs, ads, and landing pages.', false, 18000),
  createTool('wri-5', 'Grammarly', 'https://grammarly.com', 'Writing & Web SEO', 'AI writing assistance for clear, mistake-free writing.', false, 300000, true),
  createTool('wri-6', 'Quillbot', 'https://quillbot.com', 'Writing & Web SEO', 'Paraphrasing tool to enhance your writing.', false, 150000),
  createTool('wri-7', 'Rytr', 'https://rytr.me', 'Writing & Web SEO', 'Better, faster way to write profile bios, blogs, and more.', false, 25000),
  createTool('wri-8', 'Sudowrite', 'https://sudowrite.com', 'Writing & Web SEO', 'The AI writing partner you always wanted.', true, 8000),
  createTool('wri-9', 'Wordtune', 'https://wordtune.com', 'Writing & Web SEO', 'Your personal writing companion.', false, 40000),
  createTool('wri-10', 'Frase', 'https://frase.io', 'Writing & Web SEO', 'AI for SEO content and research.', true, 10000),
  createTool('wri-11', 'Hemingway Editor', 'https://hemingwayapp.com', 'Writing & Web SEO', 'Make your writing bold and clear.', false, 60000),
  createTool('wri-12', 'Writer', 'https://writer.com', 'Writing & Web SEO', 'The full-stack generative AI platform for enterprises.', true, 15000),

  // --- Video Generators ---
  createTool('vid-1', 'Runway', 'https://runwayml.com', 'Video Generators', 'Advanced video editing and generation tools.', true, 55000, true),
  createTool('vid-2', 'Pika', 'https://pika.art', 'Video Generators', 'Idea-to-video platform that brings your creativity to life.', false, 45000),
  createTool('vid-3', 'Sora', 'https://openai.com/sora', 'Video Generators', 'Create realistic and imaginative scenes from text instructions.', true, 99000, true),
  createTool('vid-4', 'HeyGen', 'https://heygen.com', 'Video Generators', 'Create AI avatar videos for business.', true, 22000),
  createTool('vid-5', 'Synthesia', 'https://synthesia.io', 'Video Generators', 'AI video generation platform for enterprise.', true, 28000),
  createTool('vid-6', 'InVideo', 'https://invideo.io', 'Video Generators', 'Turn text into video with AI.', false, 35000),
  createTool('vid-7', 'D-ID', 'https://d-id.com', 'Video Generators', 'Create realistic digital humans.', true, 18000),
  createTool('vid-8', 'Descript', 'https://descript.com', 'Video Generators', 'All-in-one video and audio editing.', true, 30000),
  createTool('vid-9', 'Fliki', 'https://fliki.ai', 'Video Generators', 'Turn text into videos with AI voices.', false, 12000),
  createTool('vid-10', 'Opus Clip', 'https://opus.pro', 'Video Generators', 'Repurpose long videos into shorts with AI.', false, 20000),
  createTool('vid-11', 'Wondershare Filmora', 'https://filmora.wondershare.com', 'Video Generators', 'Easy video editor with AI features.', true, 50000),
  createTool('vid-12', 'Luma Dream Machine', 'https://lumalabs.ai/dream-machine', 'Video Generators', 'High quality video generation from text and image.', false, 33000),

  // --- Developer Tools ---
  createTool('dev-1', 'GitHub Copilot', 'https://github.com/features/copilot', 'Developer Tools', 'Your AI pair programmer.', true, 180000, true),
  createTool('dev-2', 'Cursor', 'https://cursor.sh', 'Developer Tools', 'The AI-first code editor.', false, 60000, true),
  createTool('dev-3', 'Replit', 'https://replit.com', 'Developer Tools', 'Build software collaboratively with AI.', false, 75000),
  createTool('dev-4', 'Devin', 'https://cognition-labs.com', 'Developer Tools', 'The first fully autonomous AI software engineer.', true, 42000, true),
  createTool('dev-5', 'Tabnine', 'https://tabnine.com', 'Developer Tools', 'AI assistant for software developers.', false, 20000),
  createTool('dev-6', 'Codeium', 'https://codeium.com', 'Developer Tools', 'Free AI code completion.', false, 15000),
  createTool('dev-7', 'Amazon CodeWhisperer', 'https://aws.amazon.com/codewhisperer', 'Developer Tools', 'Build applications faster with AI.', false, 25000),
  createTool('dev-8', 'Blackbox', 'https://blackbox.ai', 'Developer Tools', 'AI coding assistant.', false, 10000),
  createTool('dev-9', 'Warp', 'https://warp.dev', 'Developer Tools', 'The terminal for the 21st century with AI.', false, 12000),
  createTool('dev-10', 'Hugging Face', 'https://huggingface.co', 'Developer Tools', 'The AI community building the future.', false, 200000, true),
  createTool('dev-11', 'V0', 'https://v0.dev', 'No Code / Low Code', 'Generate UI with simple text prompts by Vercel.', false, 18000),
  createTool('dev-12', 'Lovable', 'https://lovable.dev', 'No Code / Low Code', 'Full stack app generation.', true, 5000),

  // --- Audio / Text to Speech ---
  createTool('aud-1', 'ElevenLabs', 'https://elevenlabs.io', 'Text to Speech', 'The most realistic AI text-to-speech and voice cloning.', false, 90000, true),
  createTool('aud-2', 'Suno', 'https://suno.ai', 'Audio Editing', 'Make a song about anything in seconds.', false, 65000, true),
  createTool('aud-3', 'Udio', 'https://udio.com', 'Audio Editing', 'Create music with AI.', false, 45000),
  createTool('aud-4', 'Murf AI', 'https://murf.ai', 'Text to Speech', 'Go from text to speech with a versatile AI voice generator.', true, 20000),
  createTool('aud-5', 'Lovo', 'https://lovo.ai', 'Text to Speech', 'AI Voice Generator and Text to Speech.', true, 15000),
  createTool('aud-6', 'Speechify', 'https://speechify.com', 'Text to Speech', 'The #1 text to speech reader.', false, 80000),
  createTool('aud-7', 'Play.ht', 'https://play.ht', 'Text to Speech', 'AI Voice Generator.', false, 12000),
  createTool('aud-8', 'Soundraw', 'https://soundraw.io', 'Audio Editing', 'AI music generator for creators.', true, 10000),
  createTool('aud-9', 'Riffusion', 'https://riffusion.com', 'Audio Editing', 'Generate music from text.', false, 8000),
  createTool('aud-10', 'Voice.ai', 'https://voice.ai', 'Voice Cloning', 'Real-time voice changer.', false, 25000),

  // --- Productivity ---
  createTool('prod-1', 'Notion AI', 'https://notion.so', 'Productivity', 'Access the limitless power of AI, right inside Notion.', false, 190000, true),
  createTool('prod-2', 'Otter.ai', 'https://otter.ai', 'Productivity', 'AI meeting notes and real-time transcription.', false, 85000),
  createTool('prod-3', 'Zapier', 'https://zapier.com', 'Productivity', 'Automate your workflow with AI integrations.', false, 120000),
  createTool('prod-4', 'Fireflies.ai', 'https://fireflies.ai', 'Productivity', 'Automate your meeting notes.', false, 30000),
  createTool('prod-5', 'Mem', 'https://mem.ai', 'Productivity', 'The self-organizing workspace.', false, 15000),
  createTool('prod-6', 'Rewind', 'https://rewind.ai', 'Productivity', 'Truly personalized AI for your Mac.', true, 22000),
  createTool('prod-7', 'Taskade', 'https://taskade.com', 'Productivity', 'AI-powered productivity.', false, 18000),
  createTool('prod-8', 'ClickUp', 'https://clickup.com', 'Productivity', 'One app to replace them all, with AI.', false, 95000),
  createTool('prod-9', 'Todoist', 'https://todoist.com', 'Productivity', 'Organize your work and life with AI features.', false, 110000),
  createTool('prod-10', 'Superhuman', 'https://superhuman.com', 'E-mail', 'The fastest email experience ever made.', true, 25000),
  createTool('prod-11', 'SaneBox', 'https://sanebox.com', 'E-mail', 'AI email management.', true, 12000),

  // --- Marketing & Sales ---
  createTool('mkt-1', 'AdCreative.ai', 'https://adcreative.ai', 'Marketing', 'Generate conversion-focused ad creatives.', true, 25000),
  createTool('mkt-2', 'HubSpot', 'https://hubspot.com', 'Marketing', 'AI tools for customer relationship management.', true, 155000, true),
  createTool('mkt-3', 'Salesforce Einstein', 'https://salesforce.com', 'Sales & Conversion', 'AI for CRM.', true, 200000, true),
  createTool('mkt-4', 'Mailchimp', 'https://mailchimp.com', 'Marketing', 'Email marketing & automation with AI.', false, 180000),
  createTool('mkt-5', 'Hootsuite', 'https://hootsuite.com', 'Social Networks', 'Social media management with AI writing.', true, 140000),
  createTool('mkt-6', 'Gong', 'https://gong.io', 'Sales & Conversion', 'Revenue intelligence platform.', true, 15000),
  createTool('mkt-7', 'Apollo.io', 'https://apollo.io', 'Sales & Conversion', 'Find and close your next deal.', false, 30000),
  createTool('mkt-8', 'Lavender', 'https://lavender.ai', 'E-mail', 'The AI email sales coach.', true, 8000),
  createTool('mkt-9', 'Ocoya', 'https://ocoya.com', 'Social Networks', 'Content marketing automation.', false, 5000),
  createTool('mkt-10', 'Predis.ai', 'https://predis.ai', 'Social Networks', 'AI social media post generator.', false, 6000),

  // --- Education & Research ---
  createTool('edu-1', 'Khanmigo', 'https://khanacademy.org', 'Education / Studies', 'AI-powered tutor and teaching assistant.', true, 50000),
  createTool('edu-2', 'Quizlet', 'https://quizlet.com', 'Education / Studies', 'AI-powered flashcards and study tools.', false, 140000, true),
  createTool('edu-3', 'Duolingo', 'https://duolingo.com', 'Education / Studies', 'Learn languages with AI.', false, 300000, true),
  createTool('edu-4', 'Consensus', 'https://consensus.app', 'Research & Science', 'AI search engine for research papers.', false, 18000),
  createTool('edu-5', 'Elicit', 'https://elicit.org', 'Research & Science', 'Analyze research papers at superhuman speed.', false, 16000),
  createTool('edu-6', 'Scite', 'https://scite.ai', 'Research & Science', 'AI for scientific research.', true, 9000),
  createTool('edu-7', 'Scholarcy', 'https://scholarcy.com', 'Research & Science', 'The AI article summarizer.', false, 7000),
  createTool('edu-8', 'Photomath', 'https://photomath.com', 'Education / Studies', 'Camera calculator.', false, 85000),
  createTool('edu-9', 'Brainly', 'https://brainly.com', 'Education / Studies', 'Homework help.', false, 60000),

  // --- Design & 3D ---
  createTool('des-1', 'Canva', 'https://canva.com', 'Logo Creation', 'Design with Magic Studio AI.', false, 400000, true),
  createTool('des-2', 'Looka', 'https://looka.com', 'Logo Creation', 'Design your own beautiful brand.', true, 25000),
  createTool('des-3', 'Luma AI', 'https://lumalabs.ai', '3D Model', 'Capture the world in lifelike 3D.', false, 35000),
  createTool('des-4', 'Spline', 'https://spline.design', '3D Model', '3D design tool with AI features.', false, 22000),
  createTool('des-5', 'Meshy', 'https://meshy.ai', '3D Model', '3D AI generator.', false, 8000),
  createTool('des-6', 'Ponzu', 'https://ponzu.gg', '3D Model', 'AI texture generator.', false, 3000),
  createTool('des-7', 'Khroma', 'https://khroma.co', 'Logo Creation', 'The AI color tool for designers.', false, 12000),
  createTool('des-8', 'Uizard', 'https://uizard.io', 'No Code / Low Code', 'Design wireframes with AI.', false, 15000),

  // --- Finance, Legal, HR ---
  createTool('fin-1', 'Cleo', 'https://meetcleo.com', 'Finance', 'AI assistant for your money.', false, 42000),
  createTool('fin-2', 'Rocket Money', 'https://rocketmoney.com', 'Finance', 'Manage subscriptions.', false, 85000),
  createTool('fin-3', 'Harvey', 'https://harvey.ai', 'Legal Assistants', 'Unprecedented legal AI.', true, 8000),
  createTool('fin-4', 'Casetext', 'https://casetext.com', 'Legal Assistants', 'AI legal research.', true, 5000),
  createTool('fin-5', 'DoNotPay', 'https://donotpay.com', 'Legal Assistants', 'The world\'s first robot lawyer.', true, 35000),
  createTool('hr-1', 'Paradox', 'https://paradox.ai', 'Human Resources', 'Conversational recruiting software.', true, 4000),
  createTool('hr-2', 'Textio', 'https://textio.com', 'Human Resources', 'Interrupt bias in performance reviews.', true, 6000),
  createTool('est-1', 'Zillow', 'https://zillow.com', 'Real Estate / Architecture', 'AI home value estimation.', false, 250000),
  createTool('est-2', 'Interior AI', 'https://interiorai.com', 'Real Estate / Architecture', 'Interior design mockups.', false, 12000),

  // --- Healthcare & Life ---
  createTool('med-1', 'Glass Health', 'https://glass.health', 'Healthcare', 'AI for clinical decision support.', true, 5000),
  createTool('med-2', 'Woebot', 'https://woebothealth.com', 'Healthcare', 'Your mental health ally.', false, 15000),
  createTool('life-1', 'Character.ai', 'https://character.ai', 'ChatBots', 'Chat with open-ended AI characters.', false, 320000, true),
  createTool('life-2', 'Replika', 'https://replika.com', 'Dating & Relationships', 'The AI companion who cares.', false, 60000),
  createTool('life-3', 'Tripnotes', 'https://tripnotes.ai', 'Travel', 'AI travel planner.', false, 8000),
  createTool('life-4', 'Roam Around', 'https://roamaround.io', 'Travel', 'Plan your trip with AI.', false, 5000),
  createTool('life-5', 'Kayak', 'https://kayak.com', 'Travel', 'Travel search with AI plugins.', false, 180000),

  // --- Presentation ---
  createTool('pres-1', 'Gamma', 'https://gamma.app', 'Presentation', 'A new medium for presenting ideas, powered by AI.', false, 45000, true),
  createTool('pres-2', 'Beautiful.ai', 'https://beautiful.ai', 'Presentation', 'Presentation software that designs for you.', true, 22000),
  createTool('pres-3', 'Tome', 'https://tome.app', 'Presentation', 'AI-powered storytelling format.', false, 38000),
  createTool('pres-4', 'SlidesAI', 'https://slidesai.io', 'Presentation', 'Text to presentation.', false, 15000),

  // --- Translation & Search ---
  createTool('trans-1', 'DeepL', 'https://deepl.com', 'Translation', 'The world\'s most accurate translator.', false, 185000, true),
  createTool('search-1', 'Google Search', 'https://google.com', 'Search Engine', 'AI Overviews in Search.', false, 999999, true),
  createTool('search-2', 'Consensus', 'https://consensus.app', 'Search Engine', 'Scientific search.', false, 12000),
  createTool('search-3', 'Phind', 'https://phind.com', 'Search Engine', 'AI search for developers.', false, 25000),

  // --- Other ---
  createTool('misc-1', 'Roblox', 'https://roblox.com', 'Gaming', 'AI generative creation tools.', false, 500000),
  createTool('misc-2', 'Unity Muse', 'https://unity.com', 'Gaming', 'AI tools for game dev.', true, 80000),
  createTool('misc-3', 'Scenario', 'https://scenario.com', 'Gaming', 'AI game assets.', false, 7000),
  createTool('misc-4', 'Synthesys', 'https://synthesys.io', 'Avatars', 'AI virtual avatars.', true, 4000),
  createTool('misc-5', 'Copyleaks', 'https://copyleaks.com', 'AI detection', 'Detect AI generated content.', false, 18000),
  createTool('misc-6', 'GPTZero', 'https://gptzero.me', 'AI detection', 'Standard for AI detection.', false, 35000),
  createTool('misc-7', 'Originality.ai', 'https://originality.ai', 'AI detection', 'AI content detector.', true, 12000),
  createTool('misc-8', 'Shopify Magic', 'https://shopify.com', 'E-commerce', 'AI for commerce.', true, 220000),
  createTool('misc-9', 'Tidio', 'https://tidio.com', 'Customer Support', 'AI chatbots for business.', false, 25000),
  createTool('misc-10', 'Intercom', 'https://intercom.com', 'Customer Support', 'Fin AI agent.', true, 45000),
  createTool('misc-11', 'Zendesk', 'https://zendesk.com', 'Customer Support', 'AI customer service.', true, 80000)
];

const INITIAL_PROMPTS: Prompt[] = [
   {
    id: 'img-1',
    title: 'Ultra-Realistic Fantasy Character',
    description: 'Generate a highly detailed fantasy warrior portrait with cinematic lighting.',
    content: 'Create an ultra-realistic portrait of a fantasy warrior with glowing eyes, cinematic lighting, 8k detail, sharp texture, dramatic shadows, high-end photography style.',
    category: 'Image Generation',
    tags: ['Fantasy', 'Portrait', 'Realistic', 'Character Design'],
    views: 12500,
    likes: 843,
    author: { name: 'ArtMaster', avatar: 'https://i.pravatar.cc/150?u=art', handle: '@artmaster' },
    model: 'NanoBanana',
    tool: 'NanoBanana AI',
    images: ['https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=600&auto=format&fit=crop'], 
    difficulty: 'Intermediate',
    status: 'Published',
    date: '1 day ago'
  },
  {
    id: 'wri-1',
    title: 'SEO Optimized Blog Post',
    description: 'Create a comprehensive blog post structure for ranking on Google.',
    content: 'Write a comprehensive, SEO-optimized blog post about "The Future of AI in Healthcare". Include H2s, H3s, bullet points, and a FAQ section. Target keywords: AI diagnostics, machine learning in medicine.',
    category: 'Writing',
    tags: ['SEO', 'Blog', 'Marketing', 'Business'],
    views: 8200,
    likes: 540,
    author: { name: 'SEOGuru', avatar: 'https://i.pravatar.cc/150?u=seo', handle: '@seoguru' },
    model: 'GPT-4',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
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
    },
    // ... other videos kept same for brevity if needed ...
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

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem('trendhub_tools_v1', JSON.stringify(tools));
    } catch (e) { console.error("Storage full or error saving tools", e); }
  }, [tools]);

  useEffect(() => {
    try {
      window.localStorage.setItem('trendhub_prompts_v1', JSON.stringify(prompts));
    } catch (e) { console.error("Storage full or error saving prompts", e); }
  }, [prompts]);

  useEffect(() => {
    try {
      window.localStorage.setItem('trendhub_videos_v1', JSON.stringify(videos));
    } catch (e) { console.error("Storage full or error saving videos", e); }
  }, [videos]);


  const addTool = (tool: Tool) => {
    setTools(prev => {
        // Prevent duplicates by ID
        if (prev.some(t => t.id === tool.id)) return prev;
        return [tool, ...prev];
    });
  };

  const addTools = (newTools: Tool[]) => {
    setTools(prev => {
        // Filter out any tools that already exist in the previous state by ID
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

  return (
    <DataContext.Provider value={{ tools, prompts, videos, addTool, addTools, updateTool, addPrompt, deleteTool, deletePrompt, addVideo, deleteVideo }}>
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
