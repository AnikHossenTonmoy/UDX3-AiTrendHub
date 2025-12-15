
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PromptHero from '../components/prompts/PromptHero';
import PromptGrid from '../components/prompts/PromptGrid';
import CategoryFilter from '../components/prompts/CategoryFilter';
import SortTabs from '../components/prompts/SortTabs';
import EmptyState from '../components/prompts/EmptyState';

const PromptDirectory = () => {
  const navigate = useNavigate();
  const { prompts } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<'Trending' | 'New' | 'Top'>('Trending');
  const [savedPromptIds, setSavedPromptIds] = useState<Set<string>>(new Set());
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('trendhub_saved_prompts');
    if (saved) {
      try {
        setSavedPromptIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to load saved prompts", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['All', 'Image Generation', 'Writing', 'Coding', 'Business', 'Social Media', 'Marketing', 'Productivity', 'Video'];

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(savedPromptIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSavedPromptIds(next);
    localStorage.setItem('trendhub_saved_prompts', JSON.stringify(Array.from(next)));
  };

  const filteredAndSortedPrompts = useMemo(() => {
    const filtered = prompts.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (activeSort === 'Trending') return b.views - a.views;
      if (activeSort === 'Top') return b.likes - a.likes;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [prompts, selectedCategory, searchQuery, activeSort]);

  const handlePromptClick = (promptId: string) => {
    navigate(`/prompts/${promptId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <style>{`
        .prompt-filter-sticky {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .prompt-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <PromptHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-300 ${isSticky ? 'prompt-filter-sticky sticky top-16 md:top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 mb-8 shadow-sm' : 'mb-8 mt-6'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SortTabs
              activeSort={activeSort}
              onSortChange={setActiveSort}
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredAndSortedPrompts.length === 0 ? 'No' : filteredAndSortedPrompts.length} result{filteredAndSortedPrompts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {filteredAndSortedPrompts.length > 0 ? (
          <PromptGrid
            prompts={filteredAndSortedPrompts}
            savedPromptIds={savedPromptIds}
            onToggleSave={toggleSave}
            onPromptClick={handlePromptClick}
          />
        ) : (
          <EmptyState searchQuery={searchQuery} selectedCategory={selectedCategory} />
        )}
      </div>
    </div>
  );
};

export default PromptDirectory;
