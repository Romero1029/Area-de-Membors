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
    <Link href={href} className="card-netflix block rounded-[var(--radius-lg)] overflow-hidden bg-[#1a1a1a] group focus-visible:outline-2 focus-visible:outline-[#c79a3b]">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#0f0f0f] thumbnail-inner">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-350 ease-out group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2430] to-[#0f2233] flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-[#c79a3b]/40">IDM</span>
          </div>
        )}

        {/* Gradiente base do overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent" />

        {/* Badge */}
        {product.badge_label && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-[#c79a3b] px-2 py-0.5 text-[10px] font-bold text-[#0f0f0f] uppercase tracking-wide">
            {product.badge_label}
          </span>
        )}

        {/* Concluído badge */}
        {isDone && (
          <span className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-[#22c55e]/90 px-2 py-0.5 text-[10px] font-bold text-white">
            <CheckCircle2 className="h-2.5 w-2.5" /> Concluído
          </span>
        )}

        {/* Play overlay — aparece no hover via CSS */}
        <div className="play-overlay absolute inset-0 flex items-center justify-center">
          <div className="h-11 w-11 rounded-full bg-[#c79a3b]/90 flex items-center justify-center shadow-lg">
            <Play className="h-5 w-5 text-[#0f0f0f] fill-[#0f0f0f] ml-0.5" />
          </div>
        </div>

        {/* Progress bar — 3px no fundo da thumbnail */}
        {(inProgress || isDone) && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2a2a2a]">
            <div
              className="h-full transition-none"
              style={{
                width: `${percent}%`,
                background: isDone ? '#22c55e' : '#c79a3b',
              }}
            />
          </div>
        )}
      </div>

      {/* Texto abaixo da thumbnail */}
      <div className="px-3 py-2.5 space-y-1">
        <h3 className="text-[#f0f0f0] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#c79a3b] transition-colors duration-150">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 text-[#606060] text-xs">
          <span>{TYPE_LABEL[product.product_type] ?? 'Curso'}</span>
          {total > 0 && (
            <>
              <span>·</span>
              {notStarted ? (
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Não iniciado</span>
              ) : (
                <span>{completed}/{total} aulas</span>
              )}
            </>
          )}
          {inProgress && (
            <>
              <span>·</span>
              <span className="text-[#c79a3b]">{percent}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
