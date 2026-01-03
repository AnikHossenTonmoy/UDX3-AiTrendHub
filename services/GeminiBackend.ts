
import { GoogleGenAI } from "@google/genai";
import { Tool, Video } from "../types";

// --- API KEY ROTATION SYSTEM (FALLBACK ONLY) ---
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
                rotateKey();
                attempts++;
            } else {
                throw error;
            }
        }
    }
    throw new Error("All Gemini API keys in the rotation pool have been exhausted.");
}

// --- N8N WEBHOOK CONFIGURATION ---
const WEBHOOKS = {
    CORE: 'https://snsulayman.app.n8n.cloud/webhook-test/udx3-ai-core',
    IMAGE: 'https://snsulayman.app.n8n.cloud/webhook-test/generate-image',
    LOGO: 'https://snsulayman.app.n8n.cloud/webhook-test/generate-logo'
};

/**
 * STRICT N8N WEBHOOK HANDLER
 * Enforces POST, JSON, and Timeout
 */
async function callN8NWebhook(url: string, payload: any, timeoutMs = 20000): Promise<any> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        console.log(`[N8N Request] Sending to ${url}`, payload);
        
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
            throw new Error(`N8N HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[N8N Response]`, data);
        return data;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error("Request timed out. The AI took too long to respond.");
        }
        throw error;
    }
}

