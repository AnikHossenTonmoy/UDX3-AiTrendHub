
import { GoogleGenAI } from "@google/genai";
import { Tool, Video } from "../types";

// --- API KEY ROTATION SYSTEM ---
// The user provided keys for trial rotation. In production, load these from process.env.GEMINI_KEYS (comma separated)
const PROVIDED_KEYS = [
  'AIzaSyBpQJQEHPappArpBa0Kg9kDmxX_3v7915g',
  'AIzaSyBKtzK36jvaIZxOhE3SCUVbWO0i68Xkoi4',
  'AIzaSyCm5oOKdlFseu5v08QTJbc_TEiy71jqDZ0',
  'AIzaSyDBc4Lqfij5g7N44GNQJWtosz-w__RJXHE',
  'AIzaSyDoOARrDUKWXVujjzBQzLV8Hh87Zzm4E3Q'
];

// Combine env var keys with provided keys
const getApiKeyPool = () => {
    const envKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];
    const primaryKey = process.env.API_KEY ? [process.env.API_KEY] : [];
    // Deduplicate and filter empty
    const allKeys = [...new Set([...primaryKey, ...envKeys, ...PROVIDED_KEYS])].filter(k => k && k.trim().length > 0);
    return allKeys;
};

const API_KEY_POOL = getApiKeyPool();
let currentKeyIndex = 0;

const getActiveKey = () => API_KEY_POOL[currentKeyIndex];

const rotateKey = () => {
    const prevIndex = currentKeyIndex;
    currentKeyIndex = (currentKeyIndex + 1) % API_KEY_POOL.length;
    console.warn(`[GeminiBackend] Rotating API Key: ${prevIndex} -> ${currentKeyIndex}`);
};

// Wrapper to execute operations with automatic key rotation on failure
async function executeWithRotation<T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    let attempts = 0;
    const maxAttempts = API_KEY_POOL.length; // Try every key once

    while (attempts < maxAttempts) {
        try {
            const apiKey = getActiveKey();
            const client = new GoogleGenAI({ apiKey });
            return await operation(client);
        } catch (error: any) {
            const status = error.status || error.response?.status;
            const msg = (error.message || '').toLowerCase();
            
            // Check for rotation triggers: 
            // 429 (Quota)
            // 401/403 (Auth/Permission)
            // 404 (Not Found - often means model not available for this specific API key/project tier)
            const isQuota = status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('too many requests');
            const isAuth = status === 401 || status === 403 || msg.includes('key not valid') || msg.includes('unauthorized') || msg.includes('permission_denied') || msg.includes('permission denied');
            const isNotFound = status === 404 || msg.includes('not_found') || msg.includes('not found');

            if (isQuota || isAuth || isNotFound) {
                console.warn(`[GeminiBackend] Error (Status: ${status}). Retrying with next key...`);
                rotateKey();
                attempts++;
            } else {
                // If it's a logic error (400) or server error (500), throw immediately unless we want to retry 500s too.
                console.error("[GeminiBackend] Non-rotatable error:", error);
                throw error;
            }
        }
    }
    throw new Error("All Gemini API keys in the rotation pool have been exhausted. Please check your quota, API permissions, or model availability.");
}

const N8N_WEBHOOK_URL = 'https://udx3-12.app.n8n.cloud/webhook-test/ai-sync';

