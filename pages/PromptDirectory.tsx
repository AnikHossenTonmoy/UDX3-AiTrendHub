
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Prompt } from '../types';

const PromptDirectory = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<'Trending' | 'New' | 'Top'>('Trending');
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('trendhub_saved_prompts');
    if (saved) {
      try {
        setSavedPromptIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to load saved prompts", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['All', 'Marketing', 'Social Media', 'Coding', 'Business', 'Writing', 'Art', 'Audio Generation', 'Video Generation'];

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(savedPromptIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSavedPromptIds(next);
    localStorage.setItem('trendhub_saved_prompts', JSON.stringify(Array.from(next)));
  };

  const filteredAndSortedPrompts = useMemo(() => {
    const filtered = prompts.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (activeSort === 'Trending') return b.views - a.views;
      if (activeSort === 'Top') return b.likes - a.likes;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [prompts, selectedCategory, searchQuery, activeSort]);

  const handlePromptClick = (promptId: string) => {
    navigate(`/prompts/${promptId}`);
  };

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <style>{`
        .prompt-filter-sticky {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .prompt-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              Discover the Perfect <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">AI Prompt</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Explore thousands of proven prompts for every AI tool. Copy, customize, and create amazing results instantly.
            </p>

            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-8 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
              ✨ Updated Daily • 10,000+ Active Prompts
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, or tags..."
                className="w-full pl-12 pr-6 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 shadow-sm dark:shadow-lg"
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 transform ${
                    selectedCategory === category
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FILTER & SORT BAR */}
        <div className={`transition-all duration-300 ${isSticky ? 'prompt-filter-sticky sticky top-16 md:top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 mb-8 shadow-sm' : 'mb-8 mt-6'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
              {['Trending', 'New', 'Top'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSort(tab as 'Trending' | 'New' | 'Top')}
                  className={`relative pb-3 px-1 text-sm font-semibold transition-all duration-300 ${
                    activeSort === tab
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                  {activeSort === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredAndSortedPrompts.length === 0 ? 'No' : filteredAndSortedPrompts.length} result{filteredAndSortedPrompts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* PROMPT GRID */}
        {filteredAndSortedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredAndSortedPrompts.map((prompt, index) => {
              const isSaved = savedPromptIds.has(prompt.id);
              const [isCopied, setIsCopied] = useState(false);

              const handleCopy = (e: React.MouseEvent) => {
                e.stopPropagation();
                navigator.clipboard.writeText(prompt.content);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              };

              return (
                <div
                  key={prompt.id}
                  className="prompt-card group cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handlePromptClick(prompt.id)}
                >
                  <div className="h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-900/20 overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                        {prompt.category}
                      </span>
                      <button
                        onClick={(e) => toggleSave(e, prompt.id)}
                        className={`transition-all duration-300 transform hover:scale-110 ${
                          isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill-1' : ''}`}>
                          bookmark
                        </span>
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {prompt.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                      {prompt.description}
                    </p>

                    <div className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-4">
                      {prompt.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-full whitespace-nowrap border border-slate-200 dark:border-slate-600/50"
                        >
                          #{tag}
                        </span>
                      ))}
                      {prompt.tags.length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-slate-500 px-2 py-1 flex items-center">
                          +{prompt.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5" title="Views">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          {prompt.views >= 1000 ? `${(prompt.views / 1000).toFixed(1)}k` : prompt.views}
                        </span>
                        <span className="flex items-center gap-1.5" title="Likes">
                          <span className="material-symbols-outlined text-[16px]">favorite</span>
                          {prompt.likes >= 1000 ? `${(prompt.likes / 1000).toFixed(1)}k` : prompt.likes}
                        </span>
                      </div>

                      <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
                          isCopied
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                        }`}
                      >
                        {isCopied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 md:py-32 px-4 text-center">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <span className="material-symbols-outlined text-5xl text-slate-400">search_off</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No prompts found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              {searchQuery && selectedCategory !== 'All'
                ? `No prompts match "${searchQuery}" in the ${selectedCategory} category.`
                : searchQuery
                ? `We couldn't find any prompts matching "${searchQuery}". Try different keywords.`
                : `No prompts available in the ${selectedCategory} category yet.`}
            </p>
            <div className="inline-flex gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                Clear Filters
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
              >
                Back to Top
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptDirectory;
