
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <span className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">AI TrendHub</span>
          </div>

          {/* Desktop Nav - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>Home</NavLink>
            <NavLink to="/prompts" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>Prompts</NavLink>
            <NavLink to="/ai-tools" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>AI Tools</NavLink>
            <NavLink to="/ai-videos-tuto" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>AI Videos Tuto</NavLink>
            <NavLink to="/studio" className={({isActive}) => `text-sm font-medium transition-colors flex items-center gap-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>
                <span className="material-symbols-outlined text-[18px]">brush</span> Studio
            </NavLink>
            <NavLink to="/saved" className={({isActive}) => `text-sm font-medium transition-colors flex items-center gap-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>
                <span className="material-symbols-outlined text-[18px]">bookmark</span> Saved
            </NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
             <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <span className="material-symbols-outlined text-[24px]">search</span>
             </button>
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
             <button className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-transform">
                Submit Tool
             </button>
          </div>

          {/* Mobile Actions - Simplified Header */}
          <div className="flex md:hidden items-center gap-3">
             <button className="p-2 text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-[24px]">search</span>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
