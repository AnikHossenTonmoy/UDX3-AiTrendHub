
import { GoogleGenAI } from "@google/genai";
import { Tool, Video } from "../types";

// Explicitly use the provided API Key
const API_KEY = 'AIzaSyAUJwf-BEBOLdwV1V6wDAKl53FSy9kR4E4';
const N8N_WEBHOOK_URL = 'https://udx3-12.app.n8n.cloud/webhook-test/ai-sync';

// Initialize Client (Default instance)
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- FALLBACK DATA (Offline Mode / Quota Exceeded) ---
const FALLBACK_TRENDING: Tool[] = [
    { id: 'fb-1', name: 'Sora (OpenAI)', url: 'openai.com/sora', category: 'Video Generators', rating: 4.9, reviews: 15000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', shortDescription: 'Create realistic and imaginative scenes from text instructions.', verified: true, trendScore: 99, publishedDate: '24h ago' },
    // ... kept simplified for brevity
];

const FALLBACK_LATEST: Tool[] = [
     { id: 'fb-new-1', name: 'Grok 1.5', url: 'x.ai', category: 'AI Chat & Assistant', rating: 4.5, reviews: 2000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=x.ai&sz=128', shortDescription: 'Enhanced reasoning capabilities and context length.', verified: true, trendScore: 85, publishedDate: 'Just Released' },
];

const FALLBACK_VIDEOS: Video[] = [
    { id: 'fb-vid-1', videoId: 'jC4v5AS4RIM', title: 'OpenAI Sora: First Impressions', thumbnail: 'https://img.youtube.com/vi/jC4v5AS4RIM/mqdefault.jpg', channelName: 'MKBHD', channelAvatar: '', views: '2.1M', duration: '12:00', publishedAt: '2 days ago', category: 'News' },
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
  
  // --- N8N Integration ---
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

    try {
        const n8nData = await this.callN8N('get_trending');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || n8nData?.data || []);
        
        if (Array.isArray(toolsData) && toolsData.length > 0) {
            const result = mapToToolInterface(toolsData, 'trend');
            setCache(cacheKey, result);
            return result;
        }
    } catch (err) {
        console.warn("Fallback to Gemini due to N8N error in trending");
    }

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
     try {
        const n8nData = await this.callN8N('discover_tools');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || []);
        if (Array.isArray(toolsData) && toolsData.length > 0) {
             return mapToToolInterface(toolsData, 'n8n-disc');
        }
     } catch (e) {}

     try {
        const prompt = `Generate a list of 5 popular AI tools. Return a STRICT JSON ARRAY. Item structure: {name, url, category, shortDescription, pricingModel, features[]}`;
        const text = await callGenAI(prompt, true);
        const rawData = parseAIJson(text);
        if (Array.isArray(rawData)) {
             return mapToToolInterface(rawData, 'gen-disc');
        }
        return [];
     } catch (e) { return []; }
  },

  async enrichToolDetails(name: string, category: string, url: string): Promise<Partial<Tool>> {
      try {
          // Updated prompt to request structured pricing plans
          const prompt = `Generate a detailed profile for the AI tool "${name}" (${category}, URL: ${url}). 
          Return a STRICT JSON object with these keys:
          - description: A compelling summary.
          - features: Array of key features strings.
          - pricingModel: "Free", "Freemium", "Paid", or "Contact for Pricing".
          - plans: Array of objects, each with { "name": string, "price": string (e.g. "0", "20", "Contact"), "billing": string (e.g. "monthly", "forever"), "features": string[] }.
          
          Do NOT guess prices if unknown, use "Contact" as price.
          Example Plan: { "name": "Pro", "price": "19", "billing": "monthly", "features": ["Feature A"] }`;

          const text = await callGenAI(prompt, true);
          const data = parseAIJson(text);
          return { 
              description: data.description, 
              features: data.features || [], 
              pricingModel: data.pricingModel || 'Freemium',
              plans: data.plans || [],
              lastVerified: new Date().toISOString()
          };
      } catch (error) {
          return {}; // Fail silently
      }
  },

  async findYoutubeId(query: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the specific YouTube video ID (11 characters) for the video: "${query}". Return ONLY the ID string. If you cannot find it, return "null".`,
        config: { tools: [{ googleSearch: {} }] }
      });
      const text = response.text || "";
      const cleanText = text.trim();
      const idMatch = cleanText.match(/[a-zA-Z0-9_-]{11}/);
      if (idMatch) return idMatch[0];
      return null;
    } catch (e) {
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
      const prompt = `List 8 highly educational AI tutorials from YouTube. Return STRICT JSON ARRAY: { videoId (11-char), title, channelName, views, duration, publishedAt, category }`;
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
  },

  // --- STUDIO FEATURES ---

  async generateImage(prompt: string, size: '1K' | '2K' | '4K', aspectRatio: string): Promise<string | null> {
      try {
          const currentKey = process.env.API_KEY || API_KEY;
          const freshAi = new GoogleGenAI({ apiKey: currentKey });
          const response = await freshAi.models.generateContent({
              model: 'gemini-3-pro-image-preview',
              contents: { parts: [{ text: prompt }] },
              config: { imageConfig: { imageSize: size, aspectRatio: aspectRatio } }
          });
          for (const part of response.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
          }
          return null;
      } catch (e) { throw e; }
  },

  async *chatStream(history: any[], message: string, model: string) {
      const currentKey = process.env.API_KEY || API_KEY;
      const freshAi = new GoogleGenAI({ apiKey: currentKey });
      const chat = freshAi.chats.create({ model: model, history: history });
      const result = await chat.sendMessageStream({ message: message });
      for await (const chunk of result) { yield chunk.text; }
  }
};

const mapToToolInterface = (data: any[], prefix: string): Tool[] => {
  return data.map((item, index) => {
    const url = item.website_url || item.url || '';
    const domain = url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'example.com';
    const isPaid = item.is_paid !== undefined ? item.is_paid : item.isPaid;
    
    return {
      id: `${prefix}-${item.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`, // Consistent ID generation attempt
      name: item.name,
      url: domain,
      category: item.category,
      rating: 4.5,
      reviews: item.trend_score_24h || item.reviews || 100,
      isPaid: !!isPaid,
      pricingModel: item.pricingModel || (isPaid ? 'Paid' : 'Free'),
      isActive: true,
      logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      shortDescription: item.description || item.shortDescription,
      verified: false,
      trendScore: item.trend_score_24h,
      publishedDate: item.published_date || item.publishedDate,
      plans: item.plans || [] // Map plans if available
    };
  });
};