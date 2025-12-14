
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Maintenance = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
                 <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[80px]"></div>
             </div>

             <div className="relative z-10 max-w-lg w-full bg-white dark:bg-dark-surface p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 dark:border-dark-border text-center">
                 <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6">
                     <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 animate-spin-slow">settings</span>
                 </div>
                 
                 <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-3">We are under maintenance</h1>
                 <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                     We are currently making improvements to the AI TrendHub platform. We will be back shortly with new features and a better experience.
                 </p>

                 <div className="flex flex-col gap-4">
                     <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-1/3 rounded-full animate-indeterminate"></div>
                     </div>
                     <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">System Upgrade in Progress</p>
                 </div>

                 {/* Admin Bypass */}
                 <div className="mt-10 pt-6 border-t border-slate-100 dark:border-dark-border">
                     <button 
                        onClick={() => navigate('/admin-login')} 
                        className="text-sm font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1 mx-auto"
                     >
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        Admin Login
                     </button>
                 </div>
             </div>
             
             <style>{`
                @keyframes indeterminate {
                    0% { margin-left: -50%; width: 50%; }
                    100% { margin-left: 100%; width: 50%; }
                }
                .animate-indeterminate {
                    animation: indeterminate 1.5s infinite linear;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
             `}</style>
        </div>
    );
};

export default Maintenance;
