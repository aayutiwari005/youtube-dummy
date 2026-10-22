import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Mic,
  Video as VideoIcon,
  Bell,
  X,
  Clock,
  Check,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  ShieldAlert,
} from 'lucide-react';
import { NotificationItem, Video } from '../types/youtube';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenUpload: () => void;
  onOpenVoiceSearch: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onSelectVideoById: (id: string) => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenUpload,
  onOpenVoiceSearch,
  notifications,
  onMarkNotificationRead,
  onSelectVideoById,
  onLogoClick,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'James Webb telescope deep field',
    'Sony mirrorless camera review',
    'Relaxing chill lofi beats',
    'Authentic pasta dough technique',
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches((prev) => [searchQuery.trim(), ...prev.slice(0, 5)]);
      }
      setIsSearchFocused(false);
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleSelectRecent = (term: string) => {
    onSearchChange(term);
    onSearchSubmit(term);
    setIsSearchFocused(false);
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] h-14 px-4 flex items-center justify-between gap-4 select-none">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation guide"
          className="p-2 text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onLogoClick}
          className="flex items-center gap-1 group text-left cursor-pointer outline-hidden"
          title="YouTube Light Home"
        >
          {/* YouTube Brand Play Icon */}
          <div className="w-7 h-5 bg-[#E1002D] rounded-[6px] flex items-center justify-center text-white relative shadow-2xs group-hover:opacity-95 transition-opacity">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
          </div>
          <div className="flex items-baseline">
            <span className="font-bold text-lg tracking-tighter text-[#0F0F0F] font-sans">
              YouTube
            </span>
            <span className="text-[10px] font-semibold text-[#065FD4] uppercase tracking-wider ml-1 bg-[#065FD4]/10 px-1.5 py-0.2 rounded-xs">
              Light
            </span>
          </div>
        </button>
      </div>

      {/* Center: Search pill bar */}
      <div ref={searchContainerRef} className="flex-1 max-w-2xl relative flex items-center justify-center">
        <form onSubmit={handleFormSubmit} className="w-full flex items-center">
          <div
            className={`w-full flex items-center h-10 rounded-full border transition-all ${
              isSearchFocused
                ? 'border-[#065FD4] shadow-inner bg-white'
                : 'border-[#E5E7EB] bg-white hover:border-[#CCCCCC]'
            }`}
          >
            {isSearchFocused && (
              <div className="pl-4 text-[#606060]">
                <Search className="w-4 h-4" />
              </div>
            )}
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full px-4 py-2 bg-transparent text-sm text-[#0F0F0F] placeholder-[#606060] outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1.5 mr-1 text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              title="Search"
              className="h-full px-6 bg-[#F9F9F9] hover:bg-[#F2F2F2] border-l border-[#E5E7EB] rounded-r-full flex items-center justify-center text-[#0F0F0F] transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Voice Search Button */}
        <button
          onClick={onOpenVoiceSearch}
          title="Search with your voice"
          className="ml-3 w-10 h-10 rounded-full bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F] flex items-center justify-center transition-colors shrink-0"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Search Suggestions Dropdown */}
        {isSearchFocused && recentSearches.length > 0 && (
          <div className="absolute top-11 left-0 right-13 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1 text-[11px] font-semibold text-[#606060] uppercase tracking-wider">
              Recent searches
            </div>
            {recentSearches.map((term) => (
              <div
                key={term}
                onClick={() => handleSelectRecent(term)}
                className="flex items-center justify-between px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-sm text-[#0F0F0F] group"
              >
                <div className="flex items-center gap-3 truncate">
                  <Clock className="w-4 h-4 text-[#606060] shrink-0" />
                  <span className="truncate">{term}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveRecent(e, term)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-xs text-[#065FD4] hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions Cluster */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Create / Upload */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0F0F0F] bg-[#F2F2F2] hover:bg-[#E5E7EB] rounded-full transition-colors"
          title="Create a video"
        >
          <VideoIcon className="w-4 h-4 text-[#E1002D]" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#E1002D] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E7EB]">
                <h4 className="text-sm font-bold text-[#0F0F0F]">Notifications</h4>
                <span className="text-xs text-[#065FD4] font-medium cursor-pointer hover:underline">
                  Settings
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-[#F2F2F2]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onMarkNotificationRead(item.id);
                      onSelectVideoById(item.videoId);
                      setShowNotifications(false);
                    }}
                    className={`flex items-start gap-3 p-3 hover:bg-[#F9F9F9] cursor-pointer transition-colors ${
                      !item.isRead ? 'bg-[#F2F8FF]' : ''
                    }`}
                  >
                    <img
                      src={item.avatar}
                      alt={item.channelName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#0F0F0F] line-clamp-2 leading-relaxed">
                        <strong className="font-semibold text-[#0F0F0F]">{item.channelName}</strong> uploaded: {item.videoTitle}
                      </p>
                      <span className="text-[11px] text-[#606060] mt-1 block">
                        {item.timeAgo}
                      </span>
                    </div>
                    <img
                      src={item.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-16 h-9 rounded-sm object-cover shrink-0 bg-slate-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div ref={userMenuRef} className="relative ml-1">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-[#065FD4] transition-all cursor-pointer focus:outline-hidden"
            title="Account"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in duration-100">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="truncate">
                  <p className="text-sm font-bold text-[#0F0F0F] truncate">Alex Mercer</p>
                  <p className="text-xs text-[#606060] truncate">@alexmercer_creator</p>
                  <span className="text-xs text-[#065FD4] font-medium hover:underline cursor-pointer">
                    Manage your Google Account
                  </span>
                </div>
              </div>

              <div className="py-2 border-b border-[#E5E7EB] text-sm text-[#0F0F0F]">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-left transition-colors"
                >
                  <User className="w-4 h-4 text-[#606060]" />
                  <span>Your channel</span>
                </button>
                <button
                  onClick={() => {
                    onOpenUpload();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-left transition-colors"
                >
                  <VideoIcon className="w-4 h-4 text-[#606060]" />
                  <span>YouTube Studio</span>
                </button>
              </div>

              <div className="py-2 border-b border-[#E5E7EB] text-sm text-[#0F0F0F]">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-left transition-colors"
                >
                  <Moon className="w-4 h-4 text-[#606060]" />
                  <span>Appearance: Light Theme</span>
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-left transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#606060]" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="pt-2 text-sm text-[#0F0F0F]">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-left text-[#D93025] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
