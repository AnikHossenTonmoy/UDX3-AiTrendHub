
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GeminiBackend } from '../services/GeminiBackend';
import { useData } from '../context/DataContext';

const Studio = () => {
  const location = useLocation();
  const { prompts } = useData();
  const [activeTab, setActiveTab] = useState<'Chat' | 'Image'>('Chat');

  // Chat State
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatModel, setChatModel] = useState('Gemini');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageStyle, setImageStyle] = useState('Realistic');

  // Initialization & Incoming Props
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

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async () => {
      if (!chatInput.trim()) return;

      const userMsg = { role: 'user', text: chatInput };
      setMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsTyping(true);

      try {
          // Format history for Gemini SDK
          const history = messages.map(m => ({
              role: m.role,
              parts: [{ text: m.text }]
          }));

          const modelName = chatModel === 'Gemini' ? 'gemini-2.5-flash' : 'gemini-2.5-flash'; // Can map other models if available
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
          console.error(e);
          setMessages(prev => [...prev, { role: 'model', text: "Error: Could not generate response. Please check your connection." }]);
      } finally {
          setIsTyping(false);
      }
  };

  const handleGenerateImage = async () => {
      if (!imagePrompt.trim()) return;
      setIsGenerating(true);
      setGeneratedImage(null);

      try {
          const result = await GeminiBackend.generateImage(`${imageStyle} style: ${imagePrompt}`, imageSize, aspectRatio);
          if (result) {
              setGeneratedImage(result);
          } else {
              alert("Failed to generate image.");
          }
      } catch (e) {
          console.error(e);
          alert("Error generating image.");
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-24 font-sans">
        {/* Header Section */}
        <div className="max-w-md mx-auto flex flex-col gap-6 pt-8 pb-4">
            <div className="px-4 text-center">
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight mb-2">
                    One Platform.<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Your Creative Hub.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Switch between intelligent chat and visual creation.</p>
            </div>
            
            {/* Toggle Switch */}
            <div className="px-4">
                <div className="bg-slate-200 dark:bg-slate-900/50 p-1.5 rounded-full flex relative border border-slate-300 dark:border-slate-700 shadow-inner h-14">
                    <div 
                        className={`w-1/2 h-full absolute top-0 p-1.5 transition-all duration-300 ease-out ${activeTab === 'Chat' ? 'left-0' : 'left-1/2'}`}
                    >
                        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-600"></div>
                    </div>
                    
                    <button 
                        onClick={() => setActiveTab('Chat')}
                        className={`flex-1 relative z-10 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'Chat' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        Chat
                    </button>
                    <button 
                        onClick={() => setActiveTab('Image')}
                        className={`flex-1 relative z-10 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'Image' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">image</span>
                        Image
                    </button>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="max-w-xl mx-auto flex flex-col gap-6 px-4">
            
            {/* --- CHAT SECTION --- */}
            {activeTab === 'Chat' && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                    {/* Model Pills */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {['Gemini', 'GPT-4', 'Claude 3', 'Custom AI'].map(model => (
                            <button 
                                key={model}
                                onClick={() => setChatModel(model)}
                                className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-full border shadow-sm transition-all active:scale-95 text-sm font-medium whitespace-nowrap ${
                                    chatModel === model 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/30' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {model}
                            </button>
                        ))}
                    </div>

                    {/* Chat Window */}
                    <div className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 overflow-hidden h-[500px]">
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800">
                            
                            {/* Intro Message */}
                            {messages.length === 0 && (
                                <div className="flex items-start gap-3">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-9 h-9 shrink-0 bg-blue-600/10 flex items-center justify-center shadow-sm border border-white dark:border-slate-600" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNpL2_o3rtwdDi_3Ng7PUDv3MY8aYJ_IgvWeF0RlpIoglRLQ0ILnMX_bZ39SRsTKmjGVKXwMvs8SucnTTwKqXHxOreHcsXlms8lDg6SvoI4VFyB4af7FpW1Q3j_6tviAas0JSbxrT2G3GF_9f6NYl8Xjm0AMhi_jE09zVmpwcce3mBQIG8DVhsSUyl_z7BiNX1V6PZdKz_TZe_ekDOLG0Y9kq-6oayrGM6hrmNny3IWUrqmwyilAbiq-3wLho1EJlxVd_p5ZrD3Oz2")'}}></div>
                                    <div className="flex flex-col gap-1 items-start max-w-[85%]">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">UDX AI</span>
                                        <div className="bg-white dark:bg-slate-700 p-3.5 rounded-2xl rounded-tl-none text-sm text-slate-800 dark:text-slate-100 leading-relaxed shadow-sm border border-slate-100 dark:border-slate-600">
                                            Hello! I'm ready to assist you. What's on your mind today?
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse self-end' : ''}`}>
                                    <div 
                                        className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full w-9 h-9 shrink-0 shadow-sm border border-white dark:border-slate-600 ${msg.role === 'user' ? '' : 'bg-blue-600/10'}`} 
                                        style={{backgroundImage: `url("${msg.role === 'user' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXsTBSQnmlPgVAFTR5N3BNbfC3er6h51_AqLWHItUyYzFlbBOfRVYIpFsfT_MoZWuSXXPC9xv3bRkiq39RvTn35ixBgsjfAF-N9yiA3eMQ1J3UnEOT30feNVevBhIi0rvCD3Czzg2z6SBdnxVMFtc_55zYxIdpFe8Kxd6WB4pFoE5Z5Q7546eZ3geas5Ec1--XqvJrzwbmKz2y6iLwwF7rkAtr6lZ7T_SwPiioeItaY797WEiPpz4Fd8QUo_iUdboKfMwQRxTtEArS' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNpL2_o3rtwdDi_3Ng7PUDv3MY8aYJ_IgvWeF0RlpIoglRLQ0ILnMX_bZ39SRsTKmjGVKXwMvs8SucnTTwKqXHxOreHcsXlms8lDg6SvoI4VFyB4af7FpW1Q3j_6tviAas0JSbxrT2G3GF_9f6NYl8Xjm0AMhi_jE09zVmpwcce3mBQIG8DVhsSUyl_z7BiNX1V6PZdKz_TZe_ekDOLG0Y9kq-6oayrGM6hrmNny3IWUrqmwyilAbiq-3wLho1EJlxVd_p5ZrD3Oz2'}")`}}
                                    ></div>
                                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-600/20' 
                                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-600'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start gap-3">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-9 h-9 shrink-0 bg-blue-600/10 border border-white dark:border-slate-600" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNpL2_o3rtwdDi_3Ng7PUDv3MY8aYJ_IgvWeF0RlpIoglRLQ0ILnMX_bZ39SRsTKmjGVKXwMvs8SucnTTwKqXHxOreHcsXlms8lDg6SvoI4VFyB4af7FpW1Q3j_6tviAas0JSbxrT2G3GF_9f6NYl8Xjm0AMhi_jE09zVmpwcce3mBQIG8DVhsSUyl_z7BiNX1V6PZdKz_TZe_ekDOLG0Y9kq-6oayrGM6hrmNny3IWUrqmwyilAbiq-3wLho1EJlxVd_p5ZrD3Oz2")'}}></div>
                                    <div className="bg-white dark:bg-slate-700 p-3.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-600">
                                         <div className="flex gap-1.5">
                                            <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                            <span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full">
                                <span className="material-symbols-outlined">add_circle</span>
                            </button>
                            <div className="flex-1 relative group">
                                <input 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-full py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-white placeholder-slate-400 shadow-inner" 
                                    placeholder="Type a message..." 
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-1">
                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                </button>
                            </div>
                            <button 
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim() || isTyping}
                                className="size-11 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </div>
                    </div>

                    {/* Prompt Library */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prompt Library</h3>
                            <button onClick={() => {}} className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
                        </div>
                        
                        <div className="overflow-x-auto no-scrollbar flex gap-3 pb-2">
                            {['Business', 'Writing', 'Marketing', 'Gaming'].map(tag => (
                                <button key={tag} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm">
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            {prompts.slice(0, 2).map(p => (
                                <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative group hover:shadow-md transition-shadow">
                                    <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{p.category}</span>
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{p.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                                    <button 
                                        onClick={() => setChatInput(p.content)}
                                        className="w-full py-2 bg-slate-50 dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white"
                                    >
                                        Use Prompt <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- IMAGE SECTION --- */}
            {activeTab === 'Image' && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                    
                    {/* Generator Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#101622] dark:to-[#1e2736] rounded-3xl p-6 text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative border border-slate-700 dark:border-slate-800">
                        {/* Background Blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/40 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                        
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-yellow-400">palette</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-none">NanoBanana Gen</h3>
                                    <p className="text-[10px] text-white/50 mt-0.5">High fidelity image creation</p>
                                </div>
                            </div>
                            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-white/90 border border-white/5 font-medium shadow-sm">v5.2 Model</span>
                        </div>

                        {/* Controls */}
                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block ml-1">Prompt</label>
                                <textarea 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 shadow-inner" 
                                    placeholder="Describe a futuristic city with neon lights reflecting on wet pavement..."
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                ></textarea>
                            </div>
                            
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block ml-1">Dimensions</label>
                                    <div className="relative">
                                        <select 
                                            value={`${aspectRatio}`}
                                            onChange={(e) => setAspectRatio(e.target.value)}
                                            className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl py-3 pl-3 pr-8 text-xs text-white/90 focus:ring-1 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="1:1">1024 x 1024 (1:1)</option>
                                            <option value="16:9">1920 x 1080 (16:9)</option>
                                            <option value="9:16">1080 x 1920 (9:16)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-white/50 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                <div className="relative flex-1">
                                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block ml-1">Style</label>
                                    <div className="relative">
                                        <select 
                                            value={imageStyle}
                                            onChange={(e) => setImageStyle(e.target.value)}
                                            className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl py-3 pl-3 pr-8 text-xs text-white/90 focus:ring-1 focus:ring-blue-500 outline-none"
                                        >
                                            <option>Realistic</option>
                                            <option>Cyberpunk</option>
                                            <option>Anime</option>
                                            <option>Oil Painting</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-white/50 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerateImage}
                                disabled={isGenerating || !imagePrompt}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-sm font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 mt-2 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>Generating... <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span></>
                                ) : (
                                    <>Generate Artwork <span className="material-symbols-outlined text-[18px]">auto_awesome</span></>
                                )}
                            </button>

                            {/* Recent Generations Strip */}
                            <div className="pt-4 border-t border-white/10 mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Recent Generations</p>
                                    <button className="text-[10px] text-blue-400 hover:text-white transition-colors">View All</button>
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {generatedImage && (
                                         <div className="shrink-0 size-16 rounded-xl bg-cover bg-center border border-white/20 shadow-lg ring-2 ring-blue-500" style={{backgroundImage: `url("${generatedImage}")`}}></div>
                                    )}
                                    <div className="shrink-0 size-16 rounded-xl bg-cover bg-center border border-white/10 shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwKf92YG9CNHpeyvlYe-XYQVQ29WbQneZnsb2Mkg9kiNp691dpEG5EUvTF_QK3emWSewcSn_-Ia1U6OBoz-WEAZb8QKG6Z2dtBUb8NmGOVx_7TEwy87OMxIFY3Yl_-1L3_njgTICUvAb243Qyeq5JMXVJIilj7MIaDt7rjz-DX8XWVdWwgqPEqyWH_fWMqCB4SvsaTzM6BVhcStXja1lJy3S0292Bayz-s0E_jxNApYYXpmym4QWqQhOYuBaturTmK0NkH8QWaW7cg")'}}></div>
                                    <div className="shrink-0 size-16 rounded-xl bg-cover bg-center border border-white/10 shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQPwe0LZmWufuSlGVYGTtfWiT5zGcd-G13TcySjh931fU4Q_NM7L_rkZEv2QkrlBwMH3Jm8CnSZp7q_oSkbD9cI7FgXgCK7C02HGnGv3GV6dTaWjcqgb2OWDjiYIelloS9no9MMN5ALeLP_wW1nhk1fS8aLtwfsD7oAPIWjo5Z7BcbEJ7GBRtfUXA5-JxDYeJXnUq5NqmQ-pauaPIMIkMUZgUJ1asbv324dgqY3roFS1bMR1DtU_UgewU8h8PbKd3nKEc_9IJYHMDl")'}}></div>
                                    <div className="shrink-0 size-16 rounded-xl bg-cover bg-center border border-white/10 shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbY8iC-9H-l7bhE0Mg2XzcfHCKytvVlVnYUXZn8XCKMHPripAE71XCYt3iz1_AWRMZUMTdekvJlWEPxZfkwgJ4XCHi11_Qypooeoyt5QPOLJ3oj8kjbY7h1amdbvfOp0Ti5lCOenfQzAisPDev5d3N_lPIPvVoLwSXjSLP95l9sCEFdtgA-36Wq9BeRDgBx3KDotHcVqyVWFOcTbfs-n9EtIgmkKuHzgKKFpkvicsmHUiO38YyBWmNweZb3Ur9bzKsVJFJWxm5gnWF")'}}></div>
                                    <button className="shrink-0 size-16 rounded-xl border border-white/10 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors gap-1 text-white/50 hover:text-white">
                                        <span className="material-symbols-outlined text-[20px]">history</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Showcase */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Community Showcase</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-800 relative group overflow-hidden shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_dFgkL4AHj_tJF0YDC61Fu5B5GZo6Pm9jwMu5IfTcap01fuGeZYnOTdLbGF1gUaUjOHSHHC_QWFxnfioj0Tup-4jY_JGkDqYUdLiv_1p3_rrK5QhRHZlvc7-BWcLk45Sn2ANJnLCI0sc6S7_NtRmFzmz-LVd3ujm_lAbbcTKkvyi4gwXxUytKf-QQrUOGSSZRkc_UstnlgXrdnaYu7b1qfnrTJoAYildjLFONIVQEdQRr_J-7FY6bPSRY-C1mXIeTw8g6tYjFA86n")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <p className="text-xs font-bold line-clamp-1">Neon Streets</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-white/70">@alex_ui</span>
                                        <button className="text-white/70 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">favorite</span></button>
                                    </div>
                                </div>
                            </div>
                            <div className="aspect-[3/4] rounded-xl bg-slate-200 dark:bg-slate-800 relative group overflow-hidden shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQPwe0LZmWufuSlGVYGTtfWiT5zGcd-G13TcySjh931fU4Q_NM7L_rkZEv2QkrlBwMH3Jm8CnSZp7q_oSkbD9cI7FgXgCK7C02HGnGv3GV6dTaWjcqgb2OWDjiYIelloS9no9MMN5ALeLP_wW1nhk1fS8aLtwfsD7oAPIWjo5Z7BcbEJ7GBRtfUXA5-JxDYeJXnUq5NqmQ-pauaPIMIkMUZgUJ1asbv324dgqY3roFS1bMR1DtU_UgewU8h8PbKd3nKEc_9IJYHMDl")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <p className="text-xs font-bold line-clamp-1">Cyber Monk</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-white/70">@sarah_art</span>
                                        <button className="text-white/70 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">favorite</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Studio;