// --- FALLBACK DATA (Offline Mode / Quota Exceeded) ---
const FALLBACK_TRENDING: Tool[] = [
    { id: 'fb-1', name: 'Sora (OpenAI)', url: 'openai.com/sora', category: 'Video Generators', rating: 4.9, reviews: 15000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', shortDescription: 'Create realistic and imaginative scenes from text instructions.', verified: true, trendScore: 99, publishedDate: '24h ago' },
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

// Helper: Call Google GenAI SDK with Rotation
async function callGenAI(prompt: string, jsonMode: boolean = true): Promise<string> {
    return executeWithRotation(async (client) => {
        const config: any = {};
        if (jsonMode) {
            config.responseMimeType = 'application/json';
        }

        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash-exp', // Using 2.0 Flash Exp for robust text generation
            contents: prompt,
            config: config
        });
        
        return response.text || (jsonMode ? "[]" : "");
    });
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
        console.log(`[GeminiBackend] Invoking N8N Webhook (${action}) at: ${N8N_WEBHOOK_URL}`);
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
        console.log(`[GeminiBackend] N8N Response for ${action}:`, data);
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

  // --- NEW BULK IMPORT FEATURE ---
  async processBulkUrls(urls: string[], defaultCategory?: string): Promise<Tool[]> {
    // Process in chunks of 5 to avoid token limits and ensure higher accuracy
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < urls.length; i += chunkSize) {
        chunks.push(urls.slice(i, i + chunkSize));
    }

    let allTools: Tool[] = [];

    for (const chunk of chunks) {
        try {
            const prompt = `
            I have a list of AI Tool URLs. Please analyze them and return a JSON Array of tool objects.
            URLs: ${chunk.join(', ')}
            
            Instructions:
            1. Extract the tool name from the URL or known brand.
            2. ${defaultCategory ? `Use category: "${defaultCategory}"` : 'Guess the best category (e.g., Image Generators, Writing, Video, etc).'}
            3. Write a short, punchy 1-sentence description.
            4. Guess if it is Paid/Free/Freemium.

            Format for each object:
            {
                "name": "Official Name",
                "website_url": "Clean domain (e.g. midjourney.com)",
                "category": "Category Name",
                "description": "Short description",
                "is_paid": boolean,
                "pricingModel": "Free" | "Freemium" | "Paid"
            }
            Return STRICT JSON. No markdown.
            `;
            
            const text = await callGenAI(prompt, true);
            const data = parseAIJson(text);
            
            if (Array.isArray(data)) {
                const processed = mapToToolInterface(data, 'bulk-import');
                allTools = [...allTools, ...processed];
            }
        } catch (e) {
            console.error("Bulk chunk failed", e);
            // On failure, attempt to create basic entries from URLs
            const fallbackTools = chunk.map(url => {
                 const domain = url.replace(/^https?:\/\//, '').split('/')[0];
                 return {
                    id: `bulk-fail-${Date.now()}-${Math.random()}`,
                    name: domain,
                    url: domain,
                    category: defaultCategory || 'Uncategorized',
                    rating: 0,
                    reviews: 0,
                    isPaid: false,
                    pricingModel: 'Freemium' as const, // Cast to literal type
                    isActive: true,
                    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
                    shortDescription: 'Imported via Bulk Tool',
                    description: 'Imported via Bulk Tool',
                    features: [],
                    pricing: [],
                    plans: [],
                    verified: false
                 } as Tool;
            });
            allTools = [...allTools, ...fallbackTools];
        }
    }
    return allTools;
  },

  async enrichToolDetails(name: string, category: string, url: string): Promise<Partial<Tool>> {
      try {
          const prompt = `Generate a detailed profile for the AI tool "${name}" (${category}, URL: ${url}). 
          Return a STRICT JSON object with these keys:
          - description: A compelling summary.
          - features: Array of key features strings.
          - pricingModel: "Free", "Freemium", "Paid", or "Contact for Pricing".
          - plans: Array of objects, each with { "name": string, "price": string (e.g. "0", "20", "Contact"), "billing": string (e.g. "monthly", "forever"), "features": string[] }.
          
          Do NOT guess prices if unknown, use "Contact" as price.`;

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
          return {}; 
      }
  },

  // --- NEW: Generate Raw Text for Prompt Generator ---
  async generateRawText(prompt: string): Promise<string> {
      try {
          return await callGenAI(prompt, false); // false for no strict JSON enforcement
      } catch (e) {
          console.error("Text Generation Failed", e);
          return "Failed to generate text. Please try again.";
      }
  },

  async findYoutubeId(query: string): Promise<string | null> {
    return executeWithRotation(async (client) => {
        try {
            const response = await client.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: `Find the specific YouTube video ID (11 characters) for the video: "${query}". Return ONLY the ID string. If you cannot find it, return "null".`,
                config: { tools: [{ googleSearch: {} }] }
            });
            const text = response.text || "";
            const cleanText = text.trim();
            const idMatch = cleanText.match(/[a-zA-Z0-9_-]{11}/);
            if (idMatch) return idMatch[0];
            return null;
        } catch (e) {
            // Let the rotation logic handle auth/quota errors, but return null for logic errors
            throw e;
        }
    }).catch(() => null);
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
      return executeWithRotation(async (client) => {
          try {
              // Revert to gemini-2.5-flash-image via generateContent as requested by system specs.
              // Note: This model is for image generation but uses generateContent structure.
              const response = await client.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [{ text: prompt }] },
                  config: {
                      imageConfig: {
                          aspectRatio: aspectRatio,
                          // imageSize not widely supported for flash-image, defaulting to 1K
                      }
                  }
              });
              
              // Extract inline image
              for (const part of response.candidates?.[0]?.content?.parts || []) {
                  if (part.inlineData) {
                      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                  }
              }
              return null;
          } catch (e) {
              console.error("Gemini Image Generation Error:", e);
              throw e; 
          }
      });
  },

  // --- NEW: Logo Editing Feature ---
  async editImage(imageBase64: string, prompt: string): Promise<string | null> {
      return executeWithRotation(async (client) => {
          try {
              // Robustly separate Data URI header from base64 data
              let mimeType = 'image/png'; // Default
              let data = imageBase64;

              // Check if it has a data URI prefix and strip it
              if (imageBase64.includes('data:') && imageBase64.includes(';base64,')) {
                  const parts = imageBase64.split(';base64,');
                  if (parts.length === 2) {
                      // Attempt to extract real mime from header e.g. "data:image/jpeg"
                      const prefix = parts[0];
                      const typeMatch = prefix.match(/data:(.*)/);
                      if (typeMatch && typeMatch[1]) {
                          mimeType = typeMatch[1];
                      }
                      data = parts[1]; // The raw base64 string
                  }
              }

              // Ensure mimeType is supported by Gemini (jpeg, png, webp, heic, heif)
              // If it's something else like 'image/svg+xml', Gemini might reject it.
              const validMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
              if (!validMimes.includes(mimeType)) {
                  console.warn(`[GeminiBackend] Unsupported MIME type ${mimeType} for editImage. Defaulting to image/png.`);
                  mimeType = 'image/png';
              }

              const response = await client.models.generateContent({
                  model: 'gemini-2.5-flash-image', // Good for editing/variations
                  contents: {
                      parts: [
                          {
                              inlineData: {
                                  mimeType: mimeType,
                                  data: data
                              }
                          },
                          {
                              text: prompt
                          }
                      ]
                  }
              });

              for (const part of response.candidates?.[0]?.content?.parts || []) {
                  if (part.inlineData) {
                      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                  }
              }
              return null;
          } catch (e) {
              console.error("Gemini Image Edit Error:", e);
              throw e;
          }
      });
  },

  async *chatStream(history: any[], message: string, model: string) {
      // Manual Rotation Logic for Streams since we need to yield
      let attempts = 0;
      const maxAttempts = API_KEY_POOL.length;

      // Use a safer model if the requested one is known to cause issues
      const safeModel = model.includes('gemini-3') ? 'gemini-2.0-flash-exp' : model;

      while (attempts < maxAttempts) {
          try {
              const apiKey = getActiveKey();
              const client = new GoogleGenAI({ apiKey });
              const chat = client.chats.create({ model: safeModel, history: history });
              const result = await chat.sendMessageStream({ message: message });
              
              for await (const chunk of result) { 
                  yield chunk.text; 
              }
              return; // Success, exit loop
          } catch (error: any) {
              const status = error.status || error.response?.status;
              const msg = (error.message || '').toLowerCase();
              const isQuota = status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('too many requests');
              const isAuth = status === 401 || status === 403 || msg.includes('key not valid') || msg.includes('permission_denied') || msg.includes('permission denied');
              // Add 404 to rotation triggers
              const isNotFound = status === 404 || msg.includes('not_found') || msg.includes('not found');

              if (isQuota || isAuth || isNotFound) {
                  console.warn(`[GeminiBackend] Chat Stream Error (Status: ${status}). Rotating...`);
                  rotateKey();
                  attempts++;
              } else {
                  console.error("[GeminiBackend] Stream Error:", error);
                  yield "Error: Could not connect to AI service.";
                  return;
              }
          }
      }
      yield "System Busy: All AI quotas exhausted. Please try again later.";
  }
};

const mapToToolInterface = (data: any[], prefix: string): Tool[] => {
  return data.map((item, index) => {
    const url = item.website_url || item.url || '';
    const domain = url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'example.com';
    const isPaid = item.is_paid !== undefined ? item.is_paid : item.isPaid;
    
    return {
      id: `${prefix}-${item.name?.replace(/\s+/g, '-').toLowerCase() || 'tool'}-${Date.now()}-${index}`,
      name: item.name || domain,
      url: domain,
      category: item.category || 'Other',
      rating: 4.5,
      reviews: item.trend_score_24h || item.reviews || 10,
      isPaid: !!isPaid,
      pricingModel: item.pricingModel || (isPaid ? 'Paid' : 'Free'),
      isActive: true,
      logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      shortDescription: item.description || item.shortDescription || 'AI Tool',
      verified: false,
      trendScore: item.trend_score_24h,
      publishedDate: item.published_date || item.publishedDate,
      plans: item.plans || [] 
    };
  });
};
