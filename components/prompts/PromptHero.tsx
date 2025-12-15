import React, { useEffect, useState } from 'react';

interface PromptHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const PromptHero: React.FC<PromptHeroProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <section className={`bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 md:py-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center animate-fade-in">
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, description, or tags (e.g., 'Cyberpunk City', 'SEO Blog', 'React Component')..."
              className="w-full pl-12 pr-6 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 shadow-sm dark:shadow-lg"
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 transform ${
                  selectedCategory === category
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromptHero;
