import React from 'react';

const Settings = () => {
  return (
    <div className="p-6 pb-24">
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-[18px]">palette</span> Branding
         </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">tune</span> General
         </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">shield</span> System
         </button>
      </div>

      <div className="space-y-6">
        {/* Branding */}
        <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Identity</h3>
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-slate-200 dark:border-dark-border">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                             <span className="material-symbols-outlined text-[32px]">image</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">App Logo</p>
                            <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">Upload</button>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">Accent Color</p>
                    <div className="flex gap-3">
                        {['#135bec', '#101828', '#7f56d9', '#079455', '#f04438'].map(color => (
                            <button 
                                key={color}
                                className="size-8 rounded-full border-2 border-white dark:border-dark-surface ring-2 ring-transparent focus:ring-blue-500 shadow-sm transition-all"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* System */}
         <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">System & Security</h3>
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                         <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                             <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                         </div>
                         <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin Roles</p>
                            <p className="text-xs text-slate-500">3 active administrators</p>
                         </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                 <div className="p-4 flex items-center justify-between">
                    <div>
                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Maintenance Mode</p>
                         <p className="text-xs text-slate-500">Disable access for users</p>
                    </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                 </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
