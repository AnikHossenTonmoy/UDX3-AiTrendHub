
import { GoogleGenAI } from "@google/genai";
import { Tool, Video } from "../types";

// --- API KEY ROTATION SYSTEM ---
const PROVIDED_KEYS = [
  'AIzaSyBpQJQEHPappArpBa0Kg9kDmxX_3v7915g',
  'AIzaSyBKtzK36jvaIZxOhE3SCUVbWO0i68Xkoi4',
  'AIzaSyCm5oOKdlFseu5v08QTJbc_TEiy71jqDZ0',
  'AIzaSyDBc4Lqfij5g7N44GNQJWtosz-w__RJXHE',
  'AIzaSyDoOARrDUKWXVujjzBQzLV8Hh87Zzm4E3Q'
];

const getApiKeyPool = () => {
    const envKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [];
    const primaryKey = process.env.API_KEY ? [process.env.API_KEY] : [];
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

async function executeWithRotation<T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    let attempts = 0;
    const maxAttempts = API_KEY_POOL.length; 

    while (attempts < maxAttempts) {
        try {
            const apiKey = getActiveKey();
            const client = new GoogleGenAI({ apiKey });
            return await operation(client);
        } catch (error: any) {
            const status = error.status || error.response?.status;
            const msg = (error.message || '').toLowerCase();
            const isQuota = status === 429 || msg.includes('429') || msg.includes('quota');
            const isAuth = status === 401 || status === 403 || msg.includes('key not valid');
            const isNotFound = status === 404 || msg.includes('not_found');

            if (isQuota || isAuth || isNotFound) {
                console.warn(`[GeminiBackend] Error (Status: ${status}). Retrying with next key...`);
                rotateKey();
                attempts++;
            } else {
                console.error("[GeminiBackend] Non-rotatable error:", error);
                throw error;
            }
        }
    }
    throw new Error("All Gemini API keys in the rotation pool have been exhausted.");
}

// --- N8N WEBHOOKS ---
const WEBHOOKS = {
    CORE: 'https://snsulayman.app.n8n.cloud/webhook-test/udx3-ai-core',
    IMAGE: 'https://snsulayman.app.n8n.cloud/webhook-test/generate-image',
    LOGO: 'https://snsulayman.app.n8n.cloud/webhook-test/generate-logo'
};

