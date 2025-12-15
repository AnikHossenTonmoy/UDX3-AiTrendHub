import React from 'react';

interface SortTabsProps {
  activeSort: 'Trending' | 'New' | 'Top';
  onSortChange: (sort: 'Trending' | 'New' | 'Top') => void;
}

const SortTabs: React.FC<SortTabsProps> = ({ activeSort, onSortChange }) => {
  const tabs = ['Trending', 'New', 'Top'] as const;

  return (
    <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSortChange(tab)}
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
  );
};

export default SortTabs;
