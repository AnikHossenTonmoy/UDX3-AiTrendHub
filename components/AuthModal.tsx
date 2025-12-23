
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  const handleAction = (path: string) => {
    closeAuthModal();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#151b2b] w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="p-8 text-center relative z-10">
          <div className="size-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">lock_open</span>
          </div>
          
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Unlock Full Experience</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Join UDX3 today to save your favorite tools, use the AI Studio, and generate custom prompts.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleAction('/login')}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleAction('/signup')}
              className="w-full py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Create Free Account
            </button>
          </div>

          <button 
            onClick={closeAuthModal}
            className="mt-6 text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