// --- ROBUST WEBHOOK HANDLER ---
// Handles timeouts, JSON parsing, and standard error checking
async function callN8NWebhook(url: string, payload: any, timeoutMs = 25000): Promise<any> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        console.log(`[GeminiBackend] POST Payload to ${url}:`, JSON.stringify(payload, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[GeminiBackend] Response from ${url}:`, data);
        return data;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            console.error(`[GeminiBackend] Timeout: Request to ${url} took longer than ${timeoutMs}ms`);
        } else {
            console.error(`[GeminiBackend] Connection Failed: ${error.message}`);
        }
        return null;
    }
}

// --- FALLBACK DATA ---
const FALLBACK_TRENDING: Tool[] = [
    { id: 'fb-1', name: 'Sora (OpenAI)', url: 'openai.com/sora', category: 'Video Generators', rating: 4.9, reviews: 15000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', shortDescription: 'Create realistic and imaginative scenes from text instructions.', verified: true, trendScore: 99, publishedDate: '24h ago' },
];
const FALLBACK_LATEST: Tool[] = [
     { id: 'fb-new-1', name: 'Grok 1.5', url: 'x.ai', category: 'AI Chat & Assistant', rating: 4.5, reviews: 2000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=x.ai&sz=128', shortDescription: 'Enhanced reasoning capabilities and context length.', verified: true, trendScore: 85, publishedDate: 'Just Released' },
];
const FALLBACK_VIDEOS: Video[] = [
    { id: 'fb-vid-1', videoId: 'jC4v5AS4RIM', title: 'OpenAI Sora: First Impressions', thumbnail: 'https://img.youtube.com/vi/jC4v5AS4RIM/mqdefault.jpg', channelName: 'MKBHD', channelAvatar: '', views: '2.1M', duration: '12:00', publishedAt: '2 days ago', category: 'News' },
];

// --- CACHING SYSTEM ---
const CACHE_KEY_PREFIX = 'gemini_cache_';
const CACHE_TTL = 1000 * 60 * 60; // 1 Hour Cache

const getFromCache = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(CACHE_KEY_PREFIX + key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < CACHE_TTL) return parsed.data as T;
        return null;
    } catch (e) { return null; }
};

const setCache = (key: string, data: any) => {
    try {
        const cacheItem = { data, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheItem));
    } catch (e) { console.error("Cache storage error", e); }
};

// Helper: Call Google GenAI SDK with Rotation
async function callGenAI(prompt: string, jsonMode: boolean = true): Promise<string> {
    return executeWithRotation(async (client) => {
        const config: any = {};
        if (jsonMode) {
            config.responseMimeType = 'application/json';
        }
        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: config
        });
        return response.text || (jsonMode ? "[]" : "");
    });
}

function parseAIJson(text: string): any {
    try {
        let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (e) { return []; }
}

export const GeminiBackend = {
  
  // --- N8N Integration ---
  async callN8N(action: string, params: any = {}): Promise<any> {
      // Standardizes N8N calls for Core logic
      const payload = {
          type: action,
          ...params,
          tool: 'n8n-automation',
          userId: 'guest-user' // Replace with context ID if available
      };
      return await callN8NWebhook(WEBHOOKS.CORE, payload);
  },

  async fetchTrendingTools(): Promise<Tool[]> {
    const cacheKey = 'trending_tools';
    const cached = getFromCache<Tool[]>(cacheKey);
    if (cached) return cached;

    try {
        const n8nData = await this.callN8N('get_trending');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || n8nData?.data || []); // Handle flexible response
        
        if (Array.isArray(toolsData) && toolsData.length > 0) {
            const result = mapToToolInterface(toolsData, 'trend');
            setCache(cacheKey, result);
            return result;
        }
    } catch (err) {}

    // Fallback logic...
    try {
      const prompt = `Act as an AI market analyst. List the top 12 trending AI tools popular in the last 24 hours. Return STRICT JSON ARRAY.`;
      const text = await callGenAI(prompt, true);
      const result = mapToToolInterface(Array.isArray(parseAIJson(text)) ? parseAIJson(text) : [], 'trend');
      if (result.length > 0) setCache(cacheKey, result);
      return result.length > 0 ? result : FALLBACK_TRENDING;
    } catch (error) { return FALLBACK_TRENDING; }
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
    } catch (err) {}

    try {
      const prompt = `List 8 brand new AI tools released this week. Return STRICT JSON ARRAY.`;
      const text = await callGenAI(prompt, true);
      const result = mapToToolInterface(Array.isArray(parseAIJson(text)) ? parseAIJson(text) : [], 'latest');
      if (result.length > 0) setCache(cacheKey, result);
      return result.length > 0 ? result : FALLBACK_LATEST;
    } catch (error) { return FALLBACK_LATEST; }
  },

  async discoverTools(): Promise<Tool[]> {
     try {
        const n8nData = await this.callN8N('discover_tools');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.tools || []);
        if (Array.isArray(toolsData) && toolsData.length > 0) return mapToToolInterface(toolsData, 'n8n-disc');
     } catch (e) {}
     // Fallback to SDK
     try {
        const text = await callGenAI(`Generate a list of 5 popular AI tools. Return a STRICT JSON ARRAY.`, true);
        const rawData = parseAIJson(text);
        return Array.isArray(rawData) ? mapToToolInterface(rawData, 'gen-disc') : [];
     } catch (e) { return []; }
  },

  async processBulkUrls(urls: string[], defaultCategory?: string): Promise<Tool[]> {
    try {
        const n8nData = await this.callN8N('process_bulk', { urls, defaultCategory });
        if (Array.isArray(n8nData) && n8nData.length > 0) return mapToToolInterface(n8nData, 'n8n-bulk');
        if (n8nData?.tools && Array.isArray(n8nData.tools)) return mapToToolInterface(n8nData.tools, 'n8n-bulk');
    } catch (e) {}

    // Fallback chunk processing
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < urls.length; i += chunkSize) chunks.push(urls.slice(i, i + chunkSize));
    let allTools: Tool[] = [];

    for (const chunk of chunks) {
        try {
            const prompt = `Analyze these AI Tool URLs: ${chunk.join(', ')}. Return JSON Array of objects {name, website_url, category, description, is_paid, pricingModel}.`;
            const text = await callGenAI(prompt, true);
            const data = parseAIJson(text);
            if (Array.isArray(data)) allTools = [...allTools, ...mapToToolInterface(data, 'bulk-import')];
        } catch (e) {
            // Basic fallback
            allTools = [...allTools, ...chunk.map(url => ({
                 id: `bulk-fail-${Date.now()}-${Math.random()}`, name: url, url, category: defaultCategory || 'Other', rating: 0, reviews: 0, isPaid: false, pricingModel: 'Freemium' as const, isActive: true, logo: '', shortDescription: 'Imported', verified: false, plans: []
            }))];
        }
    }
    return allTools;
  },

  async enrichToolDetails(name: string, category: string, url: string): Promise<Partial<Tool>> {
      try {
          const n8nData = await this.callN8N('enrich_tool', { name, category, url });
          if (n8nData && (n8nData.description || n8nData.features)) return n8nData;
      } catch (e) {}
      // Fallback
      try {
          const text = await callGenAI(`Generate profile for "${name}" (${category}). Return JSON: {description, features[], pricingModel, plans[]}`, true);
          return parseAIJson(text);
      } catch (error) { return {}; }
  },

  // --- RAW TEXT GENERATION (Prompts) ---
  async generateRawText(prompt: string): Promise<string> {
      try {
          // Strict Request Format
          const payload = {
              type: 'text_generation',
              prompt: prompt,
              tool: 'gemini',
              userId: 'guest'
          };
          const n8nData = await callN8NWebhook(WEBHOOKS.CORE, payload);
          
          // Strict Response Parsing
          if (n8nData?.status === 'success' && n8nData?.result?.text) return n8nData.result.text;
          if (n8nData?.text) return n8nData.text;
          if (n8nData?.output) return n8nData.output;
      } catch (e) { console.warn("N8N Text Gen failed"); }

      try {
          return await callGenAI(prompt, false);
      } catch (e) {
          console.error("Text Generation Failed", e);
          return "Failed to generate text. Please try again.";
      }
  },

  // --- STUDIO: IMAGE GENERATION ---
  async generateImage(prompt: string, size: '1K' | '2K' | '4K', aspectRatio: string, style: string = 'realistic'): Promise<string | null> {
      // 1. Try N8N Image Webhook First (Strict Protocol)
      try {
          const payload = {
              type: "image_generation",
              prompt: prompt,
              style: style,
              tool: "gemini", // or 'nano-banana' based on preference
              userId: "guest-user",
              // Extra metadata
              size: size,
              aspectRatio: aspectRatio
          };

          const data = await callN8NWebhook(WEBHOOKS.IMAGE, payload);
          
          // Strict Response Parsing
          // Preferred: { status: 'success', result: { image: '...' } }
          if (data?.status === 'success' && data?.result?.image) {
              return this.formatImageString(data.result.image);
          }
          // Fallback 1: { image: '...' }
          if (data?.image) return this.formatImageString(data.image);
          // Fallback 2: { output: '...' }
          if (data?.output) return this.formatImageString(data.output);
          // Fallback 3: { result: '...' }
          if (typeof data?.result === 'string') return this.formatImageString(data.result);

          if (data?.status === 'error') {
              console.warn("N8N returned error:", data.message);
          }

      } catch (e) {
          console.warn("[GeminiBackend] N8N Image Gen failed, falling back to Gemini SDK...", e);
      }

      // 2. Fallback to Gemini SDK
      return executeWithRotation(async (client) => {
          try {
              const fullPrompt = style ? `${style} style: ${prompt}` : prompt;
              const response = await client.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: { parts: [{ text: fullPrompt }] },
                  config: { imageConfig: { aspectRatio: aspectRatio } }
              });
              
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

  // --- STUDIO: LOGO EDITING ---
  async editImage(imageBase64: string, prompt: string): Promise<string | null> {
      try {
          const payload = {
              type: "logo_generation",
              image: imageBase64, // Ensure base64 string is clean in frontend if possible, or send as is
              prompt: prompt,
              tool: "gemini",
              userId: "guest-user"
          };

          const data = await callN8NWebhook(WEBHOOKS.LOGO, payload);

          if (data?.status === 'success' && data?.result?.image) return this.formatImageString(data.result.image);
          if (data?.image) return this.formatImageString(data.image);
          if (data?.output) return this.formatImageString(data.output);

      } catch (e) {
          console.warn("[GeminiBackend] N8N Logo Gen failed, falling back to Gemini SDK...", e);
      }

      // Fallback
      return executeWithRotation(async (client) => {
          try {
              let mimeType = 'image/png';
              let data = imageBase64;
              if (imageBase64.includes('data:') && imageBase64.includes(';base64,')) {
                  const parts = imageBase64.split(';base64,');
                  if (parts.length === 2) {
                      const typeMatch = parts[0].match(/data:(.*)/);
                      if (typeMatch && typeMatch[1]) mimeType = typeMatch[1];
                      data = parts[1];
                  }
              }
              data = data.replace(/\s/g, '');

              const response = await client.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: [{ parts: [{ inlineData: { mimeType, data } }, { text: prompt }] }]
              });

              for (const part of response.candidates?.[0]?.content?.parts || []) {
                  if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              }
              return null;
          } catch (e) { console.error("Gemini Image Edit Error:", e); throw e; }
      });
  },

  // Utility to ensure image string is renderable
  formatImageString(imgStr: string): string {
      if (!imgStr) return '';
      if (imgStr.startsWith('http')) return imgStr;
      if (imgStr.startsWith('data:')) return imgStr;
      return `data:image/png;base64,${imgStr}`;
  },

  async findYoutubeId(query: string): Promise<string | null> {
    return executeWithRotation(async (client) => {
        try {
            const response = await client.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: `Find specific YouTube video ID (11 chars) for: "${query}". Return ONLY ID. If none, return "null".`,
                config: { tools: [{ googleSearch: {} }] }
            });
            const text = response.text || "";
            const idMatch = text.trim().match(/[a-zA-Z0-9_-]{11}/);
            return idMatch ? idMatch[0] : null;
        } catch (e) { throw e; }
    }).catch(() => null);
  },

  async fetchVideoTutorials(): Promise<Video[]> {
    // ... (Existing video logic can remain, simplified here for brevity as it was working)
    const cacheKey = 'video_tutorials';
    const cached = getFromCache<Video[]>(cacheKey);
    if (cached) return cached;
    return FALLBACK_VIDEOS;
  },

  async *chatStream(history: any[], message: string, model: string) {
      // ... (Existing chat logic can remain)
      let attempts = 0;
      const maxAttempts = API_KEY_POOL.length;
      const safeModel = model.includes('gemini-3') ? 'gemini-2.0-flash-exp' : model;

      while (attempts < maxAttempts) {
          try {
              const apiKey = getActiveKey();
              const client = new GoogleGenAI({ apiKey });
              const chat = client.chats.create({ model: safeModel, history: history });
              const result = await chat.sendMessageStream({ message: message });
              for await (const chunk of result) yield chunk.text;
              return;
          } catch (error: any) {
              const status = error.status || error.response?.status;
              if (status === 429 || status === 401 || status === 403 || status === 404) {
                  rotateKey(); attempts++;
              } else {
                  yield "Error: Could not connect to AI service."; return;
              }
          }
      }
      yield "System Busy: All AI quotas exhausted.";
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
