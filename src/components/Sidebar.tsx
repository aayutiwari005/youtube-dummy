import React from 'react';
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Library,
  Flame,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  Radio,
  Settings,
  Flag,
  HelpCircle,
  MessageSquareShare,
  Tv,
} from 'lucide-react';
import { NavView, Channel } from '../types/youtube';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isCollapsed: boolean;
  channels: Channel[];
  onSelectChannel?: (channel: Channel) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  channels,
  onSelectChannel,
}) => {
  // Collapsed Mini-Guide (72px)
  if (isCollapsed) {
    return (
      <aside className="w-[72px] shrink-0 bg-white border-r border-[#E5E7EB] py-3 flex flex-col items-center gap-1 select-none z-30">
        <button
          onClick={() => onSelectView('home')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl transition-colors ${
            currentView === 'home'
              ? 'bg-[#F2F2F2] text-[#0F0F0F]'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
          title="Home"
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onSelectView('shorts')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl transition-colors ${
            currentView === 'shorts'
              ? 'bg-[#F2F2F2] text-[#0F0F0F]'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
          title="Shorts"
        >
          <PlaySquare className="w-5 h-5 mb-1 text-[#E1002D]" />
          <span className="text-[10px] font-medium tracking-tight">Shorts</span>
        </button>

        <button
          onClick={() => onSelectView('subscriptions')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl transition-colors ${
            currentView === 'subscriptions'
              ? 'bg-[#F2F2F2] text-[#0F0F0F]'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
          title="Subscriptions"
        >
          <Tv className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">Subs</span>
        </button>

        <button
          onClick={() => onSelectView('library')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl transition-colors ${
            currentView === 'library'
              ? 'bg-[#F2F2F2] text-[#0F0F0F]'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
          title="You"
        >
          <Library className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">You</span>
        </button>

        <button
          onClick={() => onSelectView('history')}
          className={`w-16 py-3.5 flex flex-col items-center justify-center rounded-xl transition-colors ${
            currentView === 'history'
              ? 'bg-[#F2F2F2] text-[#0F0F0F]'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
          title="History"
        >
          <Clock className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">History</span>
        </button>
      </aside>
    );
  }

  // Full Expanded Sidebar (240px)
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[#E5E7EB] py-3 px-3 overflow-y-auto no-scrollbar select-none z-30">
      {/* Primary Section */}
      <div className="space-y-0.5">
        <button
          onClick={() => onSelectView('home')}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-medium ${
            currentView === 'home'
              ? 'bg-[#F2F2F2] text-[#0F0F0F] font-bold'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
        >
          <Home className={`w-5 h-5 shrink-0 ${currentView === 'home' ? 'text-[#065FD4]' : 'text-[#0F0F0F]'}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectView('shorts')}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-medium ${
            currentView === 'shorts'
              ? 'bg-[#F2F2F2] text-[#0F0F0F] font-bold'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
        >
          <PlaySquare className="w-5 h-5 shrink-0 text-[#E1002D]" />
          <span>Shorts</span>
        </button>

        <button
          onClick={() => onSelectView('subscriptions')}
          className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-medium ${
            currentView === 'subscriptions'
              ? 'bg-[#F2F2F2] text-[#0F0F0F] font-bold'
              : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
          }`}
        >
          <Tv className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
          <span>Subscriptions</span>
        </button>
      </div>

      {/* Hairline Divider */}
      <div className="h-[1px] bg-[#E5E7EB] my-3" />

      {/* You Section */}
      <div>
        <div className="px-3 py-1 text-sm font-bold text-[#0F0F0F] flex items-center gap-1.5 cursor-pointer hover:text-[#065FD4]">
          <span>You</span>
          <span className="text-xs">›</span>
        </div>
        <div className="space-y-0.5 mt-1">
          <button
            onClick={() => onSelectView('history')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'history'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>History</span>
          </button>

          <button
            onClick={() => onSelectView('library')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'library'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Library className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>Playlists</span>
          </button>

          <button
            onClick={() => onSelectView('watchLater')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'watchLater'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>Watch Later</span>
          </button>

          <button
            onClick={() => onSelectView('likedVideos')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'likedVideos'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <ThumbsUp className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>Liked videos</span>
          </button>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-[1px] bg-[#E5E7EB] my-3" />

      {/* Subscriptions Section */}
      <div>
        <div className="px-3 py-1 text-sm font-bold text-[#0F0F0F]">
          Subscriptions
        </div>
        <div className="space-y-0.5 mt-1">
          {channels.slice(0, 5).map((ch) => (
            <button
              key={ch.id}
              onClick={() => onSelectChannel?.(ch)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-[#F9F9F9] transition-colors text-left group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={ch.avatar}
                  alt={ch.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="text-xs text-[#0F0F0F] font-normal truncate group-hover:text-[#065FD4]">
                  {ch.name}
                </span>
              </div>
              {ch.isLive ? (
                <span className="w-2 h-2 rounded-full bg-[#E1002D] animate-ping" title="Live" />
              ) : ch.hasUnread ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#065FD4]" title="New videos" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-[1px] bg-[#E5E7EB] my-3" />

      {/* Explore Section */}
      <div>
        <div className="px-3 py-1 text-sm font-bold text-[#0F0F0F]">
          Explore
        </div>
        <div className="space-y-0.5 mt-1">
          <button
            onClick={() => onSelectView('trending')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'trending'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Flame className="w-5 h-5 shrink-0 text-[#E1002D]" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => onSelectView('music')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'music'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Music2 className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>Music</span>
          </button>

          <button
            onClick={() => onSelectView('gaming')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'gaming'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Gamepad2 className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>Gaming</span>
          </button>

          <button
            onClick={() => onSelectView('news')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'news'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Newspaper className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>News</span>
          </button>

          <button
            onClick={() => onSelectView('podcasts')}
            className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-normal ${
              currentView === 'podcasts'
                ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                : 'text-[#0F0F0F] hover:bg-[#F9F9F9]'
            }`}
          >
            <Radio className="w-5 h-5 shrink-0 text-[#0F0F0F]" />
            <span>Podcasts</span>
          </button>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-[1px] bg-[#E5E7EB] my-3" />

      {/* Settings & Help */}
      <div className="space-y-0.5">
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-6 px-3 py-2 rounded-lg text-sm text-[#0F0F0F] hover:bg-[#F9F9F9] transition-colors text-left"
        >
          <Settings className="w-5 h-5 shrink-0 text-[#606060]" />
          <span className="text-xs">Settings</span>
        </button>
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-6 px-3 py-2 rounded-lg text-sm text-[#0F0F0F] hover:bg-[#F9F9F9] transition-colors text-left"
        >
          <Flag className="w-5 h-5 shrink-0 text-[#606060]" />
          <span className="text-xs">Report history</span>
        </button>
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-6 px-3 py-2 rounded-lg text-sm text-[#0F0F0F] hover:bg-[#F9F9F9] transition-colors text-left"
        >
          <HelpCircle className="w-5 h-5 shrink-0 text-[#606060]" />
          <span className="text-xs">Help</span>
        </button>
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-6 px-3 py-2 rounded-lg text-sm text-[#0F0F0F] hover:bg-[#F9F9F9] transition-colors text-left"
        >
          <MessageSquareShare className="w-5 h-5 shrink-0 text-[#606060]" />
          <span className="text-xs">Send feedback</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-6 px-3 text-[11px] text-[#606060] leading-relaxed space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:text-[#065FD4] cursor-pointer">About</span>
          <span className="hover:text-[#065FD4] cursor-pointer">Press</span>
          <span className="hover:text-[#065FD4] cursor-pointer">Copyright</span>
          <span className="hover:text-[#065FD4] cursor-pointer">Contact us</span>
          <span className="hover:text-[#065FD4] cursor-pointer">Creators</span>
        </div>
        <p className="text-[10px] text-[#606060] pt-2">
          © 2026 YouTube Light LLC
        </p>
      </div>
    </aside>
  );
};
