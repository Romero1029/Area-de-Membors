'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { BuyButton } from '@/components/marketing/BuyButton'
import type { Product, CourseProgress } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  course: 'Curso', ebook: 'E-book', bundle: 'Bundle',
  mentorship: 'Mentoria', event: 'Evento',
}

interface HeroSlide {
  product: Product
  enrolled: boolean
  progress?: CourseProgress
  lastLessonHref?: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlayInterval?: number
}

export function HeroCarousel({ slides, autoPlayInterval = 6000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const shouldReduce = useReducedMotion()

  const next = useCallback(() => setCurrent(i => (i + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent(i => (i - 1 + slides.length) % slides.length), [slides.length])

  // Auto-play
  useEffect(() => {
    if (paused || shouldReduce || slides.length <= 1) return
    const id = setInterval(next, autoPlayInterval)
    return () => clearInterval(id)
  }, [paused, shouldReduce, slides.length, next, autoPlayInterval])

  if (!slides.length) return null

  const slide = slides[current]

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0f0f0f]"
      style={{ height: 'clamp(320px, 58vw, 560px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Cursos em destaque"
    >
      {/* Imagem de fundo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduce ? 0 : 0.5, ease: 'easeInOut' }}
        >
          {slide.product.thumbnail_url ? (
            <Image
              src={slide.product.thumbnail_url}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f2233] to-[#1a2430]" />
          )}
          {/* Gradiente de leitura */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Conteúdo */}
      <div className="relative h-full flex items-end pb-10 px-6 sm:px-10 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="max-w-lg space-y-3"
            initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
            transition={{ duration: shouldReduce ? 0 : 0.4, ease: 'easeOut' }}
          >
            {/* Categoria + tipo */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c79a3b]">
              <span className="opacity-60">✦</span>
              <span>{TYPE_LABEL[slide.product.product_type] ?? 'Curso'}</span>
              {slide.product.badge_label && (
                <>
                  <span className="opacity-40">·</span>
                  <span className="rounded-full bg-[#c79a3b] px-2 py-0.5 text-[#0f0f0f]">
                    {slide.product.badge_label}
                  </span>
                </>
              )}
            </div>

            {/* Título */}
            <h1 className="font-display font-bold text-[#f0f0f0] leading-tight line-clamp-2"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
              {slide.product.title}
            </h1>

            {/* Descrição */}
            {(slide.product.short_description || slide.product.description) && (
              <p className="text-[#a0a0a0] text-sm leading-relaxed line-clamp-2">
                {slide.product.short_description ?? slide.product.description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {slide.enrolled ? (
                <Link
                  href={slide.lastLessonHref ?? `/cursos/${slide.product.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-2.5 text-sm font-bold text-[#0f0f0f] hover:bg-[#e8b84b] transition-colors"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {(slide.progress?.percent_complete ?? 0) > 0 ? 'Continuar' : 'Começar agora'}
                </Link>
              ) : (
                <BuyButton
                  productId={slide.product.id}
                  label={slide.product.cta_label ?? 'Quero agora'}
                  checkoutUrl={slide.product.checkout_url}
                  variant="solid"
                />
              )}
              <Link
                href={`/cursos/${slide.product.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#333] bg-[#1a1a1a]/80 px-5 py-2.5 text-sm font-semibold text-[#f0f0f0] hover:bg-[#242424] transition-colors"
              >
                <Info className="h-4 w-4" /> Saiba mais
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Setas de navegação */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#1a1a1a]/70 flex items-center justify-center text-[#f0f0f0] hover:bg-[#242424] transition-colors opacity-0 hover:opacity-100 focus-visible:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#1a1a1a]/70 flex items-center justify-center text-[#f0f0f0] hover:bg-[#242424] transition-colors opacity-0 hover:opacity-100 focus-visible:opacity-100"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicadores */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-6 sm:right-10 flex items-center gap-1.5" role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === current ? '#c79a3b' : 'rgba(240,240,240,0.3)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
