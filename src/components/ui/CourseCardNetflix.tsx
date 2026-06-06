import Link from 'next/link'
import Image from 'next/image'
import { Play, CheckCircle2, Clock } from 'lucide-react'
import type { Product, CourseProgress } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  course:     'Curso',
  ebook:      'E-book',
  bundle:     'Bundle',
  mentorship: 'Mentoria',
  event:      'Evento',
}

interface CourseCardNetflixProps {
  product: Product
  progress?: CourseProgress
  href: string
  priority?: boolean
}

export function CourseCardNetflix({ product, progress, href, priority = false }: CourseCardNetflixProps) {
  const percent    = progress?.percent_complete ?? 0
  const completed  = progress?.completed_lessons ?? 0
  const total      = progress?.total_lessons ?? 0
  const isDone     = percent === 100
  const inProgress = percent > 0 && percent < 100
  const notStarted = percent === 0

  return (
    <Link
      href={href}
      className="block group focus-visible:outline-2 focus-visible:outline-[#c79a3b] focus-visible:outline-offset-2 rounded-xl"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl bg-[#1a1a1a]" style={{ aspectRatio: '2/3' }}>
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2430] to-[#0f2233] flex items-center justify-center">
            <span className="text-3xl font-bold text-[#c79a3b]/30"
              style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
              IDM
            </span>
          </div>
        )}

        {/* Overlay base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Badge produto */}
        {product.badge_label && (
          <span className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0f0f0f]"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}>
            {product.badge_label}
          </span>
        )}

        {/* Concluído */}
        {isDone && (
          <span className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-[#22c55e]/90 px-2 py-0.5 text-[10px] font-bold text-white">
            <CheckCircle2 className="h-2.5 w-2.5" /> Concluído
          </span>
        )}

        {/* Play button — hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}>
            <Play className="h-5 w-5 text-[#0a0a0a] fill-[#0a0a0a] ml-0.5" />
          </div>
        </div>

        {/* Progress bar */}
        {(inProgress || isDone) && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full"
              style={{
                width: `${percent}%`,
                background: isDone ? '#22c55e' : 'linear-gradient(90deg, #c79a3b, #e8b84b)',
              }}
            />
          </div>
        )}
      </div>

      {/* Texto */}
      <div className="mt-2.5 space-y-1 px-0.5">
        <h3 className="text-[#e0e0e0] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#c79a3b] transition-colors duration-200">
          {product.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[#505050] text-xs">
          <span>{TYPE_LABEL[product.product_type] ?? 'Curso'}</span>
          {total > 0 && (
            <>
              <span className="text-[#333]">·</span>
              {notStarted ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Não iniciado
                </span>
              ) : (
                <span>{completed}/{total}</span>
              )}
            </>
          )}
          {inProgress && (
            <>
              <span className="text-[#333]">·</span>
              <span style={{ color: '#c79a3b' }}>{percent}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
