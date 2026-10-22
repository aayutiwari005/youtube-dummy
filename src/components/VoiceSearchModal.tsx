import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onTranscript }) => {
  const [isListening, setIsListening] = useState(true);
  const [interimText, setInterimText] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setInterimText('');
      return;
    }

    setIsListening(true);
    setInterimText('Listening...');

    // Check if browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setInterimText(transcript);
          if (event.results[0].isFinal) {
            setTimeout(() => {
              onTranscript(transcript);
              onClose();
            }, 600);
          }
        };

        recognition.onerror = () => {
          simulateVoice();
        };

        recognition.start();
      } catch (err) {
        simulateVoice();
      }
    } else {
      simulateVoice();
    }

    function simulateVoice() {
      const phrases = [
        'James Webb space telescope',
        'Camera review 4k',
        'Lo-Fi rainy beats to study to',
        'Handmade fresh pasta recipe',
        'Full-stack system architecture 2026',
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      let index = 0;
      const interval = setInterval(() => {
        index += 3;
        setInterimText(randomPhrase.slice(0, index));
        if (index >= randomPhrase.length) {
          clearInterval(interval);
          setTimeout(() => {
            onTranscript(randomPhrase);
            onClose();
          }, 800);
        }
      }, 120);

      return () => clearInterval(interval);
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {}
      }
    };
  }, [isOpen, onTranscript, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Voice Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-[#E5E7EB] relative transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close voice search"
          className="absolute top-4 right-4 p-2 text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#0F0F0F] mb-6">Search with your voice</h3>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative mb-6">
            {isListening && (
              <div className="absolute -inset-4 bg-[#E1002D]/15 rounded-full animate-ping" />
            )}
            <button
              onClick={() => setIsListening(!isListening)}
              className="relative w-20 h-20 rounded-full bg-[#E1002D] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-9 h-9" />
            </button>
          </div>

          <p className="text-lg text-[#0F0F0F] font-medium text-center min-h-7 px-4">
            {interimText}
          </p>

          <p className="text-xs text-[#606060] mt-4 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#065FD4]" />
            <span>Speak clearly into your microphone</span>
          </p>
        </div>
      </div>
    </div>
  );
};
