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
    return () => { emblaApi.off('select', updateButtons); emblaApi.off('reInit', updateButtons) }
  }, [emblaApi, updateButtons])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (items.length === 0 && emptyMessage) {
    return (
      <section className="space-y-4 px-4 sm:px-6 lg:px-10">
        <SectionHeader title={title} subtitle={subtitle} showAllHref={showAllHref} showArrows={false} canPrev={false} canNext={false} onPrev={scrollPrev} onNext={scrollNext} />
        <p className="text-sm text-[#606060]">{emptyMessage}</p>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="px-4 sm:px-6 lg:px-10">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          showAllHref={showAllHref}
          showArrows={items.length > 4}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={scrollPrev}
          onNext={scrollNext}
        />
      </div>

      {/* Carrossel */}
      <div className="relative group/carousel">
        {/* Seta esquerda */}
        {canPrev && (
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 items-center justify-center bg-gradient-to-r from-[#0f0f0f] to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6 text-[#f0f0f0]" />
          </button>
        )}

        {/* Seta direita */}
        {canNext && (
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 items-center justify-center bg-gradient-to-l from-[#0f0f0f] to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6 text-[#f0f0f0]" />
          </button>
        )}

        {/* Embla viewport */}
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-3 px-4 sm:px-6 lg:px-10">
            {items.map(({ product, progress }, i) => (
              <div
                key={product.id}
                className="embla__slide flex-none w-[160px] sm:w-[190px] md:w-[210px] lg:w-[230px]"
              >
                <CourseCardNetflix
                  product={product}
                  progress={progress}
                  href={`/cursos/${product.slug}`}
                  priority={i < 3}
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
        <h2 className="text-[#f0f0f0] font-bold text-lg sm:text-xl leading-tight">{title}</h2>
        {subtitle && <p className="text-[#606060] text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {showArrows && (
          <>
            <button onClick={onPrev} disabled={!canPrev} className="hidden md:flex h-7 w-7 rounded-full bg-[#242424] items-center justify-center disabled:opacity-30 hover:bg-[#333] transition-colors">
              <ChevronLeft className="h-3.5 w-3.5 text-[#f0f0f0]" />
            </button>
            <button onClick={onNext} disabled={!canNext} className="hidden md:flex h-7 w-7 rounded-full bg-[#242424] items-center justify-center disabled:opacity-30 hover:bg-[#333] transition-colors">
              <ChevronRight className="h-3.5 w-3.5 text-[#f0f0f0]" />
            </button>
          </>
        )}
        {showAllHref && (
          <Link href={showAllHref} className="flex items-center gap-1 text-xs font-semibold text-[#c79a3b] hover:text-[#e8b84b] transition-colors">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  )
}
