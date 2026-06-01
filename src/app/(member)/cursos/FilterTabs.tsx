'use client'

import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface FilterTabsProps {
  filtro: string
  counts: Record<string, number>
  busca?: string
}

const TABS = [
  { key: 'todos',          label: 'Todos' },
  { key: 'em-andamento',   label: 'Em andamento' },
  { key: 'nao-iniciados',  label: 'Não iniciados' },
  { key: 'concluidos',     label: 'Concluídos' },
]

export function FilterTabs({ filtro, counts, busca }: FilterTabsProps) {
  const router   = useRouter()
  const pathname = usePathname()

  function navigate(key: string) {
    const params = new URLSearchParams()
    if (key !== 'todos') params.set('filtro', key)
    if (busca) params.set('busca', busca)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map(({ key, label }) => {
        const active = filtro === key
        const count  = counts[key] ?? 0
        return (
          <button
            key={key}
            onClick={() => navigate(key)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150',
              active
                ? 'bg-[#c79a3b] text-[#0f0f0f]'
                : 'bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#242424] hover:text-[#f0f0f0]'
            )}
          >
            {label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                active ? 'bg-[#0f0f0f]/20 text-[#0f0f0f]' : 'bg-[#242424] text-[#606060]'
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
