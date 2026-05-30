'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type StoreProduct = Database['public']['Tables']['products']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('products') as any)
    .select('*')
    .eq('is_published', true)
    .not('price', 'is', null)
    .order('sort_order', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function getFeaturedProduct(): Promise<StoreProduct | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('products') as any)
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .not('price', 'is', null)
    .order('sort_order', { ascending: true })
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function getUpsellProducts(enrolledProductIds: string[]): Promise<StoreProduct[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('products') as any)
    .select('*')
    .eq('is_published', true)
    .not('price', 'is', null)
    .order('sort_order', { ascending: true })
    .limit(3)

  if (enrolledProductIds.length > 0) {
    query = query.not('id', 'in', `(${enrolledProductIds.join(',')})`)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}

export async function getTestimonials(productId?: string): Promise<Testimonial[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('testimonials') as any)
    .select('*')
    .order('sort_order', { ascending: true })

  if (productId) {
    query = query.eq('product_id', productId)
  } else {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('products') as any)
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}
