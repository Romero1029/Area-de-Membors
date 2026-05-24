"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionCarouselProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  seeAllHref?: string;
}

export function SectionCarousel({
  title,
  subtitle,
  children,
  seeAllHref,
}: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 600;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-6 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold text-[#F0F0F0] tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[#888888] mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <a
              href={seeAllHref}
              className="text-xs text-[#888888] hover:text-[#FFA902] transition-colors duration-200 mr-2"
            >
              Ver todos
            </a>
          )}
          {/* Nav arrows */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center text-[#888888] hover:text-[#F0F0F0] hover:border-[#333333] transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center text-[#888888] hover:text-[#F0F0F0] hover:border-[#333333] transition-all duration-200 disabled:opacity-30 disabled:cursor-default"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Left fade */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Right fade */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 lg:px-8 pb-2"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
