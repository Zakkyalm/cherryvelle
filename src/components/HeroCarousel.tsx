'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';

// Total cards. We show groups of cards based on viewport:
// Desktop (lg+): 3 cards visible
// Tablet (sm–lg): 2 cards visible
// Mobile (<sm): 1 card visible

export function HeroCarousel() {
  const { heroBanners } = useAdminStore();

  // Only show active banners
  const heroCards = heroBanners.filter((b) => b.active);

  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalCards = heroCards.length;
  const totalPages = totalCards > 0 ? Math.ceil(totalCards / visibleCount) : 0;

  // Determine visible cards based on viewport width
  const updateVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 640) {
      setVisibleCount(1);
    } else if (width < 1024) {
      setVisibleCount(2);
    } else {
      setVisibleCount(3);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [updateVisibleCount]);

  // Reset page when visible count or cards change to avoid out-of-bounds
  useEffect(() => {
    setCurrentPage(0);
  }, [visibleCount, totalCards]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || totalPages === 0) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, visibleCount, currentPage, totalPages]);

  const goToNext = useCallback(() => {
    if (totalPages === 0) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    if (totalPages === 0) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      if (totalPages === 0) return;
      setIsTransitioning(true);
      setCurrentPage(page % totalPages);
    },
    [totalPages]
  );

  // Get the cards to display for the current page
  const getVisibleCards = () => {
    if (totalCards === 0) return [];
    const startIndex = currentPage * visibleCount;
    const cards = [];
    for (let i = 0; i < visibleCount; i++) {
      // Wrap around for infinite feel
      const index = (startIndex + i) % totalCards;
      cards.push(heroCards[index]);
    }
    return cards;
  };

  const displayedCards = getVisibleCards();

  if (totalCards === 0) return null;

  return (
    <section className="w-full bg-[#f5f5f5] py-4 px-4 sm:px-6 lg:px-10">
      <div
        className="w-full relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Carousel track */}
        <div className="overflow-hidden rounded-xl">
          <div
            className={`grid gap-3 sm:gap-4 lg:gap-5 ${
              visibleCount === 1
                ? 'grid-cols-1'
                : visibleCount === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            }`}
            onTransitionEnd={() => setIsTransitioning(false)}
          >
            {displayedCards.map((card, idx) => (
              <div
                key={`${card.id}-page${currentPage}-${idx}`}
                className={`relative rounded-xl overflow-hidden h-[360px] sm:h-[400px] md:h-[440px] lg:h-[480px] group animate-fadeSlideIn`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Background image */}
                <img
                  src={card.image}
                  alt={card.imageAlt || card.offerText}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Bottom bar: offer on left, Shop Now on right */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 sm:p-6 z-10">
                  {/* Offer text — bottom left */}
                  <div className="flex flex-col">
                    <span className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight drop-shadow-lg">
                      {card.offerText}
                    </span>
                    <span className="text-white/80 text-sm sm:text-base mt-0.5 drop-shadow-sm">
                      {card.offerSub}
                    </span>
                  </div>

                  {/* Shop Now button — right side */}
                  <Link
                    href={card.link || '/shop'}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-pink-600 text-sm sm:text-base font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-cherry-dark hover:bg-white hover:shadow-lg transition-all backdrop-blur-sm"
          aria-label="Previous slide group"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-cherry-dark hover:bg-white hover:shadow-lg transition-all backdrop-blur-sm"
          aria-label="Next slide group"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators (one per page/group) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? 'bg-cherry-700 w-6'
                    : 'bg-cherry-200 w-2 hover:bg-cherry-300'
                }`}
                aria-label={`Go to slide group ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
