/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Video, Channel, NavView, NotificationItem } from './types/youtube';
import { INITIAL_VIDEOS, INITIAL_CHANNELS, INITIAL_NOTIFICATIONS, TOPIC_CATEGORIES } from './data/mockVideos';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicPills } from './components/TopicPills';
import { VideoCard } from './components/VideoCard';
import { WatchView } from './components/WatchView';
import { ShortsView } from './components/ShortsView';
import { ListViews } from './components/ListViews';
import { UploadModal } from './components/UploadModal';
import { ShareModal } from './components/ShareModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';

export default function App() {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [currentView, setCurrentView] = useState<NavView>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchFilter, setActiveSearchFilter] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // User Library Persistence & Collections
  const [watchLaterIds, setWatchLaterIds] = useState<string[]>(['vid-1', 'vid-4']);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(['vid-2']);
  const [historyVideos, setHistoryVideos] = useState<Video[]>([INITIAL_VIDEOS[0], INITIAL_VIDEOS[1]]);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [shareData, setShareData] = useState<{ isOpen: boolean; video: Video | null; currentTime?: number }>({
    isOpen: false,
    video: null,
  });

  // Watch video handler - automatically pushes to history
  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setHistoryVideos((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      return [video, ...filtered];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setSelectedVideo(null);
  };

  const handleToggleWatchLater = (video: Video) => {
    setWatchLaterIds((prev) =>
      prev.includes(video.id) ? prev.filter((id) => id !== video.id) : [...prev, video.id]
    );
  };

  const handleToggleSubscribe = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, isSubscribed: !c.isSubscribed } : c))
    );
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const handleUploadVideo = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
    setSelectedCategory('All');
    setActiveSearchFilter('');
    handleSelectVideo(newVideo);
  };

  const handleVoiceTranscript = (query: string) => {
    setSearchQuery(query);
    setActiveSearchFilter(query);
    setSelectedVideo(null);
  };

  const handleSearchSubmit = (query: string) => {
    setActiveSearchFilter(query);
    setSelectedVideo(null);
  };

  // Filtered videos based on category and search query
  const displayedVideos = useMemo(() => {
    return videos.filter((video) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        video.category.toLowerCase() === selectedCategory.toLowerCase() ||
        video.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));

      // Search filter
      const q = activeSearchFilter.toLowerCase().trim();
      const matchesSearch =
        !q ||
        video.title.toLowerCase().includes(q) ||
        video.channel.name.toLowerCase().includes(q) ||
        video.tags.some((t) => t.toLowerCase().includes(q)) ||
        video.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, activeSearchFilter]);

  const watchLaterVideos = useMemo(
    () => videos.filter((v) => watchLaterIds.includes(v.id)),
    [videos, watchLaterIds]
  );

  const likedVideos = useMemo(
    () => videos.filter((v) => likedVideoIds.includes(v.id)),
    [videos, likedVideoIds]
  );

  const isCurrentVideoSubscribed = useMemo(() => {
    if (!selectedVideo) return false;
    const ch = channels.find((c) => c.id === selectedVideo.channel.id);
    return ch ? Boolean(ch.isSubscribed) : false;
  }, [selectedVideo, channels]);

  return (
    <div className="min-h-screen bg-white text-[#0F0F0F] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onSelectVideoById={(id) => {
          const target = videos.find((v) => v.id === id);
          if (target) handleSelectVideo(target);
        }}
        onLogoClick={() => {
          setSelectedVideo(null);
          setCurrentView('home');
          setSelectedCategory('All');
          setActiveSearchFilter('');
          setSearchQuery('');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Collapsible Sidebar (hidden on full watch view on narrow screens) */}
        {!selectedVideo && (
          <Sidebar
            currentView={currentView}
            onSelectView={(view) => {
              setCurrentView(view);
              setSelectedVideo(null);
            }}
            isCollapsed={isSidebarCollapsed}
            channels={channels}
            onSelectChannel={(ch) => {
              setActiveSearchFilter(ch.name);
              setCurrentView('home');
              setSelectedVideo(null);
            }}
          />
        )}

        {/* Scrollable Center Canvas */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-white">
          {selectedVideo ? (
            /* Dedicated Video Watch View */
            <WatchView
              video={selectedVideo}
              allVideos={videos}
              onSelectVideo={handleSelectVideo}
              onBack={handleBackToFeed}
              onShare={(vid, time) =>
                setShareData({ isOpen: true, video: vid, currentTime: time })
              }
              onToggleWatchLater={handleToggleWatchLater}
              isInWatchLater={watchLaterIds.includes(selectedVideo.id)}
              onToggleSubscribe={handleToggleSubscribe}
              isSubscribed={isCurrentVideoSubscribed}
            />
          ) : currentView === 'shorts' ? (
            /* Vertical Shorts Mode */
            <ShortsView
              videos={videos}
              onShare={(vid) => setShareData({ isOpen: true, video: vid })}
              onSelectVideo={handleSelectVideo}
            />
          ) : currentView !== 'home' ? (
            /* Library, History, Watch Later, Liked, Trending, Explore */
            <ListViews
              view={currentView}
              videos={videos}
              historyVideos={historyVideos}
              watchLaterVideos={watchLaterVideos}
              likedVideos={likedVideos}
              channels={channels}
              onSelectVideo={handleSelectVideo}
              onClearHistory={() => setHistoryVideos([])}
              onRemoveFromHistory={(id) =>
                setHistoryVideos((prev) => prev.filter((v) => v.id !== id))
              }
              onToggleWatchLater={handleToggleWatchLater}
              onShare={(vid) => setShareData({ isOpen: true, video: vid })}
            />
          ) : (
            /* Standard Home Feed */
            <div>
              {/* Category Filter Chips Bar */}
              <TopicPills
                categories={TOPIC_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setActiveSearchFilter('');
                }}
              />

              {/* Active Search Results Banner if searching */}
              {activeSearchFilter && (
                <div className="px-6 pt-4 flex items-center justify-between text-xs text-[#606060]">
                  <span>
                    Results for &ldquo;<strong className="text-[#0F0F0F]">{activeSearchFilter}</strong>&rdquo;
                  </span>
                  <button
                    onClick={() => {
                      setActiveSearchFilter('');
                      setSearchQuery('');
                    }}
                    className="text-[#065FD4] font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Video Cards Grid (Standard 16px to 24px gutter rhythm) */}
              <div className="p-4 sm:p-6">
                {displayedVideos.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-base font-semibold text-[#0F0F0F]">
                      No videos found matching your selection
                    </p>
                    <p className="text-xs text-[#606060] mt-1">
                      Try searching for different keywords or select &quot;All&quot; from the chips above.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setActiveSearchFilter('');
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 bg-[#000000] text-[#065FD4] text-xs font-bold rounded-full hover:bg-[#111111]"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {displayedVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={handleSelectVideo}
                        onAddToWatchLater={handleToggleWatchLater}
                        isInWatchLater={watchLaterIds.includes(video.id)}
                        onShare={(vid) => setShareData({ isOpen: true, video: vid })}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadVideo}
      />

      <ShareModal
        isOpen={shareData.isOpen}
        video={shareData.video}
        currentTime={shareData.currentTime}
        onClose={() => setShareData({ isOpen: false, video: null })}
      />

      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
}
