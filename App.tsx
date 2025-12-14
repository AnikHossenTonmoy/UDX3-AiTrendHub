
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav'; // Admin Mobile Nav
import PublicMobileNav from './components/PublicMobileNav'; // Public Mobile Nav
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import Discovery from './pages/Discovery';
import Settings from './pages/Settings';
import Login from './pages/Login';
import PromptDirectory from './pages/PromptDirectory';
import PromptDetails from './pages/PromptDetails';
import PublicTools from './pages/PublicTools';
import ToolDetails from './pages/ToolDetails';
import AdminPrompts from './pages/AdminPrompts';
import AIVideos from './pages/AIVideos';
import AdminVideos from './pages/AdminVideos';
import SavedCollection from './pages/SavedCollection';
import Studio from './pages/Studio';
import Loader from './components/Loader';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout for Admin Pages (Sidebar + Header)
const AdminLayout = () => {
  const location = useLocation();
  const getPageTitle = (path: string) => {
    if (path.includes('tools')) return 'Tools Management';
    if (path.includes('prompts')) return 'Prompt Management';
    if (path.includes('videos')) return 'Video Management';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header title={getPageTitle(location.pathname)} />
        <main className="flex-1 max-w-7xl mx-auto w-full mb-16 md:mb-0">
            <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

// Layout for Public Pages (Navbar top + Bottom Nav on Mobile)
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 pb-20 md:pb-0">
        <Navbar />
        <main>
            <Outlet />
        </main>
        <PublicMobileNav />
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
         <Route path="/" element={<Discovery />} />
         <Route path="/prompts" element={<PromptDirectory />} />
         <Route path="/prompts/:id" element={<PromptDetails />} />
         <Route path="/ai-tools" element={<PublicTools />} />
         <Route path="/ai-tools/:id" element={<ToolDetails />} />
         <Route path="/ai-videos-tuto" element={<AIVideos />} />
         <Route path="/saved" element={<SavedCollection />} />
         <Route path="/studio" element={<Studio />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin-login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tools" element={<Tools />} />
        <Route path="prompts" element={<AdminPrompts />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="settings" element={<Settings />} />
        {/* Fallback for admin sub-routes */}
        <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon</div>} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f8fafc] dark:bg-[#101622] transition-colors duration-300">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;
