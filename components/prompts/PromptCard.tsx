import React, { useState } from 'react';
import { Prompt } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onClick: () => void;
  index: number;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isSaved,
  onToggleSave,
  onClick,
  index
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="prompt-card group cursor-pointer"
      style={{
        animationDelay: `${index * 50}ms`
      }}
    >
      <div
        onClick={onClick}
        className="h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-900/20 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
            {prompt.category}
          </span>
          <button
            onClick={(e) => onToggleSave(e, prompt.id)}
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
};

export default PromptCard;
