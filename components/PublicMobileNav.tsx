
import React from 'react';
import { NavLink } from 'react-router-dom';

const PublicMobileNav = () => {
  const navItems = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'lightbulb', label: 'Prompts', path: '/prompts' },
    { icon: 'grid_view', label: 'Tools', path: '/ai-tools' },
    { icon: 'smart_display', label: 'Tutos', path: '/ai-videos-tuto' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-lg border-t border-slate-200 dark:border-dark-border z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 active:scale-95 ${
                isActive 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-1 rounded-xl transition-colors duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-1' : ''}`}>
                    {item.icon}
                    </span>
                </div>
                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default PublicMobileNav;