// --- HELPER UTILS ---
function parseAIJson(text: string): any {
    try {
        let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (e) { return []; }
}

function formatImageString(imgStr: string): string {
    if (!imgStr) return '';
    if (imgStr.startsWith('http')) return imgStr;
    if (imgStr.startsWith('data:')) return imgStr;
    return `data:image/png;base64,${imgStr}`;
}

// --- FALLBACK DATA ---
const FALLBACK_TRENDING: Tool[] = [
    { id: 'fb-1', name: 'Sora (OpenAI)', url: 'openai.com/sora', category: 'Video Generators', rating: 4.9, reviews: 15000, isPaid: true, pricingModel: 'Paid', isActive: true, logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', shortDescription: 'Create realistic and imaginative scenes from text instructions.', verified: true, trendScore: 99, publishedDate: '24h ago' },
];
const FALLBACK_VIDEOS: Video[] = [
    { id: 'fb-vid-1', videoId: 'jC4v5AS4RIM', title: 'OpenAI Sora: First Impressions', thumbnail: 'https://img.youtube.com/vi/jC4v5AS4RIM/mqdefault.jpg', channelName: 'MKBHD', channelAvatar: '', views: '2.1M', duration: '12:00', publishedAt: '2 days ago', category: 'News' },
];

export const GeminiBackend = {
  
  // --- CORE AI LOGIC (Text, Discovery, etc) ---
  async callN8N(action: string, params: any = {}): Promise<any> {
      const payload = {
          type: action, // e.g. "text_generation", "get_trending"
          prompt: params.prompt || "",
          style: params.style || "",
          tool: "n8n-automation",
          userId: "guest-user",
          ...params
      };
      return await callN8NWebhook(WEBHOOKS.CORE, payload);
  },

  async fetchTrendingTools(): Promise<Tool[]> {
    try {
        const n8nData = await this.callN8N('get_trending');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.result?.data || n8nData?.tools || []);
        
        if (Array.isArray(toolsData) && toolsData.length > 0) {
            return mapToToolInterface(toolsData, 'trend');
        }
    } catch (err) { console.warn("N8N Trending Failed, using fallback"); }

    return FALLBACK_TRENDING;
  },

  async fetchLatestTools(): Promise<Tool[]> {
    try {
        const n8nData = await this.callN8N('get_latest');
        const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.result?.data || n8nData?.tools || []);
        if (Array.isArray(toolsData) && toolsData.length > 0) {
            return mapToToolInterface(toolsData, 'latest');
        }
    } catch (err) { console.warn("N8N Latest Failed"); }
    return [];
  },

  async discoverTools(): Promise<Tool[]> {
      try {
          const n8nData = await this.callN8N('discover_tools');
          const toolsData = Array.isArray(n8nData) ? n8nData : (n8nData?.result?.data || n8nData?.tools || []);
          if (Array.isArray(toolsData) && toolsData.length > 0) {
              return mapToToolInterface(toolsData, 'discover');
          }
      } catch (e) {}
      // Fallback
      return this.fetchLatestTools();
  },

  async processBulkUrls(urls: string[], defaultCategory?: string): Promise<Tool[]> {
    try {
        const n8nData = await this.callN8N('process_bulk', { urls, defaultCategory });
        const tools = n8nData?.result?.tools || n8nData?.tools || [];
        if (Array.isArray(tools) && tools.length > 0) return mapToToolInterface(tools, 'n8n-bulk');
    } catch (e) { console.error("Bulk Import Failed", e); }
    return [];
  },

  async enrichToolDetails(name: string, category: string, url: string): Promise<Partial<Tool>> {
      try {
          const n8nData = await this.callN8N('enrich_tool', { name, category, url });
          if (n8nData?.status === 'success' && n8nData.result) return n8nData.result;
          if (n8nData?.description) return n8nData;
      } catch (e) {}
      return {}; 
  },

  // --- RAW TEXT GENERATION (Prompts) ---
  async generateRawText(prompt: string): Promise<string> {
      try {
          const payload = {
              type: 'text_generation',
              prompt: prompt,
              tool: 'gemini',
              userId: 'guest-user',
              style: 'concise' // Default field to prevent undefined errors
          };
          
          const n8nData = await callN8NWebhook(WEBHOOKS.CORE, payload);
          
          // Strict Response Parsing
          if (n8nData?.status === 'success' && n8nData?.result?.text) return n8nData.result.text;
          if (n8nData?.text) return n8nData.text; // Legacy support
          
          throw new Error("Invalid response format from N8N");
      } catch (e) {
          console.error("N8N Text Gen Failed:", e);
          // Fallback to local SDK if N8N fails
          return executeWithRotation(async (client) => {
              const res = await client.models.generateContent({ model: 'gemini-2.0-flash-exp', contents: prompt });
              return res.text || "Error generating text.";
          });
      }
  },

  // --- STUDIO: IMAGE GENERATION ---
  async generateImage(prompt: string, size: '1K' | '2K' | '4K', aspectRatio: string, style: string = 'realistic'): Promise<string | null> {
      // 1. Try N8N Image Webhook First (Strict Protocol)
      try {
          const payload = {
              type: "image_generation",
              prompt: prompt,
              style: style || "realistic",
              tool: "gemini", 
              userId: "guest-user",
              // Additional metadata often needed by workflow
              size: size,
              aspectRatio: aspectRatio
          };

          const data = await callN8NWebhook(WEBHOOKS.IMAGE, payload);
          
          // STRICT RESPONSE PARSING according to user requirements
          // Expected: { status: "success", result: { image: "base64..." } }
          
          if (data?.status === 'success' && data?.result?.image) {
              return formatImageString(data.result.image);
          }
          
          if (data?.status === 'error') {
              throw new Error(data.message || "N8N returned an error status.");
          }

          // Fallback parsing for flexible workflows
          if (data?.image) return formatImageString(data.image);
          if (data?.output) return formatImageString(data.output);

      } catch (e) {
          console.warn("[GeminiBackend] N8N Image Gen failed:", e);
          // Fallback to local Gemini SDK only if N8N fails network/logic
      }

      // 2. Fallback to Gemini SDK (Client-side generation)
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
              console.error("Gemini SDK Fallback Error:", e);
              return null; 
          }
      });
  },

  // --- STUDIO: LOGO EDITING ---
  async editImage(imageBase64: string, prompt: string): Promise<string | null> {
      try {
          const payload = {
              type: "logo_generation",
              prompt: prompt,
              style: "logo", // Required field
              tool: "gemini",
              userId: "guest-user",
              image: imageBase64 // Send base64 directly
          };

          const data = await callN8NWebhook(WEBHOOKS.LOGO, payload);

          if (data?.status === 'success' && data?.result?.image) return formatImageString(data.result.image);
          if (data?.image) return formatImageString(data.image);

      } catch (e) {
          console.warn("[GeminiBackend] N8N Logo Gen failed:", e);
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
    return FALLBACK_VIDEOS;
  },

  async *chatStream(history: any[], message: string, model: string) {
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
