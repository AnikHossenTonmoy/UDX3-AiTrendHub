
import React;
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
    { icon: 'grid_view', label: 'Tools', path: '/admin/tools' },
    { icon: 'lightbulb', label: 'Prompts', path: '/admin/prompts' },
    { icon: 'smart_display', label: 'Videos', path: '/admin/videos' },
    { icon: 'group', label: 'Users', path: '/admin/users' },
    { icon: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
        </div>
        <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
      </div>

      <div className="px-4 mb-2">
        <NavLink 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-dashed border-slate-200 dark:border-slate-700"
        >
            <span className="material-symbols-outlined text-[20px]">public</span>
            View Live Site
        </NavLink>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">Management</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-dark-border">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <img
            src="https://picsum.photos/seed/admin/100"
            alt="Admin"
            className="size-10 rounded-full object-cover ring-2 ring-white dark:ring-dark-surface"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Alex Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">alex@udx3.ai</p>
          </div>
          <NavLink to="/admin-login" className="material-symbols-outlined text-slate-400 hover:text-red-500 transition-colors" title="Logout">logout</NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;