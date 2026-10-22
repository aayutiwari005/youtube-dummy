import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TopicPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const TopicPills: React.FC<TopicPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className="sticky top-14 z-20 bg-white border-b border-[#E5E7EB] py-3 px-4 flex items-center relative select-none">
      {/* Left Chevron */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-2 pr-6 bg-gradient-to-r from-white via-white to-transparent z-10">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E7EB] shadow-xs flex items-center justify-center text-[#0F0F0F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chips Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#0F0F0F] text-white shadow-2xs font-semibold'
                  : 'bg-[#F2F2F2] hover:bg-[#E5E7EB] text-[#0F0F0F]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Right Chevron */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2 pl-6 bg-gradient-to-l from-white via-white to-transparent z-10">
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E7EB] shadow-xs flex items-center justify-center text-[#0F0F0F] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
