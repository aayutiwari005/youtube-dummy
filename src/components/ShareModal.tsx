import React, { useState } from 'react';
import { X, Copy, Check, Share2, Facebook, Twitter, Mail, MessageSquare } from 'lucide-react';
import { Video } from '../types/youtube';

interface ShareModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  currentTime?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose, currentTime = 0 }) => {
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !video) return null;

  const currentSec = Math.floor(currentTime);
  const shareUrl = `${window.location.origin}?v=${video.id}${includeTimestamp && currentSec > 0 ? `&t=${currentSec}s` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share video"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-6 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-bold text-[#0F0F0F] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#065FD4]" />
            Share
          </h3>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-1.5 text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Social Quick Share Buttons */}
        <div className="py-5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
            className="flex flex-col items-center gap-2 p-3 hover:bg-[#F9F9F9] rounded-xl transition-colors min-w-[70px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center">
              <Twitter className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#0F0F0F] font-medium">X / Twitter</span>
          </button>

          <button
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
            className="flex flex-col items-center gap-2 p-3 hover:bg-[#F9F9F9] rounded-xl transition-colors min-w-[70px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
              <Facebook className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#0F0F0F] font-medium">Facebook</span>
          </button>

          <button
            onClick={() => window.open(`mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent(shareUrl)}`)}
            className="flex flex-col items-center gap-2 p-3 hover:bg-[#F9F9F9] rounded-xl transition-colors min-w-[70px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#0F0F0F] font-medium">Email</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-2 p-3 hover:bg-[#F9F9F9] rounded-xl transition-colors min-w-[70px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#065FD4]/10 text-[#065FD4] flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#0F0F0F] font-medium">Direct</span>
          </button>
        </div>

        {/* Link Field with Copy */}
        <div className="mt-2 p-2 bg-[#F9F9F9] rounded-xl border border-[#E5E7EB] flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[#0F0F0F] font-mono outline-hidden select-all"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#000000] text-[#065FD4] hover:bg-[#111111] text-xs font-semibold rounded-full transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-white">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Start At Timestamp */}
        {currentSec > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="timestamp-check"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="w-4 h-4 accent-[#065FD4] rounded-sm cursor-pointer"
            />
            <label htmlFor="timestamp-check" className="text-xs text-[#0F0F0F] select-none cursor-pointer">
              Start at <span className="font-semibold text-[#065FD4]">{Math.floor(currentSec / 60)}:{(currentSec % 60).toString().padStart(2, '0')}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
