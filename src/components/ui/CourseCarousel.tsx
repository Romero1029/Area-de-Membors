'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { CourseCardNetflix } from './CourseCardNetflix'
import type { Product, CourseProgress } from '@/types'

interface CarouselItem {
  product: Product
  progress?: CourseProgress
}

interface CourseCarouselProps {
  title: string
  subtitle?: string
  items: CarouselItem[]
  showAllHref?: string
  emptyMessage?: string
}

export function CourseCarousel({ title, subtitle, items, showAllHref, emptyMessage }: CourseCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    slidesToScroll: 1,
  })

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateButtons = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', updateButtons)
    emblaApi.on('reInit', updateButtons)
    updateButtons()
    return () => {
      emblaApi.off('select', updateButtons)
      emblaApi.off('reInit', updateButtons)
    }
  }, [emblaApi, updateButtons])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (items.length === 0 && emptyMessage) {
    return (
      <section className="space-y-4 px-4 sm:px-6 lg:px-10">
        <SectionHeader title={title} subtitle={subtitle} showAllHref={showAllHref} showArrows={false} canPrev={false} canNext={false} onPrev={scrollPrev} onNext={scrollNext} />
        <p className="text-sm text-[#505050]">{emptyMessage}</p>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-5">
      {/* Header com padding lateral */}
      <div className="px-4 sm:px-6 lg:px-10">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          showAllHref={showAllHref}
          showArrows={items.length > 3}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={scrollPrev}
          onNext={scrollNext}
        />
      </div>

      {/* Carrossel */}
      <div className="relative group/carousel">
        {/* Fade esquerda */}
        {canPrev && (
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden md:block"
            style={{ background: 'linear-gradient(to right, #0f0f0f, transparent)' }} />
        )}
        {/* Fade direita */}
        {canNext && (
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden md:block"
            style={{ background: 'linear-gradient(to left, #0f0f0f, transparent)' }} />
        )}

        {/* Seta esquerda */}
        {canPrev && (
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full items-center justify-center border border-white/10 bg-black/60 backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-black/80"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
        )}

        {/* Seta direita */}
        {canNext && (
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full items-center justify-center border border-white/10 bg-black/60 backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-black/80"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        )}

        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 lg:px-10">
            {items.map(({ product, progress }, i) => (
              <div
                key={product.id}
                className="flex-none w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
              >
                <CourseCardNetflix
                  product={product}
                  progress={progress}
                  href={`/cursos/${product.slug}`}
                  priority={i < 4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({
  title, subtitle, showAllHref, showArrows, canPrev, canNext, onPrev, onNext
}: {
  title: string
  subtitle?: string
  showAllHref?: string
  showArrows: boolean
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[#f0f0f0] font-bold leading-tight" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#505050] text-sm mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {showArrows && (
          <>
            <button
              onClick={onPrev}
              disabled={!canPrev}
              className="hidden md:flex h-8 w-8 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] items-center justify-center disabled:opacity-20 hover:bg-[#2a2a2a] transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-[#f0f0f0]" />
            </button>
            <button
              onClick={onNext}
              disabled={!canNext}
              className="hidden md:flex h-8 w-8 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] items-center justify-center disabled:opacity-20 hover:bg-[#2a2a2a] transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-[#f0f0f0]" />
            </button>
          </>
        )}
        {showAllHref && (
          <Link
            href={showAllHref}
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: '#c79a3b' }}
          >
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
