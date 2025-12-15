import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
  selectedCategory: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, selectedCategory }) => {
  return (
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
          onClick={() => window.location.hash = '#/prompts'}
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
  );
};

export default EmptyState;
