import Image from 'next/image'
import { Star, Check, BookOpen, Users, Headphones, Calendar } from 'lucide-react'
import { BuyButton } from './BuyButton'
import type { StoreProduct } from '@/lib/actions/store'

const typeIcon: Record<string, React.ReactNode> = {
  course:      <BookOpen className="h-3.5 w-3.5" />,
  ebook:       <BookOpen className="h-3.5 w-3.5" />,
  bundle:      <Star className="h-3.5 w-3.5" />,
  mentorship:  <Users className="h-3.5 w-3.5" />,
  event:       <Calendar className="h-3.5 w-3.5" />,
}

const typeLabel: Record<string, string> = {
  course:     'Curso',
  ebook:      'E-book',
  bundle:     'Bundle',
  mentorship: 'Mentoria',
  event:      'Evento',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
}

interface ProductCardProps {
  product: StoreProduct
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const hasDiscount = product.original_price && product.original_price > (product.price ?? 0)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a2430] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#c79a3b]/30">
      {/* Badge */}
      {product.badge_label && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-[#c79a3b] px-2.5 py-0.5 text-xs font-bold text-[#1a2430] uppercase tracking-wide">
          {product.badge_label}
        </span>
      )}

      {/* Thumbnail */}
      <div className={`relative w-full overflow-hidden bg-[#0f2233] ${compact ? 'h-36' : 'h-48'}`}>
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Headphones className="h-12 w-12 text-[#c79a3b]/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2430]/80 to-transparent" />

        {/* Tipo */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1 rounded-full bg-[#1a2430]/80 px-2 py-0.5 text-xs text-[#c79a3b] backdrop-blur-sm">
          {typeIcon[product.product_type]}
          <span>{typeLabel[product.product_type]}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className={`font-fraunces font-bold text-white leading-tight ${compact ? 'text-base' : 'text-lg'}`}>
            {product.title}
          </h3>
          {!compact && product.short_description && (
            <p className="mt-1 text-sm text-white/60 line-clamp-2">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Bullet highlights */}
        {!compact && product.highlights && product.highlights.length > 0 && (
          <ul className="space-y-1">
            {product.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#c79a3b]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Preço + CTA */}
        <div className="mt-auto flex flex-col gap-3 pt-2 border-t border-white/10">
          <div className="flex items-end gap-2">
            {hasDiscount && (
              <span className="text-xs text-white/40 line-through">
                {formatPrice(product.original_price!)}
              </span>
            )}
            <span className="text-xl font-bold text-[#c79a3b]">
              {formatPrice(product.price!)}
            </span>
            {product.payment_type === 'subscription' && (
              <span className="text-xs text-white/50">/mês</span>
            )}
          </div>

          <BuyButton
            productId={product.id}
            label={product.cta_label ?? 'Quero agora'}
            checkoutUrl={product.checkout_url}
            variant="solid"
            className="w-full justify-center"
          />
        </div>
      </div>
    </div>
  )
}
