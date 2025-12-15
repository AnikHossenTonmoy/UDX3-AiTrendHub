
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CategoryPrompts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { prompts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Map route ID to display title and filter logic
  const getCategoryInfo = (id: string) => {
      switch(id) {
          case 'marketing-seo':
              return {
                  title: 'Digital Marketing & SEO Prompts',
                  subtitle: 'Comprehensive marketing strategies, SEO optimization, and digital growth tactics to dominate your market.',
                  badge: '1,250+ Professional Prompts Available',
                  filters: ['SEO Optimization', 'Content Marketing', 'Social Media Marketing', 'Analytics & Tracking', 'Lead Generation', 'Conversion Optimization', 'Email Marketing', 'PPC Advertising', 'Influencer Marketing', 'Marketing Automation']
              };
          case 'social-media':
              return {
                  title: 'Social Media Strategy Prompts',
                  subtitle: 'Viral hooks, engagement tactics, and content calendars for all major platforms including TikTok, Instagram, and LinkedIn.',
                  badge: '800+ Strategy Prompts Available',
                  filters: ['Instagram', 'LinkedIn', 'Twitter/X', 'TikTok', 'YouTube', 'Facebook', 'Pinterest', 'Content Calendar', 'Viral Hooks', 'Engagement', 'Influencer Outreach']
              };
          case 'coding':
              return {
                  title: 'Programming & Code Prompts',
                  subtitle: 'Generate code, debug errors, and architect systems with expert developer prompts for Python, JS, React, and more.',
                  badge: '5,000+ Coding Prompts Available',
                  filters: ['Python', 'JavaScript', 'React', 'HTML/CSS', 'SQL', 'Debugging', 'System Design', 'API Integration', 'DevOps', 'Data Science', 'Web Scraping']
              };
          case 'business':
              return {
                  title: 'Business & Startup Prompts',
                  subtitle: 'Accelerate your business growth with prompts for planning, strategy, management, and scaling operations.',
                  badge: '3,000+ Business Prompts Available',
                  filters: ['Business Plan', 'Startup', 'Management', 'Strategy', 'Sales', 'Productivity', 'Finance', 'HR', 'Pitch Decks', 'Market Research']
              };
          case 'branding':
              return {
                  title: 'Branding & Copywriting Prompts',
                  subtitle: 'Craft compelling brand stories, taglines, and persuasive copy that converts visitors into loyal customers.',
                  badge: '2,500+ Branding Prompts Available',
                  filters: ['Copywriting', 'Brand Identity', 'Storytelling', 'Taglines', 'Product Descriptions', 'Email Copy', 'Ad Copy', 'Landing Pages', 'Press Releases']
              };
          case 'art':
          case 'image-generation':
              return {
                  title: 'AI Image Generation Prompts',
                  subtitle: 'Unleash your visual creativity with high-fidelity prompts for Midjourney, DALL-E 3, Stable Diffusion, and Adobe Firefly.',
                  badge: '6,600+ Art Prompts Available',
                  filters: ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Photorealistic', 'Anime Style', '3D Render', 'Logo Design', 'Concept Art', 'Cyberpunk', 'Cinematic', 'Vector Art']
              };
          case 'video-generation':
              return {
                  title: 'AI Video Generation Prompts',
                  subtitle: 'Create cinematic videos, animations, and dynamic scenes with prompts optimized for Sora, Runway Gen-2, and Pika Labs.',
                  badge: '7,700+ Video Prompts Available',
                  filters: ['Sora', 'Runway Gen-2', 'Pika Labs', 'Cinematic', 'Animation', 'Drone Shot', 'Time-Lapse', 'Slow Motion', 'Character Action', 'Abstract', 'Commercial']
              };
          case 'music-generation':
              return {
                  title: 'AI Music Generation Prompts',
                  subtitle: 'Compose original soundtracks, beats, and songs with prompts designed for Suno, Udio, and other AI audio tools.',
                  badge: '4,000+ Audio Prompts Available',
                  filters: ['Suno', 'Udio', 'Lo-Fi', 'Orchestral', 'Electronic', 'Jazz', 'Rock', 'Ambient', 'Hip Hop', 'Sound Effects', 'Voiceover']
              };
          default:
              return {
                  title: `${id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Prompts`,
                  subtitle: 'Explore our curated collection of AI prompts.',
                  badge: 'Professional Prompts',
                  filters: []
              };
      }
  };

  const categoryInfo = getCategoryInfo(categoryId || '');
  const [activeSubFilter, setActiveSubFilter] = useState('All Prompts');

  // Filter Logic
  const filteredPrompts = prompts.filter(p => {
      // Basic Category Match
      let matchesCategory = false;
      if (categoryId === 'marketing-seo') {
          matchesCategory = p.category === 'Marketing' || p.category === 'SEO' || p.category === 'Business';
      } else if (categoryId === 'coding') {
          matchesCategory = p.category === 'Coding';
      } else if (categoryId === 'social-media') {
          matchesCategory = p.category === 'Social Media' || p.category === 'Marketing';
      } else if (categoryId === 'branding') {
          matchesCategory = p.category === 'Branding' || p.category === 'Writing' || p.category === 'Marketing';
      } else if (categoryId === 'business') {
          matchesCategory = p.category === 'Business' || p.category === 'Productivity';
      } else if (categoryId === 'art' || categoryId === 'image-generation') {
          matchesCategory = p.category === 'Art' || p.category === 'Image Generation';
      } else if (categoryId === 'video-generation') {
          matchesCategory = p.category === 'Video Generation';
      } else if (categoryId === 'music-generation') {
          matchesCategory = p.category === 'Audio Generation';
      } else {
          // Fallback fuzzy match
          matchesCategory = p.category.toLowerCase().includes((categoryId || '').replace('-', ' '));
      }

      // Search Match
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Sub Filter Match (Mock logic - in real app, tags would need to align perfectly)
      const matchesSubFilter = activeSubFilter === 'All Prompts' ? true : true; // Simplified for demo

      return matchesCategory && matchesSearch && matchesSubFilter;
  });

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/prompts')}
                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">Back to Categories</span>
            </button>

            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
                    <span className="material-symbols-outlined text-blue-400 text-[18px]">
                        {categoryId?.includes('video') ? 'videocam' : categoryId?.includes('music') ? 'music_note' : categoryId?.includes('image') || categoryId === 'art' ? 'image' : 'trending_up'}
                    </span>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{categoryInfo.title.split('Prompts')[0]}</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
                    {categoryInfo.title}
                </h1>
                
                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                    {categoryInfo.subtitle}
                </p>

                <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-bold">
                    <span className="material-symbols-outlined text-[20px] mr-2">auto_awesome</span>
                    {categoryInfo.badge}
                </div>
            </div>

            {/* Browse by Category (Pills) */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">category</span>
                    Browse by Category
                </div>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => setActiveSubFilter('All Prompts')}
                        className={`px-5 py-2.5 rounded-lg border text-sm font-bold transition-all ${activeSubFilter === 'All Prompts' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                        <span className="mr-2">🌐</span> All Prompts
                    </button>
                    {categoryInfo.filters.map((filter, i) => (
                        <button 
                            key={i}
                            onClick={() => setActiveSubFilter(filter)}
                            className={`px-5 py-2.5 rounded-lg border text-sm font-bold transition-all bg-slate-900 border-slate-800 text-slate-400 hover:border-blue-500/50 hover:text-white`}
                        >
                            {/* Simple icon mapping based on index/random for visual flair */}
                            <span className="mr-2 text-blue-500">
                                {i % 4 === 0 ? '✨' : i % 4 === 1 ? '🚀' : i % 4 === 2 ? '💡' : '🔍'}
                            </span>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-12 relative group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all opacity-0 group-hover:opacity-100"></div>
                <div className="relative flex items-center bg-[#0B0F19] border border-slate-800 rounded-2xl p-2 transition-all focus-within:border-blue-500/50 focus-within:ring-1 ring-blue-500/50">
                    <div className="pl-4 text-slate-500">
                        <span className="material-symbols-outlined text-2xl">search</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder={`Search ${categoryInfo.title}...`} 
                        className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg h-12"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-2.5 font-bold transition-colors hidden sm:block">
                        Search
                    </button>
                </div>
            </div>

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt) => (
                     <div 
                        key={prompt.id} 
                        onClick={() => navigate(`/prompts/${prompt.id}`)}
                        className="group relative bg-[#151b2b] rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
                     >
                         {/* Gradient Hover Border Effect (Top Line) */}
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                         {/* Header */}
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                 <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400">
                                     <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                                     {prompt.model || 'AI'}
                                 </span>
                            </div>
                            <button 
                                onClick={(e) => handleCopy(e, prompt.content, prompt.id)}
                                className={`p-2 rounded-lg transition-all duration-200 shadow-sm ${
                                    copiedId === prompt.id 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-blue-600'
                                }`}
                                title="Copy Prompt"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {copiedId === prompt.id ? 'check' : 'content_copy'}
                                </span>
                            </button>
                         </div>

                         {/* Content */}
                         <div className="flex-1 mb-6">
                             <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                 {prompt.title}
                             </h3>
                             <div className="relative">
                                <p className="text-sm font-mono text-slate-400 bg-black/20 p-3 rounded-lg border border-slate-800/50 line-clamp-4 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                                    {prompt.content}
                                </p>
                                {/* Fade out effect for text */}
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-lg"></div>
                             </div>
                         </div>

                         {/* Footer */}
                         <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                             <span className="text-xs font-bold text-slate-500 px-2 py-1 bg-slate-800 rounded">
                                 {prompt.category}
                             </span>
                             <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                 <span className="flex items-center gap-1 hover:text-slate-300 transition-colors"><span className="material-symbols-outlined text-[14px]">visibility</span> {prompt.views}</span>
                                 <span className="flex items-center gap-1 hover:text-slate-300 transition-colors"><span className="material-symbols-outlined text-[14px]">thumb_up</span> {prompt.likes}</span>
                             </div>
                         </div>
                     </div>
                ))}
            </div>
            
            {/* Empty State */}
            {filteredPrompts.length === 0 && (
                 <div className="text-center py-24">
                     <div className="inline-flex items-center justify-center size-20 rounded-full bg-slate-800 mb-6">
                         <span className="material-symbols-outlined text-4xl text-slate-500">search_off</span>
                     </div>
                     <h2 className="text-xl font-bold text-white mb-2">No prompts found</h2>
                     <p className="text-slate-500">Try adjusting your search terms.</p>
                 </div>
            )}
        </div>
        
        {/* Floating Chat Button (matches ss) */}
        <div className="fixed bottom-6 left-6 z-50">
            <div className="bg-[#40E0D0] hover:bg-[#3BCBC0] text-black px-4 py-3 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all hover:scale-105">
                <div className="size-8 bg-purple-600 rounded-full overflow-hidden border-2 border-white">
                    <img src="https://ui-avatars.com/api/?name=AI&background=random" alt="Bot" />
                </div>
                <span>voice chat</span>
            </div>
        </div>
    </div>
  );
};

export default CategoryPrompts;
