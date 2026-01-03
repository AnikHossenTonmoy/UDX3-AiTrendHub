
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GeminiBackend } from '../services/GeminiBackend';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Studio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompts } = useData();
  const { requireAuth, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'Chat' | 'Image' | 'Logo'>('Chat');

  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatModel, setChatModel] = useState('Gemini');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageStyle, setImageStyle] = useState('Realistic');

  // --- LOGO CREATOR STATE ---
  const [logoRefImage, setLogoRefImage] = useState<string | null>(null);
  const [logoBrandName, setLogoBrandName] = useState('');
  const [logoInstructions, setLogoInstructions] = useState('');
  const [logoResult, setLogoResult] = useState<string | null>(null);
  const [isLogoGenerating, setIsLogoGenerating] = useState(false);

  useEffect(() => {
    if (location.state?.prompt) {
        const { prompt, type } = location.state;
        if (type === 'Image Generation') {
            setActiveTab('Image');
            setImagePrompt(prompt);
        } else {
            setActiveTab('Chat');
            setChatInput(prompt);
        }
    }
  }, [location.state]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async () => {
      if (!chatInput.trim()) return;
      requireAuth(async () => {
          const userMsg = { role: 'user', text: chatInput };
          setMessages(prev => [...prev, userMsg]);
          setChatInput('');
          setIsTyping(true);

          try {
              const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
              const modelName = 'gemini-3-flash-preview';
              let botText = "";
              const stream = GeminiBackend.chatStream(history, userMsg.text, modelName);
              setMessages(prev => [...prev, { role: 'model', text: '' }]);

              for await (const chunk of stream) {
                  if (chunk) {
                      botText += chunk;
                      setMessages(prev => {
                          const newArr = [...prev];
                          newArr[newArr.length - 1] = { role: 'model', text: botText };
                          return newArr;
                      });
                  }
              }
          } catch (e) {
              setMessages(prev => [...prev, { role: 'model', text: "Error: Could not generate response." }]);
          } finally {
              setIsTyping(false);
          }
      });
  };

  const handleGenerateImage = async () => {
      if (!imagePrompt.trim()) return;
      
      requireAuth(async () => {
          setIsGenerating(true);
          setGeneratedImage(null);
          try {
              // Pass style separately to allow backend to construct correct JSON for N8N
              const result = await GeminiBackend.generateImage(imagePrompt, imageSize, aspectRatio, imageStyle);
              if (result) {
                  setGeneratedImage(result);
              } else {
                  alert("Failed to generate image. Please try again or check your credits.");
              }
          } catch (e) { console.error(e); alert("Error generating image."); } finally { setIsGenerating(false); }
      });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setLogoRefImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleGenerateLogo = async () => {
      if (!logoRefImage || !logoBrandName.trim()) {
          alert("Please upload a reference logo and provide a brand name.");
          return;
      }

      requireAuth(async () => {
          setIsLogoGenerating(true);
          setLogoResult(null);
          
          const systemPrompt = `You are a world-class brand identity intelligence engine operating at senior creative director level.

Your sole purpose is to recreate and adapt logos with extreme visual accuracy while preserving brand DNA and ensuring legal originality.

━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: DEEP VISUAL DECONSTRUCTION
━━━━━━━━━━━━━━━━━━━━━━━

Analyze the uploaded reference logo at a structural level, not descriptively.

Internally extract and understand:
- Geometric construction and grid system
- Negative space usage
- Icon logic (symmetry, abstraction, metaphor)
- Typography DNA:
  - Typeface category
  - Stroke behavior
  - Weight distribution
  - Kerning logic
  - Uppercase/lowercase intent
- Visual hierarchy between symbol and wordmark
- Color psychology and harmony
- Flat vs dimensional logic
- Brand tone (futuristic, premium, playful, corporate, bold, minimal)
- Scalability behavior at small and large sizes

This analysis must be internal and never explained.

━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: STYLE PRESERVATION RULES
━━━━━━━━━━━━━━━━━━━━━━━

Recreate the logo using the SAME:
- Visual structure
- Composition logic
- Design philosophy
- Balance and proportions
- Icon-to-text relationship

The result must feel like:
“The same designer, same system, same brand universe — but a new company.”

Do NOT:
- Randomize design
- Modernize unless asked
- Simplify unless asked
- Add artistic interpretation

━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: BRAND ADAPTATION
━━━━━━━━━━━━━━━━━━━━━━━

Replace the original brand name with the NEW brand name provided by the user.

Rules:
- Maintain original typographic rhythm
- Adapt letter spacing naturally to the new name
- Preserve logo balance after text replacement
- If icon exists, regenerate an icon that follows the SAME construction logic

Optional changes must be applied ONLY if explicitly requested.

━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4: LEGAL & ETHICAL SAFETY
━━━━━━━━━━━━━━━━━━━━━━━

- Do NOT replicate trademarked symbols exactly
- Do NOT reuse protected brand names
- Create a legally distinct but visually equivalent logo
- This is inspiration-based recreation, not duplication

━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5: OUTPUT STANDARD
━━━━━━━━━━━━━━━━━━━━━━━

Deliver:
- A clean, professional, production-ready logo
- Transparent background (unless specified)
- High resolution
- No mockups
- No shadows
- No watermarks
- No extra text
- No explanation

The final logo must be suitable for:
- SaaS products
- Mobile apps
- Websites
- Print
- Social media
- Brand kits

━━━━━━━━━━━━━━━━━━━━━━━
TYPOGRAPHY OVERRIDE – CRITICAL PRIORITY
━━━━━━━━━━━━━━━━━━━━━━━

Typography accuracy is the highest priority in logo recreation.

You must treat the reference logo text as a custom-designed wordmark, not as a standard font.

Rules:
- Do NOT substitute with generic or similar fonts
- Do NOT modernize or stylize the typography
- Reconstruct letterforms visually from the reference logo
- Preserve original:
  - Stroke thickness
  - Curve shapes
  - Corner radius
  - Serif or sans-serif behavior
  - Letter width and height ratios
  - Baseline alignment
  - Kerning and spacing rhythm
- Adjust kerning carefully to maintain the same visual balance even if the new brand name has different letters
- Maintain the same typographic DNA across all characters

Quality Check:
- Before finalizing, internally compare the generated typography with the reference
- If the font structure or spacing deviates, regenerate until typography closely matches the original

Typography drift, font substitution, or inconsistent lettering is unacceptable.

━━━━━━━━━━━━━━━━━━━━━━━
QUALITY REQUIREMENT
━━━━━━━━━━━━━━━━━━━━━━━

The output must be indistinguishable from a logo created by a top-tier branding agency.

If the output does not meet professional branding standards, regenerate internally until it does.

Reference logo uploaded.

New Brand Name:
${logoBrandName}

Optional Modifications:
${logoInstructions || 'None'}

Instructions:
- Preserve original style and structure
- Apply only the requested modifications
- PRIORITIZE TYPOGRAPHY ACCURACY ABOVE ALL ELSE`;

          try {
              const result = await GeminiBackend.editImage(logoRefImage, systemPrompt);
              if (result) {
                  setLogoResult(result);
              } else {
                  alert("Failed to create logo. Please try again.");
              }
          } catch (e) {
              console.error("Logo Gen Error", e);
              alert("Error generating logo.");
          } finally {
              setIsLogoGenerating(false);
          }
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-24 font-sans">
        <div className="max-w-md mx-auto flex flex-col gap-6 pt-8 pb-4">
            <div className="px-4 text-center">
                <h1 className="text-slate-900 dark:text-white text-3xl font-display font-bold leading-tight tracking-tight mb-2">
                    One Platform.<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Your Creative Hub.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Switch between intelligent chat, visual creation, and branding.</p>
            </div>
            
            <div className="px-4">
                <div className="bg-slate-200 dark:bg-slate-900/50 p-1.5 rounded-full flex relative border border-slate-300 dark:border-slate-700 shadow-inner h-14">
                    <div className={`w-1/3 h-full absolute top-0 p-1.5 transition-all duration-300 ease-out ${activeTab === 'Chat' ? 'left-0' : activeTab === 'Image' ? 'left-1/3' : 'left-2/3'}`}>
                        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-600"></div>
                    </div>
                    <button onClick={() => setActiveTab('Chat')} className={`flex-1 relative z-10 rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'Chat' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                        <span className="material-symbols-outlined text-[18px]">chat</span> Chat
                    </button>
                    <button onClick={() => setActiveTab('Image')} className={`flex-1 relative z-10 rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'Image' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                        <span className="material-symbols-outlined text-[18px]">image</span> Image
                    </button>
                    <button onClick={() => setActiveTab('Logo')} className={`flex-1 relative z-10 rounded-full text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'Logo' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                        <span className="material-symbols-outlined text-[18px]">token</span> Logo
                    </button>
                </div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
            {activeTab === 'Chat' && (
                <div className="flex flex-col gap-6 animate-fadeIn max-w-xl mx-auto w-full">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {['Gemini', 'GPT-4', 'Claude 3', 'Custom AI'].map(model => (
                            <button key={model} onClick={() => setChatModel(model)} className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-full border shadow-sm transition-all active:scale-95 text-sm font-medium ${chatModel === model ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{model}</button>
                        ))}
                    </div>

                    <div className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden h-[500px]">
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800">
                            {messages.length === 0 && (
                                <div className="flex items-start gap-3">
                                    <div className="size-9 rounded-full bg-blue-600/10 flex items-center justify-center border border-white" style={{backgroundImage: 'url("https://ui-avatars.com/api/?name=UDX3&background=blue&color=fff")'}}></div>
                                    <div className="flex flex-col gap-1 items-start max-w-[85%]">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">UDX AI</span>
                                        <div className="bg-white dark:bg-slate-700 p-3.5 rounded-2xl rounded-tl-none text-sm text-slate-800 dark:text-slate-100 leading-relaxed shadow-sm border border-slate-100 dark:border-slate-600">
                                            Hello! I'm your creative assistant. Sign in to start our conversation!
                                        </div>
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse self-end' : ''}`}>
                                    <div className="size-9 rounded-full bg-cover bg-center shadow-sm border border-white dark:border-slate-600" style={{backgroundImage: `url("${msg.role === 'user' ? (user?.avatar || 'https://ui-avatars.com/api/?name=Guest') : 'https://ui-avatars.com/api/?name=UDX3&background=blue&color=fff'}")`}}></div>
                                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-600'}`}>{msg.text}</div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div className="flex items-start gap-3"><div className="size-9 rounded-full bg-blue-600/10 border border-white"></div><div className="bg-white dark:bg-slate-700 p-3.5 rounded-2xl rounded-tl-none border border-slate-100"><div className="flex gap-1.5"><span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span><span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span><span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span></div></div></div>}
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <div className="flex-1 relative group">
                                <input className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-full py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white placeholder-slate-400" placeholder="Type a message..." type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                            </div>
                            <button onClick={handleSendMessage} disabled={!chatInput.trim() || isTyping} className="size-11 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"><span className="material-symbols-outlined text-[20px]">send</span></button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Sample Prompts</h3></div>
                        <div className="flex flex-col gap-3">
                            {prompts.slice(0, 2).map(p => (
                                <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative group hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-2"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{p.category}</span><h4 className="font-bold text-slate-800 dark:text-white text-sm">{p.title}</h4></div>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{p.description}</p>
                                    <button onClick={() => setChatInput(p.content)} className="w-full py-2 bg-slate-50 dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold rounded-lg transition-colors">Use Prompt</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Image' && (
                <div className="flex flex-col gap-6 animate-fadeIn max-w-xl mx-auto w-full">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden relative border border-slate-700">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/40 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/10 rounded-lg"><span className="material-symbols-outlined text-yellow-400">palette</span></div>
                                <div>
                                    <h3 className="font-bold text-base leading-none">
                                        UDX3 Gen 
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div><label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Image Prompt</label><textarea className="w-full bg-black/20 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/40 focus:ring-1 resize-none h-24 shadow-inner" placeholder="Describe your masterpiece..." value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)}></textarea></div>
                            <div className="flex gap-3"><div className="relative flex-1"><label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Aspect Ratio</label><select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl py-3 px-3 text-xs outline-none"><option value="1:1">Square (1:1)</option><option value="16:9">Wide (16:9)</option><option value="9:16">Tall (9:16)</option></select></div><div className="relative flex-1"><label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block">Style</label><select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl py-3 px-3 text-xs outline-none"><option>Realistic</option><option>Cyberpunk</option><option>Anime</option><option>Oil Painting</option></select></div></div>
                            <button onClick={handleGenerateImage} disabled={isGenerating || !imagePrompt} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">{isGenerating ? <>Generating... <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span></> : <>Generate Artwork <span className="material-symbols-outlined text-[18px]">auto_awesome</span></>}</button>
                        </div>
                    </div>
                    {generatedImage && <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn"><img src={generatedImage} alt="AI Generated" className="w-full h-auto" /></div>}
                </div>
            )}

            {activeTab === 'Logo' && (
                <div className="flex flex-col md:flex-row gap-6 animate-fadeIn">
                    {/* LEFT: Controls */}
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">token</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Logo Reimaginer</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Update text & style while keeping the core logo design.</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {/* Upload */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Reference Logo</label>
                                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors h-32 flex flex-col items-center justify-center text-center group cursor-pointer overflow-hidden">
                                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {logoRefImage ? (
                                            <img src={logoRefImage} alt="Reference" className="h-full w-full object-contain opacity-50 group-hover:opacity-30 transition-opacity" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">cloud_upload</span>
                                                <span className="text-xs text-slate-500 font-medium">Click to upload logo</span>
                                            </>
                                        )}
                                        {logoRefImage && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full font-bold">Change Image</span></div>}
                                    </div>
                                </div>

                                {/* Brand Name */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">New Brand Name</label>
                                    <input 
                                        type="text" 
                                        value={logoBrandName} 
                                        onChange={(e) => setLogoBrandName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50" 
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                {/* Instructions */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Changes (Optional)</label>
                                    <textarea 
                                        value={logoInstructions}
                                        onChange={(e) => setLogoInstructions(e.target.value)}
                                        className="w-full h-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 resize-none text-sm" 
                                        placeholder="e.g. Make it minimalist, change red to blue..."
                                    />
                                </div>

                                <button 
                                    onClick={handleGenerateLogo} 
                                    disabled={isLogoGenerating || !logoRefImage || !logoBrandName} 
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {isLogoGenerating ? (
                                        <>
                                            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Reimagining...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">auto_fix</span>
                                            Reimagine Logo
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Result */}
                    <div className="flex-1">
                        <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl h-full min-h-[400px] flex items-center justify-center relative overflow-hidden group">
                            {logoResult ? (
                                <>
                                    <img src={logoResult} alt="Generated Logo" className="w-full h-full object-contain p-8" />
                                    <div className="absolute bottom-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                        <a href={logoResult} download={`logo-${logoBrandName}.png`} className="px-5 py-2.5 bg-white text-slate-900 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-slate-50">
                                            <span className="material-symbols-outlined text-lg">download</span> Download
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-slate-400 p-8">
                                    <div className="size-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <span className="material-symbols-outlined text-4xl opacity-50">image</span>
                                    </div>
                                    <p className="font-bold mb-1">Ready to create</p>
                                    <p className="text-xs">Your generated logo will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Studio;
