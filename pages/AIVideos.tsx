
import React, { useEffect, useState } from 'react';
import { GeminiBackend } from '../services/GeminiBackend';
import { Video } from '../types';
import { useData } from '../context/DataContext';

const AIVideos = () => {
    // Use videos from context (Source of Truth for Admin uploads + Initials)
    const { videos: contextVideos, addVideo } = useData();
    const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Playback State
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isResolvingId, setIsResolvingId] = useState(false);
    const [resolveError, setResolveError] = useState(false);

    // Initial load: Combine Context Videos + Fetch Gemini Recommendations
    useEffect(() => {
        const loadVideos = async () => {
            setLoading(true);
            try {
                // Fetch dynamic videos to keep the page fresh
                const fetchedVideos = await GeminiBackend.fetchVideoTutorials();
                
                // Combine context videos with fetched ones
                // Prefer context videos (admin/initial) at the top
                const combined = [...contextVideos];
                
                // Append unique fetched videos
                const existingTitles = new Set(contextVideos.map(v => v.title));
                fetchedVideos.forEach(v => {
                    if (!existingTitles.has(v.title)) {
                        combined.push(v);
                    }
                });

                setDisplayVideos(combined);

            } catch (e) {
                console.error("Error loading videos", e);
                setDisplayVideos(contextVideos);
            } finally {
                setLoading(false);
            }
        };

        loadVideos();
    }, [contextVideos]); // Re-run if admin adds a video

    const handleVideoClick = async (video: Video) => {
        // Reset states
        setResolveError(false);
        setSelectedVideo(video); // Open modal immediately

        // 1. If Uploaded File -> Ready to play
        if (video.sourceType === 'upload' && video.videoUrl) {
            setIsResolvingId(false);
            return;
        }

        // 2. If YouTube and has ID -> Ready to play
        if (video.videoId) {
            setIsResolvingId(false);
            return;
        }

        // 3. Needs Resolution (Search query based)
        setIsResolvingId(true);
        try {
            const query = video.searchQuery || `${video.title} ${video.channelName}`;
            console.log("Smart Resolving Video ID for:", query);
            const foundId = await GeminiBackend.findYoutubeId(query);
            
            if (foundId) {
                const updatedVideo = {
                    ...video,
                    videoId: foundId,
                    thumbnail: `https://img.youtube.com/vi/${foundId}/mqdefault.jpg`
                };
                setSelectedVideo(updatedVideo);
                // Also update local list so we don't resolve again
                setDisplayVideos(prev => prev.map(v => v.id === video.id ? updatedVideo : v));
            } else {
                setResolveError(true);
            }
        } catch (error) {
            console.error("Failed to resolve video ID", error);
            setResolveError(true);
        } finally {
            setIsResolvingId(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedVideo(null);
        setIsResolvingId(false);
        setResolveError(false);
    };

    const categories = ['All', 'LLMs', 'Image Gen', 'Video Gen', 'Coding', 'Productivity', 'Tutorial'];

    const filteredVideos = selectedCategory === 'All' 
        ? displayVideos 
        : displayVideos.filter(v => v.category.toLowerCase().includes(selectedCategory.toLowerCase()) || v.title.toLowerCase().includes(selectedCategory.toLowerCase()));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pb-20">
            {/* Hero */}
            <div className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider mb-6">
                         <span className="material-symbols-outlined text-[16px]">play_circle</span>
                         Tutorial Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-4">
                        Master AI with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Video Tutorials</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Curated video guides to help you build, design, and create with the latest Artificial Intelligence tools.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1600px] mx-auto px-6 mt-8">
                
                {/* Filter */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 justify-center">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                                selectedCategory === cat 
                                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                                : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                        <div 
                            key={video.id}
                            className="group bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                            onClick={() => handleVideoClick(video)}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.title)}&background=random&size=400` }}
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="size-12 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                                    </div>
                                </div>
                                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                                    {video.duration}
                                </span>
                                {video.sourceType === 'upload' && (
                                     <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                                        UPLOADED
                                    </span>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-4 flex gap-3 flex-1">
                                <img src={video.channelAvatar} className="size-9 rounded-full flex-shrink-0" alt={video.channelName} />
                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{video.channelName}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                        <span>{video.views}</span>
                                        <span>•</span>
                                        <span>{video.publishedAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        [1,2,3,4].map(i => (
                            <div key={`skel-${i}`} className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-border p-0">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                                <div className="p-4 flex gap-3">
                                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse flex-shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={handleCloseModal}>
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <button 
                            className="absolute top-4 right-4 z-10 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
                            onClick={handleCloseModal}
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                        
                        {isResolvingId ? (
                            <div className="text-center text-white">
                                <div className="size-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-lg font-bold">Connecting to Stream...</p>
                                <p className="text-sm text-white/60 mt-1">Locating best source via Gemini</p>
                            </div>
                        ) : resolveError ? (
                            <div className="text-center text-white p-8 max-w-md">
                                <span className="material-symbols-outlined text-5xl text-slate-500 mb-4">videocam_off</span>
                                <h3 className="text-2xl font-bold mb-2">Video Unavailable Inline</h3>
                                <p className="text-slate-400 mb-6">We couldn't load this video directly in the player.</p>
                                <a 
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedVideo.searchQuery || selectedVideo.title)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    <span className="material-symbols-outlined">open_in_new</span>
                                    Watch External
                                </a>
                            </div>
                        ) : selectedVideo.sourceType === 'upload' && selectedVideo.videoUrl ? (
                            // Native Video Player for Uploads
                            <video 
                                src={selectedVideo.videoUrl} 
                                controls 
                                autoPlay 
                                className="w-full h-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : selectedVideo.videoId ? (
                            // YouTube Iframe
                            <iframe 
                                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIVideos;
