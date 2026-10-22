import React, { useState, useRef, useEffect } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Music,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Video } from '../types/youtube';

interface ShortsViewProps {
  videos: Video[];
  onShare: (video: Video) => void;
  onSelectVideo: (video: Video) => void;
}

export const ShortsView: React.FC<ShortsViewProps> = ({ videos, onShare, onSelectVideo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [shortsComments, setShortsComments] = useState<Record<string, string[]>>({});

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentShort = videos[currentIndex % videos.length];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleLike = () => {
    const id = currentShort.id;
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesState((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentShort.likes) + (isLiked ? -1 : 1),
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const id = currentShort.id;
    setShortsComments((prev) => ({
      ...prev,
      [id]: [commentText.trim(), ...(prev[id] || [])],
    }));
    setCommentText('');
  };

  const currentLikes = likesState[currentShort.id] ?? currentShort.likes;
  const isCurrentLiked = likedMap[currentShort.id];
  const customComments = shortsComments[currentShort.id] || [];

  return (
    <div className="flex-1 flex items-center justify-center py-6 px-4 relative select-none">
      <div className="flex items-center gap-4 max-w-full">
        {/* Main 9:16 Vertical Video Frame */}
        <div className="relative w-[340px] sm:w-[380px] h-[640px] bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#E5E7EB] group">
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            poster={currentShort.thumbnailUrl}
            loop
            playsInline
            muted={isMuted}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Top Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <button
              onClick={togglePlay}
              className="p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Center Play Button if paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#E1002D] text-white flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Information Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10 drop-shadow-md">
            {/* Channel Info */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={currentShort.channel.avatar}
                alt={currentShort.channel.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white"
              />
              <span className="text-xs font-bold truncate">{currentShort.channel.name}</span>
              {currentShort.channel.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
              )}
              <button className="ml-2 px-3 py-1 bg-white text-black font-bold text-[11px] rounded-full hover:bg-neutral-200 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-2">
              {currentShort.title}
            </h3>

            {/* Audio attribution banner */}
            <div className="flex items-center gap-2 text-[11px] text-white/90">
              <Music className="w-3 h-3 text-[#065FD4]" />
              <span className="truncate">Original Audio · {currentShort.channel.name}</span>
            </div>
          </div>
        </div>

        {/* Right Vertical Action Buttons Rail */}
        <div className="flex flex-col items-center gap-4">
          {/* Like */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleLike}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isCurrentLiked
                  ? 'bg-[#065FD4] text-white shadow-md'
                  : 'bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F]'
              }`}
              title="Like"
            >
              <ThumbsUp className={`w-5 h-5 ${isCurrentLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[11px] font-bold text-[#0F0F0F] mt-1 tabular-nums">
              {(currentLikes).toLocaleString()}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center">
            <button
              className="w-11 h-11 rounded-full bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F] flex items-center justify-center transition-colors"
              title="Dislike"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-[#0F0F0F] mt-1">Dislike</span>
          </div>

          {/* Comments Drawer Toggle */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
              className="w-11 h-11 rounded-full bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F] flex items-center justify-center transition-colors"
              title="Comments"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-bold text-[#0F0F0F] mt-1 tabular-nums">
              {currentShort.commentsCount + customComments.length}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onShare(currentShort)}
              className="w-11 h-11 rounded-full bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F] flex items-center justify-center transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-[#0F0F0F] mt-1">Share</span>
          </div>

          {/* Navigation Up & Down buttons */}
          <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-[#E5E7EB]">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E7EB] text-[#0F0F0F] flex items-center justify-center shadow-xs transition-colors"
              title="Previous short"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E7EB] text-[#0F0F0F] flex items-center justify-center shadow-xs transition-colors"
              title="Next short"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Comments Drawer */}
      {showCommentsDrawer && (
        <div className="absolute right-4 bottom-6 top-6 w-80 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-4 flex flex-col z-30 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <h4 className="text-sm font-bold text-[#0F0F0F]">Shorts Comments</h4>
            <button
              onClick={() => setShowCommentsDrawer(false)}
              className="p-1 hover:bg-[#F2F2F2] rounded-full text-[#606060]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {customComments.map((text, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#065FD4] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  U
                </div>
                <div>
                  <span className="font-bold text-[#0F0F0F]">You</span>
                  <p className="text-[#0F0F0F] mt-0.5">{text}</p>
                </div>
              </div>
            ))}
            {currentShort.comments?.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-xs">
                <img src={c.authorAvatar} alt={c.author} className="w-6 h-6 rounded-full object-cover shrink-0" />
                <div>
                  <span className="font-bold text-[#0F0F0F]">{c.author}</span>
                  <p className="text-[#0F0F0F] mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="pt-2 border-t border-[#E5E7EB] flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#F9F9F9] border border-[#E5E7EB] rounded-full outline-hidden focus:border-[#065FD4]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-1.5 bg-[#000000] text-[#065FD4] text-xs font-bold rounded-full disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
