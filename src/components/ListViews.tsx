import React, { useState } from 'react';
import {
  Trash2,
  Play,
  Clock,
  ThumbsUp,
  Tv,
  Flame,
  Search,
  CheckCircle2,
  Library,
} from 'lucide-react';
import { Video, Channel, NavView } from '../types/youtube';
import { VideoCard } from './VideoCard';

interface ListViewsProps {
  view: NavView;
  videos: Video[];
  historyVideos: Video[];
  watchLaterVideos: Video[];
  likedVideos: Video[];
  channels: Channel[];
  onSelectVideo: (video: Video) => void;
  onClearHistory: () => void;
  onRemoveFromHistory: (id: string) => void;
  onToggleWatchLater: (video: Video) => void;
  onShare: (video: Video) => void;
}

export const ListViews: React.FC<ListViewsProps> = ({
  view,
  videos,
  historyVideos,
  watchLaterVideos,
  likedVideos,
  channels,
  onSelectVideo,
  onClearHistory,
  onRemoveFromHistory,
  onToggleWatchLater,
  onShare,
}) => {
  const [historySearch, setHistorySearch] = useState('');

  // 1. History View
  if (view === 'history') {
    const filteredHistory = historyVideos.filter((v) =>
      v.title.toLowerCase().includes(historySearch.toLowerCase())
    );

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl font-bold text-[#0F0F0F] flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#065FD4]" />
              Watch history
            </h1>
            <p className="text-xs text-[#606060] mt-1">
              Videos you have watched across your sessions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]" />
              <input
                type="text"
                placeholder="Search watch history"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-[#F9F9F9] border border-[#E5E7EB] rounded-full text-xs text-[#0F0F0F] outline-hidden focus:border-[#065FD4] w-48 sm:w-60"
              />
            </div>
            {historyVideos.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#D93025] text-xs font-semibold rounded-full transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear history</span>
              </button>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center">
            <Clock className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#0F0F0F]">No watch history</h3>
            <p className="text-xs text-[#606060] mt-1">
              Videos that you watch will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredHistory.map((video) => (
              <div
                key={video.id}
                className="flex flex-col sm:flex-row gap-4 p-2 rounded-xl hover:bg-[#F9F9F9] group transition-colors cursor-pointer"
                onClick={() => onSelectVideo(video)}
              >
                <div className="relative w-full sm:w-64 aspect-video rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded-xs">
                    {video.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F0F0F] line-clamp-2 group-hover:text-[#065FD4]">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#606060] mt-1">
                      <span>{video.channel.name}</span>
                      {video.channel.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#606060]" />
                      )}
                      <span>·</span>
                      <span>{video.viewsFormatted}</span>
                    </div>
                    <p className="text-xs text-[#606060] line-clamp-2 mt-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromHistory(video.id);
                      }}
                      className="p-1 text-[#606060] hover:text-[#D93025] hover:bg-[#F2F2F2] rounded-full transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Watch Later View
  if (view === 'watchLater') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl font-bold text-[#0F0F0F] flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#065FD4]" />
              Watch Later
            </h1>
            <p className="text-xs text-[#606060] mt-1">
              {watchLaterVideos.length} videos · Saved for later
            </p>
          </div>
          {watchLaterVideos.length > 0 && (
            <button
              onClick={() => onSelectVideo(watchLaterVideos[0])}
              className="flex items-center gap-2 px-5 py-2 bg-[#000000] text-[#065FD4] font-bold text-xs rounded-full hover:bg-[#111111] transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play all</span>
            </button>
          )}
        </div>

        {watchLaterVideos.length === 0 ? (
          <div className="py-16 text-center">
            <Clock className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#0F0F0F]">Your Watch Later list is empty</h3>
            <p className="text-xs text-[#606060] mt-1">
              Click the clock icon on any video thumbnail to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {watchLaterVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={onSelectVideo}
                onAddToWatchLater={onToggleWatchLater}
                isInWatchLater={true}
                onShare={onShare}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Liked Videos View
  if (view === 'likedVideos') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl font-bold text-[#0F0F0F] flex items-center gap-2">
              <ThumbsUp className="w-6 h-6 text-[#065FD4]" />
              Liked videos
            </h1>
            <p className="text-xs text-[#606060] mt-1">
              {likedVideos.length} videos · Marked with thumbs up
            </p>
          </div>
          {likedVideos.length > 0 && (
            <button
              onClick={() => onSelectVideo(likedVideos[0])}
              className="flex items-center gap-2 px-5 py-2 bg-[#000000] text-[#065FD4] font-bold text-xs rounded-full hover:bg-[#111111] transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play all</span>
            </button>
          )}
        </div>

        {likedVideos.length === 0 ? (
          <div className="py-16 text-center">
            <ThumbsUp className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#0F0F0F]">No liked videos yet</h3>
            <p className="text-xs text-[#606060] mt-1">
              Click the thumbs up button on videos you enjoy to save them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {likedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={onSelectVideo}
                onAddToWatchLater={onToggleWatchLater}
                isInWatchLater={watchLaterVideos.some((w) => w.id === video.id)}
                onShare={onShare}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 4. Subscriptions View
  if (view === 'subscriptions') {
    const subscribedChannels = channels.filter((c) => c.isSubscribed);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="pb-6 border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-bold text-[#0F0F0F] flex items-center gap-2">
            <Tv className="w-6 h-6 text-[#E1002D]" />
            Latest from your Subscriptions
          </h1>
          <p className="text-xs text-[#606060] mt-1">
            Stay updated with channels you follow
          </p>

          {/* Subscribed Channels Avatars Bar */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-4">
            {subscribedChannels.map((ch) => (
              <div key={ch.id} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer">
                <div className="relative">
                  <img
                    src={ch.avatar}
                    alt={ch.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#065FD4] transition-all"
                  />
                  {ch.isLive && (
                    <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-[#E1002D] text-white text-[9px] font-bold rounded-xs">
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-[#0F0F0F] truncate max-w-[70px]">
                  {ch.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {videos
            .filter((v) => subscribedChannels.some((c) => c.id === v.channel.id))
            .map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={onSelectVideo}
                onAddToWatchLater={onToggleWatchLater}
                isInWatchLater={watchLaterVideos.some((w) => w.id === video.id)}
                onShare={onShare}
              />
            ))}
        </div>
      </div>
    );
  }

  // 5. Trending / Explore View
  if (view === 'trending' || view === 'music' || view === 'gaming' || view === 'news' || view === 'podcasts') {
    const titleMap: Record<string, string> = {
      trending: 'Trending Now',
      music: 'Music Hub',
      gaming: 'Gaming Live & Replays',
      news: 'Breaking & Global News',
      podcasts: 'Top Audio & Video Podcasts',
    };

    const targetCategory =
      view === 'trending' ? null : view === 'music' ? 'Music' : view === 'gaming' ? 'Gaming' : null;

    const filtered = targetCategory
      ? videos.filter((v) => v.category === targetCategory)
      : [...videos].sort((a, b) => b.views - a.views);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="pb-6 border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-bold text-[#0F0F0F] flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#E1002D]" />
            {titleMap[view] || 'Explore'}
          </h1>
          <p className="text-xs text-[#606060] mt-1">
            Top trending videos right now on YouTube Light
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filtered.map((video, idx) => (
            <div key={video.id} className="relative">
              {view === 'trending' && (
                <span className="absolute -top-3 -left-2 z-10 px-2 py-0.5 bg-[#000000] text-[#065FD4] text-[10px] font-bold rounded-md shadow-xs">
                  #{idx + 1}
                </span>
              )}
              <VideoCard
                video={video}
                onSelect={onSelectVideo}
                onAddToWatchLater={onToggleWatchLater}
                isInWatchLater={watchLaterVideos.some((w) => w.id === video.id)}
                onShare={onShare}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Library Overview
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="pb-6 border-b border-[#E5E7EB]">
        <h1 className="text-2xl font-bold text-[#0F0F0F] flex items-center gap-2">
          <Library className="w-6 h-6 text-[#065FD4]" />
          Your Library
        </h1>
        <p className="text-xs text-[#606060] mt-1">
          Recent activity, watch later queue, and liked videos
        </p>
      </div>

      {/* History section */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-[#0F0F0F] mb-4">Recent History</h2>
        {historyVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {historyVideos.slice(0, 4).map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                onSelect={onSelectVideo}
                onAddToWatchLater={onToggleWatchLater}
                isInWatchLater={watchLaterVideos.some((w) => w.id === v.id)}
                onShare={onShare}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#606060]">No watch history yet.</p>
        )}
      </div>

      {/* Watch Later section */}
      <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
        <h2 className="text-base font-bold text-[#0F0F0F] mb-4">Watch Later ({watchLaterVideos.length})</h2>
        {watchLaterVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchLaterVideos.slice(0, 4).map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                onSelect={onSelectVideo}
                onAddToWatchLater={onToggleWatchLater}
                isInWatchLater={true}
                onShare={onShare}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#606060]">No videos in Watch Later queue.</p>
        )}
      </div>
    </div>
  );
};
