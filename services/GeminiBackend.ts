
import { GoogleGenAI } from "@google/genai";
import { Tool, Video } from "../types";

// Explicitly use the provided API Key
const API_KEY = 'AIzaSyAUJwf-BEBOLdwV1V6wDAKl53FSy9kR4E4';
const N8N_WEBHOOK_URL = 'https://udx3-12.app.n8n.cloud/webhook-test/ai-sync';

// Initialize Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- FALLBACK DATA (Offline Mode / Quota Exceeded) ---
const FALLBACK_TRENDING: Tool[] = [
    { id: 'fb-1', name: 'Sora (OpenAI)', url: 'openai.com/sora', category: 'Video Generators', rating: 4.9, reviews: 15000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', shortDescription: 'Create realistic and imaginative scenes from text instructions.', verified: true, trendScore: 99, publishedDate: '24h ago' },
    { id: 'fb-2', name: 'Claude 3.5 Sonnet', url: 'anthropic.com', category: 'AI Chat & Assistant', rating: 4.8, reviews: 12000, isPaid: false, pricingModel: 'Freemium', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128', shortDescription: 'Anthropic\'s most intelligent model to date.', verified: true, trendScore: 97, publishedDate: '2 days ago' },
    { id: 'fb-3', name: 'Gemini 1.5 Pro', url: 'deepmind.google', category: 'AI Chat & Assistant', rating: 4.7, reviews: 18000, isPaid: false, pricingModel: 'Free', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=google.com&sz=128', shortDescription: 'Google\'s largest and most capable AI model.', verified: true, trendScore: 95, publishedDate: '1 week ago' },
    { id: 'fb-4', name: 'Midjourney v6', url: 'midjourney.com', category: 'Image Generators', rating: 4.9, reviews: 25000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128', shortDescription: 'The gold standard for AI image generation.', verified: true, trendScore: 94, publishedDate: '3 days ago' },
    { id: 'fb-5', name: 'Suno AI', url: 'suno.ai', category: 'Audio Editing', rating: 4.8, reviews: 8000, isPaid: false, pricingModel: 'Freemium', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=suno.ai&sz=128', shortDescription: 'Make a song about anything in seconds.', verified: true, trendScore: 92, publishedDate: '12h ago' },
    { id: 'fb-6', name: 'Devin', url: 'cognition-labs.com', category: 'Developer Tools', rating: 4.6, reviews: 5000, isPaid: true, pricingModel: 'Contact for Pricing', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=cognition-labs.com&sz=128', shortDescription: 'The first fully autonomous AI software engineer.', verified: false, trendScore: 89, publishedDate: 'Just now' }
];

const FALLBACK_LATEST: Tool[] = [
    { id: 'fb-new-1', name: 'Grok 1.5', url: 'x.ai', category: 'AI Chat & Assistant', rating: 4.5, reviews: 2000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=x.ai&sz=128', shortDescription: 'Enhanced reasoning capabilities and context length.', verified: true, trendScore: 85, publishedDate: 'Just Released' },
    { id: 'fb-new-2', name: 'Stable Audio 2.0', url: 'stability.ai', category: 'Audio Editing', rating: 4.4, reviews: 1500, isPaid: false, pricingModel: 'Free', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128', shortDescription: 'Generate full tracks with coherent musical structure.', verified: true, trendScore: 82, publishedDate: 'Yesterday' },
    { id: 'fb-new-3', name: 'Adobe Firefly 3', url: 'firefly.adobe.com', category: 'Image Generators', rating: 4.7, reviews: 3000, isPaid: false, pricingModel: 'Freemium', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128', shortDescription: 'Photorealistic quality and new styling capabilities.', verified: true, trendScore: 80, publishedDate: '2 days ago' },
    { id: 'fb-new-4', name: 'Udio', url: 'udio.com', category: 'Audio Editing', rating: 4.8, reviews: 4000, isPaid: false, pricingModel: 'Free', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=udio.com&sz=128', shortDescription: 'Music generation with high fidelity vocals.', verified: false, trendScore: 78, publishedDate: '3 days ago' }
];

const FALLBACK_VIDEOS: Video[] = [
    { id: 'fb-vid-1', videoId: 'jC4v5AS4RIM', title: 'OpenAI Sora: First Impressions', thumbnail: 'https://img.youtube.com/vi/jC4v5AS4RIM/mqdefault.jpg', channelName: 'MKBHD', channelAvatar: '', views: '2.1M', duration: '12:00', publishedAt: '2 days ago', category: 'News' },
    { id: 'fb-vid-2', videoId: 'SqI3fC8a1aI', title: 'How to Build an AI App', thumbnail: 'https://img.youtube.com/vi/SqI3fC8a1aI/mqdefault.jpg', channelName: 'Fireship', channelAvatar: '', views: '500K', duration: '8:45', publishedAt: '1 week ago', category: 'Coding' },
    { id: 'fb-vid-3', videoId: '1O5_y6i3Dq4', title: 'Gemini 1.5 Pro Explained', thumbnail: 'https://img.youtube.com/vi/1O5_y6i3Dq4/mqdefault.jpg', channelName: 'Google', channelAvatar: '', views: '1.2M', duration: '5:30', publishedAt: '3 days ago', category: 'LLMs' }
];

// --- CACHING SYSTEM (LocalStorage) ---
const CACHE_KEY_PREFIX = 'gemini_cache_';
const CACHE_TTL = 1000 * 60 * 60; // 1 Hour Cache

const getFromCache = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(CACHE_KEY_PREFIX + key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
            console.log(`[GeminiBackend] Serving ${key} from local storage cache`);
            return parsed.data as T;
        }
        return null;
    } catch (e) {
        return null;
    }
};

const setCache = (key: string, data: any) => {
    try {
        const cacheItem = { data, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheItem));
    } catch (e) {
        console.error("Cache storage error", e);
    }
};

// Helper: Call Google GenAI SDK
async function callGenAI(prompt: string, jsonMode: boolean = true): Promise<string> {
    try {
        const config: any = {};
        if (jsonMode) {
            config.responseMimeType = 'application/json';
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config
        });
        
        return response.text || (jsonMode ? "[]" : "");
    } catch (error: any) {
        console.warn("Gemini API Call Failed:", error.message || error);
        throw error;
    }
}

// Helper: Parse JSON
function parseAIJson(text: string): any {
    try {
        let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (e) {
        return [];
    }
}

export const GeminiBackend = {
  
  // N8N Integration
  async callN8N(action: string, params: any = {}): Promise<any> {
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...params })
        });
        
        if(!response.ok) {
            console.warn(`N8N Webhook returned status: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (e) {
        console.warn("N8N Connection Failed:", e);
        return null;
    }
  },

  async fetchTrendingTools(): Promise<Tool[]> {
    const cacheKey = 'trending_tools';
    const cached = getFromCache<Tool[]>(cacheKey);
    if (cached) return cached;

    // 1. Try N8N Sync First
    try {
        const n8nData = await this.callN8N('get_trending');
        // Accept array directly or object with 'tools' or 'data' property
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || n8nData?.data || []);
        
        if (Array.isArray(toolsData) && toolsData.length > 0) {
            const result = mapToToolInterface(toolsData, 'trend');
            setCache(cacheKey, result);
            return result;
        }
    } catch (err) {
        console.warn("Fallback to Gemini due to N8N error in trending");
    }

    // 2. Fallback to Gemini
    try {
      const prompt = `Act as an AI market analyst. List the top 12 trending AI tools popular in the last 24 hours.
      Return a STRICT JSON ARRAY.
      Each item must have: name, category, website_url, is_paid (boolean), trend_score_24h (number), published_date (string), description.`;
      
      const text = await callGenAI(prompt, true);
      const rawData = parseAIJson(text);
      const result = mapToToolInterface(Array.isArray(rawData) ? rawData : [], 'trend');
      
      if (result.length > 0) setCache(cacheKey, result);
      return result.length > 0 ? result : FALLBACK_TRENDING;
    } catch (error) {
      return FALLBACK_TRENDING;
    }
  },

  async fetchLatestTools(): Promise<Tool[]> {
    const cacheKey = 'latest_tools';
    const cached = getFromCache<Tool[]>(cacheKey);
    if (cached) return cached;

    // 1. Try N8N Sync First
    try {
        const n8nData = await this.callN8N('get_latest');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || n8nData?.data || []);

        if (Array.isArray(toolsData) && toolsData.length > 0) {
            const result = mapToToolInterface(toolsData, 'latest');
            setCache(cacheKey, result);
            return result;
        }
    } catch (err) {
        console.warn("Fallback to Gemini due to N8N error in latest");
    }

    // 2. Fallback to Gemini
    try {
      const prompt = `List 8 brand new AI tools released this week.
      Return a STRICT JSON ARRAY.
      Each item must have: name, category, website_url, is_paid (boolean), trend_score_24h (number), published_date (string), description.`;

      const text = await callGenAI(prompt, true);
      const rawData = parseAIJson(text);
      const result = mapToToolInterface(Array.isArray(rawData) ? rawData : [], 'latest');
      
      if (result.length > 0) setCache(cacheKey, result);
      return result.length > 0 ? result : FALLBACK_LATEST;
    } catch (error) {
      return FALLBACK_LATEST;
    }
  },

  async discoverTools(): Promise<Tool[]> {
     // 1. Try N8N Discovery
     try {
        const n8nData = await this.callN8N('discover_tools');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || []);
        
        if (Array.isArray(toolsData) && toolsData.length > 0) {
            return toolsData.map((t: any, index: number) => {
                const domain = (t.url || t.website_url || 'example.com').replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
                return {
                    id: `n8n-gen-${Date.now()}-${index}`,
                    name: t.name,
                    url: t.url || t.website_url || '',
                    category: t.category || 'Productivity',
                    shortDescription: t.shortDescription || t.description,
                    pricingModel: t.pricingModel || 'Freemium',
                    isPaid: t.is_paid || t.isPaid,
                    features: t.features || [],
                    rating: 0, reviews: 0, saves: 0, isActive: true, verified: false,
                    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
                    screenshots: ['https://picsum.photos/seed/screen/800/450']
                };
            });
        }
     } catch (e) {
         console.warn("N8N Discover failed, using Gemini");
     }

     // 2. Fallback to Gemini
     try {
        const prompt = `Generate a list of 5 popular AI tools. Return a STRICT JSON ARRAY. Item structure: {name, url, category, shortDescription, pricingModel, features[]}`;
        const text = await callGenAI(prompt, true);
        const rawData = parseAIJson(text);
        
        if (Array.isArray(rawData)) {
            return rawData.map((t: any, index: number) => {
                const domain = t.url ? t.url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0] : 'example.com';
                return {
                    id: `gen-${Date.now()}-${index}`,
                    name: t.name,
                    url: t.url || '',
                    category: t.category || 'Productivity',
                    shortDescription: t.shortDescription,
                    pricingModel: t.pricingModel || 'Freemium',
                    isPaid: t.pricingModel === 'Paid',
                    features: t.features || [],
                    rating: 0, reviews: 0, saves: 0, isActive: true, verified: false,
                    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
                    screenshots: ['https://picsum.photos/seed/screen/800/450']
                };
            });
        }
        return [];
     } catch (e) {
         return [];
     }
  },

  async enrichToolDetails(name: string, category: string, url: string): Promise<Partial<Tool>> {
      try {
          const prompt = `Generate profile for tool "${name}" (${category}). Return STRICT JSON: { "description": "...", "features": ["..."], "pricing": ["..."] }`;
          const text = await callGenAI(prompt, true);
          const data = parseAIJson(text);
          return { description: data.description, features: data.features || [], pricing: data.pricing || [] };
      } catch (error) {
          return {}; // Fail silently
      }
  },

  async findYoutubeId(query: string): Promise<string | null> {
    try {
      // Use Google Search Grounding to find the video ID if possible
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the specific YouTube video ID (11 characters) for the video: "${query}".
                   Return ONLY the ID string. If you cannot find it, return "null".`,
        config: { 
            tools: [{ googleSearch: {} }] 
        }
      });
      
      const text = response.text || "";
      const cleanText = text.trim();

      // Extract ID from response (it might come with text despite instruction)
      const idMatch = cleanText.match(/[a-zA-Z0-9_-]{11}/);
      if (idMatch) return idMatch[0];

      // Fallback: Check grounding metadata
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      for (const chunk of chunks) {
          if (chunk.web?.uri) {
              const url = chunk.web.uri;
              const vMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
              if (vMatch && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                  return vMatch[1];
              }
          }
      }
      return null;
    } catch (e) {
      console.error("Video ID search failed:", e);
      return null;
    }
  },

  async generateThumbnail(title: string): Promise<string | null> {
      return null;
  },

  async fetchVideoTutorials(): Promise<Video[]> {
    const cacheKey = 'video_tutorials';
    const cached = getFromCache<Video[]>(cacheKey);
    if (cached) return cached;

    try {
      const prompt = `List 8 highly educational AI tutorials from YouTube. 
      Return STRICT JSON ARRAY: { videoId (11-char), title, channelName, views, duration, publishedAt, category }`;
      
      const text = await callGenAI(prompt, true);
      const rawData = parseAIJson(text);
      
      if (!Array.isArray(rawData)) return FALLBACK_VIDEOS;

      const result = rawData.map((v: any, i: number) => ({
        id: `vid-${Date.now()}-${i}`,
        videoId: v.videoId || '', 
        title: v.title,
        thumbnail: v.videoId ? `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg` : `https://ui-avatars.com/api/?name=${encodeURIComponent(v.title)}&background=random`,
        channelName: v.channelName,
        channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(v.channelName)}&background=random`,
        views: v.views || 'Popular',
        duration: v.duration || '10:00',
        publishedAt: v.publishedAt || 'Recently',
        category: v.category || 'AI'
      }));

      if (result.length > 0) setCache(cacheKey, result);
      return result;
    } catch (error) {
      return FALLBACK_VIDEOS;
    }
  }
};

const mapToToolInterface = (data: any[], type: 'trend' | 'latest'): Tool[] => {
  return data.map((item, index) => {
    // Handle both snake_case (Gemini/Python style) and camelCase (JS style)
    const url = item.website_url || item.url || '';
    const domain = url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'example.com';
    const isPaid = item.is_paid !== undefined ? item.is_paid : item.isPaid;
    
    return {
      id: `${type}-${Date.now()}-${index}`,
      name: item.name,
      url: domain,
      category: item.category,
      rating: 4.5,
      reviews: item.trend_score_24h || item.reviews || 100,
      isPaid: !!isPaid,
      pricingModel: isPaid ? 'Paid' : 'Free',
      isActive: true,
      logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      shortDescription: item.description || item.shortDescription,
      verified: false,
      trendScore: item.trend_score_24h,
      publishedDate: item.published_date || item.publishedDate
    };
  });
};
