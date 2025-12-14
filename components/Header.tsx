
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border px-6 py-4 flex items-center justify-between md:ml-64 transition-all duration-300">
      <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="hidden sm:flex relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-dark-surface border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-bg"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
