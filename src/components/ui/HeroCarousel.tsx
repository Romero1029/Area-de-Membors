'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Play, Info, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { BuyButton } from '@/components/marketing/BuyButton'
import type { Product, CourseProgress } from '@/types'
import type { BannerSlide } from '@/lib/actions/banners'

const TYPE_LABEL: Record<string, string> = {
  course: 'Curso', ebook: 'E-book', bundle: 'Bundle',
  mentorship: 'Mentoria', event: 'Evento',
}

interface ProductHeroSlide {
  kind: 'product'
  product: Product
  enrolled: boolean
  progress?: CourseProgress
  lastLessonHref?: string
}

interface BannerHeroSlide {
  kind: 'banner'
  banner: BannerSlide
}

export type HeroSlideItem = ProductHeroSlide | BannerHeroSlide

// Legacy compat — callers that omit `kind` are treated as product slides
interface LegacyHeroSlide {
  product: Product
  enrolled: boolean
  progress?: CourseProgress
  lastLessonHref?: string
}

type AnySlide = HeroSlideItem | LegacyHeroSlide

function normalise(s: AnySlide): HeroSlideItem {
  if ('kind' in s) return s
  return { kind: 'product', ...s }
}

interface HeroCarouselProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slides: any[]
  autoPlayInterval?: number
}

export function HeroCarousel({ slides: rawSlides, autoPlayInterval = 6000 }: HeroCarouselProps) {
  const slides: HeroSlideItem[] = (rawSlides as AnySlide[]).map(normalise)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const shouldReduce = useReducedMotion()

  const next = useCallback(() => setCurrent(i => (i + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent(i => (i - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (paused || shouldReduce || slides.length <= 1) return
    const id = setInterval(next, autoPlayInterval)
    return () => clearInterval(id)
  }, [paused, shouldReduce, slides.length, next, autoPlayInterval])

  if (!slides.length) return null

  const slide = slides[current]

  const bgImage = slide.kind === 'banner'
    ? slide.banner.image_url
    : slide.product.thumbnail_url

  const bgGradient = slide.kind === 'banner'
    ? (slide.banner.gradient ?? undefined)
    : undefined

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0f0f0f]"
      style={{ height: 'clamp(320px, 58vw, 580px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Destaques"
    >
      {/* Fundo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: shouldReduce ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduce ? 0 : 0.7, ease: 'easeInOut' }}
        >
          {bgImage ? (
            <Image
              src={bgImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : bgGradient ? (
            <div className="absolute inset-0" style={{ background: bgGradient }} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f2233] to-[#1a2430]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Conteúdo */}
      <div className="relative h-full flex items-end pb-12 px-6 sm:px-10 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="max-w-xl space-y-4"
            initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
            transition={{ duration: shouldReduce ? 0 : 0.45, ease: 'easeOut' }}
          >
            {slide.kind === 'banner' ? (
              <BannerContent slide={slide.banner} />
            ) : (
              <ProductContent slide={slide} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Setas */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 hover:opacity-100 focus-visible:opacity-100 border border-white/10"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 hover:opacity-100 focus-visible:opacity-100 border border-white/10"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 right-6 sm:right-10 flex items-center gap-2" role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '22px' : '6px',
                height: '6px',
                background: i === current ? '#c79a3b' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      )}

      {/* Barra de progresso */}
      {slides.length > 1 && !paused && !shouldReduce && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <motion.div
            key={`progress-${current}`}
            className="h-full bg-[#c79a3b]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </section>
  )
}

function BannerContent({ slide }: { slide: BannerSlide }) {
  return (
    <>
      {slide.badge_label && (
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c79a3b]">
          <span className="opacity-60">✦</span>
          <span className="rounded-full bg-[#c79a3b] px-2.5 py-0.5 text-[#0f0f0f]">
            {slide.badge_label}
          </span>
        </div>
      )}

      <h1 className="font-display font-bold text-white leading-tight"
        style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.75rem)', fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
        {slide.title}
      </h1>

      {slide.subtitle && (
        <p className="text-[#b0b0b0] text-sm sm:text-base leading-relaxed max-w-md">
          {slide.subtitle}
        </p>
      )}

      {slide.cta_url && (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={slide.cta_url}
            target={slide.open_in_new ? '_blank' : undefined}
            rel={slide.open_in_new ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a', boxShadow: '0 8px 24px rgba(199,154,59,0.35)' }}
          >
            {slide.cta_label ?? 'Saiba mais'}
            {slide.open_in_new && <ExternalLink className="h-3.5 w-3.5" />}
          </Link>
        </div>
      )}
    </>
  )
}

function ProductContent({ slide }: { slide: ProductHeroSlide }) {
  const { product, enrolled, progress, lastLessonHref } = slide
  return (
    <>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c79a3b]">
        <span className="opacity-60">✦</span>
        <span>{TYPE_LABEL[product.product_type] ?? 'Curso'}</span>
        {product.badge_label && (
          <>
            <span className="opacity-40">·</span>
            <span className="rounded-full bg-[#c79a3b] px-2 py-0.5 text-[#0f0f0f]">
              {product.badge_label}
            </span>
          </>
        )}
      </div>

      <h1 className="font-display font-bold text-[#f0f0f0] leading-tight line-clamp-2"
        style={{ fontSize: 'clamp(1.6rem, 3.8vw, 2.75rem)', fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
        {product.title}
      </h1>

      {(product.short_description || product.description) && (
        <p className="text-[#b0b0b0] text-sm sm:text-base leading-relaxed line-clamp-2 max-w-md">
          {product.short_description ?? product.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        {enrolled ? (
          <Link
            href={lastLessonHref ?? `/cursos/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a', boxShadow: '0 8px 24px rgba(199,154,59,0.35)' }}
          >
            <Play className="h-4 w-4 fill-current" />
            {(progress?.percent_complete ?? 0) > 0 ? 'Continuar' : 'Começar agora'}
          </Link>
        ) : (
          <BuyButton
            productId={product.id}
            label={product.cta_label ?? 'Quero agora'}
            checkoutUrl={product.checkout_url}
            variant="solid"
          />
        )}
        <Link
          href={`/cursos/${product.slug}`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#333] bg-black/40 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-[#f0f0f0] hover:bg-black/60 transition-all"
        >
          <Info className="h-4 w-4" /> Saiba mais
        </Link>
      </div>
    </>
  )
}
