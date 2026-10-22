import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Bell,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  ListPlus,
} from 'lucide-react';
import { Video, Comment, VideoChapter } from '../types/youtube';

interface WatchViewProps {
  video: Video;
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onBack: () => void;
  onShare: (video: Video, currentTime?: number) => void;
  onToggleWatchLater: (video: Video) => void;
  isInWatchLater: boolean;
  onToggleSubscribe: (channelId: string) => void;
  isSubscribed: boolean;
}

export const WatchView: React.FC<WatchViewProps> = ({
  video,
  allVideos,
  onSelectVideo,
  onBack,
  onShare,
  onToggleWatchLater,
  isInWatchLater,
  onToggleSubscribe,
  isSubscribed,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSec || 600);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p60 HD');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(video.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [commentSort, setCommentSort] = useState<'top' | 'newest'>('top');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset video state on video change
    setCurrentTime(0);
    setIsPlaying(true);
    setUserLiked(false);
    setUserDisliked(false);
    setLikesCount(video.likes);
    setComments(video.comments || []);
    setIsDownloaded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [video.id]);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * duration;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const jumpToChapter = (timeSec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timeSec;
    setCurrentTime(timeSec);
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const handleLike = () => {
    if (userLiked) {
      setUserLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setUserLiked(true);
      setLikesCount((prev) => prev + 1);
      if (userDisliked) setUserDisliked(false);
    }
  };

  const handleDislike = () => {
    if (userDisliked) {
      setUserDisliked(false);
    } else {
      setUserDisliked(true);
      if (userLiked) {
        setUserLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'You (Creator)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
      timestamp: 'Just now',
      text: newCommentText.trim(),
      likes: 0,
      userLiked: false,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setIsCommentFocused(false);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const relatedVideos = allVideos.filter((v) => v.id !== video.id);

  return (
    <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-5">
      {/* Top back button for mobile/compact */}
      <div className="mb-3 lg:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#065FD4] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column: Player + Info + Comments (8 cols on desktop) */}
        <div className="lg:col-span-8">
          {/* Custom Video Player Container */}
          <div
            ref={playerContainerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md group select-none"
            onMouseMove={() => {
              setShowControls(true);
              if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
              controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) setShowControls(false);
              }, 2500);
            }}
            onMouseLeave={() => {
              if (isPlaying) setShowControls(false);
            }}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Controls Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-4 transition-opacity duration-200 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Top Bar of player */}
              <div className="flex items-center justify-between text-white">
                <h4 className="text-sm font-semibold truncate drop-shadow-md pr-4">{video.title}</h4>
                <button
                  onClick={() => onShare(video, currentTime)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Share video"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Center Big Play Button (if paused) */}
              {!isPlaying && (
                <div className="self-center my-auto">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-[#E1002D] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>
              )}

              {/* Bottom Controls Bar */}
              <div className="flex flex-col gap-2 mt-auto">
                {/* Timeline Scrubber */}
                <div
                  onClick={handleSeek}
                  className="relative w-full h-1.5 hover:h-2.5 bg-white/30 rounded-full cursor-pointer transition-all flex items-center group/scrub"
                >
                  {/* Progress Fill */}
                  <div
                    className="h-full bg-[#E1002D] rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#E1002D] rounded-full shadow-xs opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
                  </div>

                  {/* Chapter Markers */}
                  {video.chapters?.map((ch) => (
                    <div
                      key={ch.timeSec}
                      className="absolute top-0 bottom-0 w-0.5 bg-black/60 pointer-events-none"
                      style={{ left: `${(ch.timeSec / duration) * 100}%` }}
                      title={ch.title}
                    />
                  ))}
                </div>

                {/* Control Buttons Row */}
                <div className="flex items-center justify-between text-white text-xs pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1 hover:text-[#065FD4] transition-colors"
                      title={isPlaying ? 'Pause (k)' : 'Play (k)'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    {/* Volume Controls */}
                    <div className="flex items-center gap-2 group/vol">
                      <button onClick={toggleMute} className="p-1 hover:text-[#065FD4] transition-colors" title="Mute (m)">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 accent-[#E1002D] h-1 rounded-full cursor-pointer opacity-80 hover:opacity-100"
                      />
                    </div>

                    {/* Time display */}
                    <span className="tabular-nums font-mono text-[11px] text-white/90">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 relative">
                    {/* Settings Dropdown Button */}
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Settings Flyout */}
                    {showSettings && (
                      <div className="absolute right-0 bottom-10 w-48 bg-black/90 backdrop-blur-md rounded-xl p-2 text-white shadow-xl border border-white/10 z-50 animate-in fade-in">
                        <div className="text-[11px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                          Playback Speed
                        </div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`w-full flex items-center justify-between px-2.5 py-1 text-xs rounded-sm hover:bg-white/20 transition-colors ${
                              playbackSpeed === speed ? 'text-[#065FD4] font-bold' : ''
                            }`}
                          >
                            <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
                            {playbackSpeed === speed && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}

                        <div className="h-[1px] bg-white/20 my-1" />

                        <div className="text-[11px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                          Quality
                        </div>
                        {['1080p60 HD', '720p', '480p'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuality(q);
                              setShowSettings(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1 text-xs rounded-sm hover:bg-white/20 transition-colors ${
                              quality === q ? 'text-[#065FD4] font-bold' : ''
                            }`}
                          >
                            <span>{q}</span>
                            {quality === q && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                      title="Full screen (f)"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title */}
          <h1 className="text-xl font-bold text-[#0F0F0F] mt-4 leading-snug">
            {video.title}
          </h1>

          {/* Channel Bar & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-4 border-b border-[#E5E7EB]">
            {/* Left: Channel Info & Subscribe */}
            <div className="flex items-center gap-3">
              <img
                src={video.channel.avatar}
                alt={video.channel.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E5E7EB]"
              />
              <div>
                <div className="flex items-center gap-1 font-bold text-sm text-[#0F0F0F]">
                  <span>{video.channel.name}</span>
                  {video.channel.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#606060]" />
                  )}
                </div>
                <span className="text-xs text-[#606060]">{video.channel.subscribers}</span>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={() => onToggleSubscribe(video.channel.id)}
                className={`ml-3 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSubscribed
                    ? 'bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F]'
                    : 'bg-[#000000] hover:bg-[#111111] text-[#065FD4]'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-3.5 h-3.5 fill-current text-[#0F0F0F]" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>

            {/* Right: Actions (Like/Dislike, Share, Download, Watch Later) */}
            <div className="flex items-center gap-2">
              {/* Segmented Like/Dislike Pill */}
              <div className="flex items-center bg-[#F2F2F2] rounded-full overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold hover:bg-[#E5E7EB] transition-colors ${
                    userLiked ? 'text-[#065FD4]' : 'text-[#0F0F0F]'
                  }`}
                  title="I like this"
                >
                  <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-current' : ''}`} />
                  <span className="tabular-nums">{(likesCount).toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-5 bg-[#CCCCCC]" />
                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 text-xs font-semibold hover:bg-[#E5E7EB] transition-colors ${
                    userDisliked ? 'text-[#E1002D]' : 'text-[#0F0F0F]'
                  }`}
                  title="I dislike this"
                >
                  <ThumbsDown className={`w-4 h-4 ${userDisliked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Share */}
              <button
                onClick={() => onShare(video, currentTime)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F] text-xs font-semibold rounded-full transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Download */}
              <button
                onClick={() => {
                  setIsDownloaded(!isDownloaded);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full transition-colors ${
                  isDownloaded
                    ? 'bg-[#065FD4]/10 text-[#065FD4]'
                    : 'bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F]'
                }`}
                title="Download for offline playback"
              >
                {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">{isDownloaded ? 'Saved' : 'Download'}</span>
              </button>

              {/* Save / Watch Later */}
              <button
                onClick={() => onToggleWatchLater(video)}
                className={`p-2 rounded-full transition-colors ${
                  isInWatchLater
                    ? 'bg-[#065FD4] text-white'
                    : 'bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F]'
                }`}
                title={isInWatchLater ? 'In Watch Later' : 'Save to Watch Later'}
              >
                <BookmarkCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description Container */}
          <div className="mt-4 p-3.5 bg-[#F9F9F9] rounded-xl border border-[#E5E7EB] text-xs text-[#0F0F0F]">
            <div className="flex items-center gap-3 font-semibold text-[#0F0F0F] mb-2">
              <span className="tabular-nums">{video.viewsFormatted}</span>
              <span>{video.uploadedAt}</span>
              <div className="flex gap-2">
                {video.tags.map((tag) => (
                  <span key={tag} className="text-[#065FD4] font-medium hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={`whitespace-pre-line leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
              {video.description}
            </div>

            {/* Clickable Chapters list if expanded */}
            {isDescriptionExpanded && video.chapters && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#606060] mb-2">
                  Chapters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {video.chapters.map((ch) => (
                    <button
                      key={ch.timeSec}
                      onClick={() => jumpToChapter(ch.timeSec)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#E5E7EB] text-left transition-colors group"
                    >
                      <span className="px-1.5 py-0.5 bg-white text-[#065FD4] font-mono font-bold rounded-xs border border-[#E5E7EB] text-[11px]">
                        {ch.timeFormatted}
                      </span>
                      <span className="text-xs text-[#0F0F0F] font-medium truncate group-hover:text-[#065FD4]">
                        {ch.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 text-xs font-bold text-[#0F0F0F] hover:text-[#065FD4] flex items-center gap-1 transition-colors"
            >
              <span>{isDescriptionExpanded ? 'Show less' : '...more'}</span>
              {isDescriptionExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Comments Section */}
          <section className="mt-6">
            <div className="flex items-center gap-6 mb-5">
              <h3 className="text-lg font-bold text-[#0F0F0F]">
                {comments.length} Comments
              </h3>
              <div className="flex items-center gap-1 text-xs font-medium text-[#606060]">
                <span>Sort by:</span>
                <select
                  value={commentSort}
                  onChange={(e) => setCommentSort(e.target.value as any)}
                  className="bg-transparent font-semibold text-[#0F0F0F] outline-hidden cursor-pointer"
                >
                  <option value="top">Top comments</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-start gap-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face"
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onFocus={() => setIsCommentFocused(true)}
                  className="w-full pb-1 text-sm text-[#0F0F0F] border-b border-[#CCCCCC] focus:border-[#0F0F0F] outline-hidden transition-colors"
                />
                {isCommentFocused && (
                  <div className="flex items-center justify-end gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNewCommentText('');
                        setIsCommentFocused(false);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-4 py-1.5 bg-[#000000] text-[#065FD4] hover:bg-[#111111] disabled:opacity-40 text-xs font-bold rounded-full transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comm) => (
                <div key={comm.id} className="flex items-start gap-4">
                  <img
                    src={comm.authorAvatar}
                    alt={comm.author}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#0F0F0F]">{comm.author}</span>
                      <span className="text-[#606060]">{comm.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#0F0F0F] mt-1 leading-relaxed">{comm.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[#606060]">
                      <button
                        onClick={() => {
                          setComments((prev) =>
                            prev.map((c) =>
                              c.id === comm.id
                                ? { ...c, likes: c.userLiked ? c.likes - 1 : c.likes + 1, userLiked: !c.userLiked }
                                : c
                            )
                          );
                        }}
                        className={`flex items-center gap-1 text-[11px] hover:text-[#0F0F0F] ${
                          comm.userLiked ? 'text-[#065FD4] font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${comm.userLiked ? 'fill-current' : ''}`} />
                        <span>{comm.likes > 0 ? comm.likes : ''}</span>
                      </button>
                      <button className="hover:text-[#0F0F0F]">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-[11px] font-semibold hover:text-[#0F0F0F]">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Up Next / Related Videos (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <span className="text-sm font-bold text-[#0F0F0F]">Up Next</span>
            <span className="text-xs text-[#606060] font-medium">Autoplay On</span>
          </div>

          <div className="space-y-3">
            {relatedVideos.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVideo(item)}
                className="flex gap-2 group cursor-pointer"
              >
                {/* Horizontal thumbnail */}
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-white text-[10px] font-mono rounded-xs">
                    {item.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#0F0F0F] line-clamp-2 leading-snug group-hover:text-[#065FD4]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#606060] mt-1 truncate">
                    {item.channel.name}
                  </p>
                  <p className="text-[11px] text-[#606060] mt-0.5">
                    {item.viewsFormatted} · {item.uploadedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
