
import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#101622]/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <span className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">UDX3</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>Home</NavLink>
            <NavLink to="/prompts" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>Prompts</NavLink>
            <NavLink to="/ai-tools" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>Tools</NavLink>
            <NavLink to="/studio" className={({isActive}) => `text-sm font-bold transition-colors flex items-center gap-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>
                <span className="material-symbols-outlined text-[18px]">brush</span> Studio
            </NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
             <ThemeToggle />
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
             
             {!user ? (
               <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Sign In</Link>
                  <Link to="/signup" className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
                    Sign Up
                  </Link>
               </div>
             ) : (
               <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <img src={user.avatar} alt={user.name} className="size-8 rounded-full border border-slate-200 dark:border-slate-700" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                    <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
                  </button>

                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a2230] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-fadeIn">
                        <div className="p-3 border-b border-slate-50 dark:border-slate-800 mb-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged in as</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                        </div>
                        <Link to="/saved" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors" onClick={() => setShowProfileMenu(false)}>
                          <span className="material-symbols-outlined text-[20px]">bookmark</span>
                          My Collection
                        </Link>
                        {user.role === 'Admin' && (
                          <Link to="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors" onClick={() => setShowProfileMenu(false)}>
                            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-600 dark:text-red-400 transition-colors text-left"
                        >
                          <span className="material-symbols-outlined text-[20px]">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
               </div>
             )}
          </div>

          {/* Mobile Profile Icon */}
          <div className="flex md:hidden items-center gap-3">
             <ThemeToggle />
             {user ? (
               <img 
                src={user.avatar} 
                alt={user.name} 
                className="size-8 rounded-full border border-slate-200" 
                onClick={() => navigate('/saved')}
               />
             ) : (
               <button onClick={() => navigate('/login')} className="material-symbols-outlined text-slate-600 dark:text-slate-300">account_circle</button>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
