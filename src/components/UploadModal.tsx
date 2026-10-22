import React, { useState } from 'react';
import { X, UploadCloud, Film, CheckCircle2 } from 'lucide-react';
import { Video } from '../types/youtube';
import { TOPIC_CATEGORIES } from '../data/mockVideos';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newVideo: Video) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(TOPIC_CATEGORIES[1]);
  const [tags, setTags] = useState('tech, review, setup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `user-vid-${Date.now()}`;
      const video: Video = {
        id: generatedId,
        title: title.trim(),
        description: description.trim() || 'Uploaded via YouTube Light Studio.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '11:20',
        durationSec: 680,
        views: 1,
        viewsFormatted: '1 view',
        uploadedAt: 'Just now',
        category: category,
        likes: 1,
        dislikes: 0,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        commentsCount: 0,
        comments: [],
        channel: {
          id: 'user-channel',
          name: 'You (Creator)',
          handle: '@you_creator',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          subscribers: '124 subscribers',
          isSubscribed: false,
          isVerified: false,
        },
      };

      onUpload(video);
      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setDescription('');
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upload video"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-lg font-bold text-[#0F0F0F] flex items-center gap-2">
            <Film className="w-5 h-5 text-[#E1002D]" />
            Upload video
          </h2>
          <button
            onClick={onClose}
            aria-label="Close upload modal"
            className="p-1.5 text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-[#0F0F0F]">Video Published!</h3>
            <p className="text-sm text-[#606060] mt-1">Your video is now live on YouTube Light feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="border-2 border-dashed border-[#E5E7EB] hover:border-[#065FD4] rounded-xl p-6 flex flex-col items-center justify-center bg-[#F9F9F9] transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#065FD4] mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#0F0F0F]">Drag and drop video files to upload</p>
              <p className="text-xs text-[#606060] mt-0.5">Your videos will be private until you publish them.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider mb-1">
                Title (required)
              </label>
              <input
                type="text"
                required
                placeholder="Add a title that describes your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#0F0F0F] focus:outline-hidden focus:border-[#065FD4] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#0F0F0F] focus:outline-hidden focus:border-[#065FD4]"
                >
                  {TOPIC_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="tech, studio, 4k"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#0F0F0F] focus:outline-hidden focus:border-[#065FD4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#0F0F0F] focus:outline-hidden focus:border-[#065FD4] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-6 py-2 bg-[#000000] text-[#065FD4] hover:bg-[#111111] disabled:opacity-50 text-sm font-bold rounded-full transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#065FD4] border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
