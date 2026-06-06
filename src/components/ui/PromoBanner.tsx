'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import type { BannerSlide } from '@/lib/actions/banners'

interface PromoBannerProps {
  slides: BannerSlide[]
}

export function PromoBanner({ slides }: PromoBannerProps) {
  if (!slides.length) return null

  if (slides.length === 1) return <SinglePromo slide={slides[0]} />

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="grid sm:grid-cols-2 gap-4">
        {slides.slice(0, 2).map((slide, i) => (
          <SmallPromo key={slide.id} slide={slide} index={i} />
        ))}
      </div>
    </section>
  )
}

function SinglePromo({ slide }: { slide: BannerSlide }) {
  const shouldReduce = useReducedMotion()
  const Wrapper = slide.cta_url ? Link : 'div'
  const wrapperProps = slide.cta_url
    ? {
        href: slide.cta_url,
        target: slide.open_in_new ? '_blank' : undefined,
        rel: slide.open_in_new ? 'noopener noreferrer' : undefined,
      }
    : {}

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* @ts-expect-error dynamic wrapper */}
        <Wrapper
          {...wrapperProps}
          className="relative overflow-hidden rounded-2xl group block"
          style={{ minHeight: '200px' }}
        >
          {slide.image_url ? (
            <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0" style={{ background: slide.gradient ?? 'linear-gradient(135deg, #1a1a1a, #0f0f0f)' }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative p-8 flex flex-col justify-end h-full" style={{ minHeight: '200px' }}>
            {slide.badge_label && (
              <span className="text-xs font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1.5 w-fit rounded-full px-3 py-1"
                style={{ background: 'rgba(199,154,59,0.2)', color: '#e8b84b', border: '1px solid rgba(199,154,59,0.3)' }}>
                {slide.badge_label}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1"
              style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
              {slide.title}
            </h3>
            {slide.subtitle && (
              <p className="text-sm text-white/70 mb-4 max-w-lg">{slide.subtitle}</p>
            )}
            {slide.cta_label && (
              <div className="flex items-center gap-2 text-sm font-bold text-[#e8b84b] group-hover:gap-3 transition-all">
                {slide.cta_label}
                {slide.open_in_new ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </div>
            )}
          </div>
        </Wrapper>
      </motion.div>
    </section>
  )
}

function SmallPromo({ slide, index }: { slide: BannerSlide; index: number }) {
  const shouldReduce = useReducedMotion()
  const Wrapper = slide.cta_url ? Link : 'div'
  const wrapperProps = slide.cta_url
    ? {
        href: slide.cta_url,
        target: slide.open_in_new ? '_blank' : undefined,
        rel: slide.open_in_new ? 'noopener noreferrer' : undefined,
      }
    : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* @ts-expect-error dynamic wrapper */}
      <Wrapper
        {...wrapperProps}
        className="relative overflow-hidden rounded-2xl group block"
        style={{ minHeight: '180px' }}
      >
        {slide.image_url ? (
          <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0" style={{ background: slide.gradient ?? 'linear-gradient(135deg, #1a1a1a, #0f0f0f)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="relative p-6 flex flex-col justify-end h-full" style={{ minHeight: '180px' }}>
          {slide.badge_label && (
            <span className="text-[11px] font-bold uppercase tracking-wider mb-1.5 inline-flex w-fit rounded-full px-2.5 py-0.5"
              style={{ background: 'rgba(199,154,59,0.2)', color: '#e8b84b', border: '1px solid rgba(199,154,59,0.3)' }}>
              {slide.badge_label}
            </span>
          )}
          <h3 className="text-base font-bold text-white leading-tight mb-0.5"
            style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            {slide.title}
          </h3>
          {slide.subtitle && (
            <p className="text-xs text-white/60 line-clamp-2 mb-3">{slide.subtitle}</p>
          )}
          {slide.cta_label && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#e8b84b] group-hover:gap-2.5 transition-all">
              {slide.cta_label}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </Wrapper>
    </motion.div>
  )
}
