import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Clock,
  ListPlus,
  Share2,
  BookmarkCheck,
  CheckCircle2,
  Ban,
  Check,
} from 'lucide-react';
import { Video } from '../types/youtube';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  onAddToWatchLater: (video: Video) => void;
  isInWatchLater?: boolean;
  onShare: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  onAddToWatchLater,
  isInWatchLater = false,
  onShare,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div
      className="flex flex-col group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Thumbnail Container (16:9, rounded-lg) */}
      <div
        onClick={() => onSelect(video)}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F2F2F2] border border-[#E5E7EB]/50"
      >
        {!imgError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-[#606060] p-4 text-center">
            <span className="text-xs font-medium line-clamp-2">{video.title}</span>
          </div>
        )}

        {/* Hover Quick Action Overlays (Top Right) */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-150 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onAddToWatchLater(video)}
            className={`w-7 h-7 rounded-md shadow-md flex items-center justify-center transition-colors ${
              isInWatchLater
                ? 'bg-[#065FD4] text-white'
                : 'bg-black/80 hover:bg-black text-white'
            }`}
            title={isInWatchLater ? 'Added to Watch Later' : 'Watch Later'}
          >
            {isInWatchLater ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onShare(video)}
            className="w-7 h-7 rounded-md bg-black/80 hover:bg-black text-white shadow-md flex items-center justify-center transition-colors"
            title="Share video"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Duration / Live Badge (Bottom Right) */}
        <div className="absolute bottom-2 right-2">
          {video.isLive ? (
            <span className="px-1.5 py-0.5 bg-[#E1002D] text-white text-[10px] font-bold rounded-xs uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-black/80 text-white text-[11px] font-medium rounded-[4px] tabular-nums font-mono">
              {video.duration}
            </span>
          )}
        </div>
      </div>

      {/* Video Metadata Row */}
      <div className="flex items-start gap-3 mt-3 px-0.5">
        {/* Channel Avatar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="shrink-0 mt-0.5"
          title={video.channel.name}
        >
          <img
            src={video.channel.avatar}
            alt={video.channel.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-[#E5E7EB] hover:opacity-90"
          />
        </button>

        {/* Info Column */}
        <div className="flex-1 min-w-0" onClick={() => onSelect(video)}>
          <h3
            className="text-sm font-semibold text-[#0F0F0F] line-clamp-2 leading-snug group-hover:text-[#065FD4] transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-xs text-[#606060] hover:text-[#0F0F0F]">
            <span className="truncate">{video.channel.name}</span>
            {video.channel.isVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#606060] shrink-0" />
            )}
          </div>

          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#606060] mt-0.5 font-normal">
            <span className="tabular-nums">{video.viewsFormatted}</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>

        {/* Three Dots Context Menu */}
        <div ref={menuRef} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors opacity-0 group-hover:opacity-100"
            aria-label="More video options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 w-48 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1.5 z-40 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  onAddToWatchLater(video);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-[#0F0F0F] hover:bg-[#F2F2F2] text-left transition-colors"
              >
                <Clock className="w-4 h-4 text-[#606060]" />
                <span>{isInWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}</span>
              </button>

              <button
                onClick={() => {
                  onShare(video);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-[#0F0F0F] hover:bg-[#F2F2F2] text-left transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#606060]" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-[#0F0F0F] hover:bg-[#F2F2F2] text-left transition-colors"
              >
                <ListPlus className="w-4 h-4 text-[#606060]" />
                <span>Add to queue</span>
              </button>

              <div className="h-[1px] bg-[#E5E7EB] my-1" />

              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-[#0F0F0F] hover:bg-[#F2F2F2] text-left transition-colors"
              >
                <Ban className="w-4 h-4 text-[#606060]" />
                <span>Not interested</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
