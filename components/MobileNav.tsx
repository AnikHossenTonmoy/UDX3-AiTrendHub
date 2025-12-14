import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  
  // Only show Mobile Nav on Admin pages
  if (!location.pathname.startsWith('/admin')) return null;

  const navItems = [
    { icon: 'dashboard', label: 'Dash', path: '/admin' },
    { icon: 'grid_view', label: 'Tools', path: '/admin/tools' },
    { icon: 'settings', label: 'Config', path: '/admin/settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-lg border-t border-slate-200 dark:border-dark-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;