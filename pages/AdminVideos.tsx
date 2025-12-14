
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { Video } from '../types';

const AdminVideos = () => {
  const { videos, addVideo, deleteVideo } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    sourceType: 'youtube' as 'youtube' | 'upload',
    youtubeUrl: '',
    category: 'Tutorial',
    channelName: 'Admin',
    thumbnail: '',
  });

  // To hold the file objects before processing
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalVideoId = '';
    let finalVideoUrl = '';
    let finalThumbnail = formData.thumbnail;

    // Handle Source Logic
    if (formData.sourceType === 'youtube') {
        finalVideoId = getYoutubeId(formData.youtubeUrl);
        if (!finalVideoId) {
            alert("Invalid YouTube URL");
            return;
        }
        // Auto thumbnail if not provided
        if (!finalThumbnail && !thumbnailFile) {
            finalThumbnail = `https://img.youtube.com/vi/${finalVideoId}/mqdefault.jpg`;
        }
    } else {
        // Handle File Upload for Video
        if (videoFile) {
            finalVideoUrl = URL.createObjectURL(videoFile);
        } else {
            alert("Please select a video file");
            return;
        }
    }

    // Handle Thumbnail File
    if (thumbnailFile) {
        finalThumbnail = URL.createObjectURL(thumbnailFile);
    } else if (!finalThumbnail && formData.sourceType === 'upload') {
        // Fallback for uploaded videos without thumbnail
        finalThumbnail = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.title)}&background=random`;
    }

    const newVideo: Video = {
      id: `vid-${Date.now()}`,
      videoId: finalVideoId,
      videoUrl: finalVideoUrl,
      sourceType: formData.sourceType,
      title: formData.title,
      thumbnail: finalThumbnail,
      channelName: formData.channelName || 'Admin',
      channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.channelName || 'Admin')}&background=000&color=fff`,
      views: 'New',
      duration: 'Unknown',
      publishedAt: 'Just Now',
      category: formData.category,
      searchQuery: formData.title // Fallback
    };

    addVideo(newVideo);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
        title: '',
        sourceType: 'youtube',
        youtubeUrl: '',
        category: 'Tutorial',
        channelName: 'Admin',
        thumbnail: '',
    });
    setVideoFile(null);
    setThumbnailFile(null);
  };

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Video Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <div key={video.id} className="bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden flex flex-col">
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                            {video.sourceType === 'upload' ? 'UPLOADED' : 'YOUTUBE'}
                        </span>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">{video.title}</h3>
                             <button onClick={() => deleteVideo(video.id)} className="text-slate-400 hover:text-red-500">
                                <span className="material-symbols-outlined">delete</span>
                             </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{video.channelName} • {video.category}</p>
                        <p className="text-xs text-slate-400 truncate">{video.videoId ? `ID: ${video.videoId}` : 'Local File'}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* FAB */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-6 size-14 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 flex items-center justify-center hover:scale-105 transition-transform z-40"
        >
            <span className="material-symbols-outlined text-[32px]">add</span>
        </button>

        {/* Add Video Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload New Video">
             <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Title</label>
                    <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500" 
                        placeholder="e.g. How to use Gemini AI"
                    />
                </div>

                {/* Source Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Source Type</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-3 rounded-xl border cursor-pointer transition-all ${formData.sourceType === 'youtube' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name="sourceType" 
                                    value="youtube" 
                                    checked={formData.sourceType === 'youtube'} 
                                    onChange={() => setFormData({...formData, sourceType: 'youtube'})}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold text-slate-900 dark:text-white">YouTube Link</span>
                            </div>
                        </label>
                        <label className={`flex-1 p-3 rounded-xl border cursor-pointer transition-all ${formData.sourceType === 'upload' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    name="sourceType" 
                                    value="upload" 
                                    checked={formData.sourceType === 'upload'} 
                                    onChange={() => setFormData({...formData, sourceType: 'upload'})}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <span className="font-bold text-slate-900 dark:text-white">Upload Media</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Conditional Inputs */}
                {formData.sourceType === 'youtube' ? (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">YouTube URL</label>
                        <input 
                            value={formData.youtubeUrl}
                            onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500" 
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video File (MP4, WebM)</label>
                        <input 
                            type="file" 
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                        />
                        <p className="text-xs text-slate-400 mt-1">Note: Uploads are stored in browser memory only.</p>
                    </div>
                )}

                {/* Thumbnail Upload */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thumbnail (Optional)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" 
                    />
                </div>

                {/* Category & Channel */}
                <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                         <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                         >
                            <option>Tutorial</option>
                            <option>LLMs</option>
                            <option>Image Gen</option>
                            <option>Video Gen</option>
                            <option>Coding</option>
                            <option>Productivity</option>
                         </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Channel Name</label>
                        <input 
                            value={formData.channelName}
                            onChange={e => setFormData({...formData, channelName: e.target.value})}
                            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" 
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-3 mt-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                    Upload Video
                </button>
             </form>
        </Modal>
    </div>
  );
};

export default AdminVideos;
