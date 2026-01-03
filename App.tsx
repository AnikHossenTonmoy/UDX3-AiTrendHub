import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import PublicMobileNav from './components/PublicMobileNav';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import Discovery from './pages/Discovery';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PromptDirectory from './pages/PromptDirectory';
import PromptDetails from './pages/PromptDetails';
import CategoryPrompts from './pages/CategoryPrompts';
import PublicTools from './pages/PublicTools';
import ToolDetails from './pages/ToolDetails';
import AdminPrompts from './pages/AdminPrompts';
import AIVideos from './pages/AIVideos';
import AdminVideos from './pages/AdminVideos';
import AdminUsers from './pages/AdminUsers';
import SavedCollection from './pages/SavedCollection';
import Studio from './pages/Studio';
import Loader from './components/Loader';
import AuthModal from './components/AuthModal';
import Maintenance from './pages/Maintenance';
import { useData } from './context/DataContext';
import { useAuth } from './context/AuthContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protect Admin routes
const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  const getPageTitle = (path: string) => {
    if (path.includes('tools')) return 'Tools Management';
    if (path.includes('prompts')) return 'Prompt Management';
    if (path.includes('videos')) return 'Video Management';
    if (path.includes('users')) return 'User Management';
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

const PublicLayout = () => {
  const { maintenanceMode } = useData();
  if (maintenanceMode) return <Maintenance />;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 pb-20 md:pb-0">
        <Navbar />
        <main>
            <Outlet />
        </main>
        <PublicMobileNav />
        <AuthModal />
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
         <Route path="/" element={<Discovery />} />
         <Route path="/prompts" element={<PromptDirectory />} />
         <Route path="/prompts/:id" element={<PromptDetails />} />
         <Route path="/prompts/category/:categoryId" element={<CategoryPrompts />} />
         <Route path="/ai-tools" element={<PublicTools />} />
         <Route path="/ai-tools/:id" element={<ToolDetails />} />
         <Route path="/ai-videos-tuto" element={<AIVideos />} />
         <Route path="/saved" element={<SavedCollection />} />
         <Route path="/studio" element={<Studio />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tools" element={<Tools />} />
        <Route path="prompts" element={<AdminPrompts />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="users" element={<AdminUsers />} /> 
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f8fafc] dark:bg-[#101622]">
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