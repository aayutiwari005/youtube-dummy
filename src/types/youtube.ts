export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  isSubscribed?: boolean;
  isVerified?: boolean;
  hasUnread?: boolean;
  isLive?: boolean;
}

export interface VideoChapter {
  timeSec: number;
  timeFormatted: string;
  title: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  text: string;
  likes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  durationSec: number;
  views: number;
  viewsFormatted: string;
  uploadedAt: string;
  channel: Channel;
  category: string;
  likes: number;
  dislikes: number;
  tags: string[];
  chapters?: VideoChapter[];
  isLive?: boolean;
  isVerified?: boolean;
  commentsCount: number;
  comments?: Comment[];
}

export interface NotificationItem {
  id: string;
  channelName: string;
  avatar: string;
  videoTitle: string;
  thumbnailUrl: string;
  timeAgo: string;
  isRead: boolean;
  videoId: string;
}

export type NavView =
  | 'home'
  | 'shorts'
  | 'subscriptions'
  | 'library'
  | 'history'
  | 'watchLater'
  | 'likedVideos'
  | 'trending'
  | 'music'
  | 'gaming'
  | 'news'
  | 'podcasts';
