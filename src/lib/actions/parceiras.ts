'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Partner, PartnerTheme, PartnerWithRelations } from '@/types'

export async function getPartnerThemes(): Promise<PartnerTheme[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('partner_themes') as any)
    .select('*')
    .order('name', { ascending: true })
  if (error) return []
  return data ?? []
}

export async function getAllPartners(): Promise<(Partner & { theme: PartnerTheme | null })[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('partners') as any)
    .select('*, theme:partner_themes(*)')
    .order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export async function getPartnerById(id: string): Promise<PartnerWithRelations | null> {
  const supabase = await createClient()
  const [{ data: partner }, { data: links }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from('partners') as any).select('*, theme:partner_themes(*)').eq('id', id).single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from('partner_links') as any).select('*').eq('partner_id', id).order('position'),
  ])
  if (!partner) return null
  return { ...partner, links: links ?? [] }
}

export async function getPublishedPartnerBySlug(slug: string): Promise<PartnerWithRelations | null> {
  const supabase = await createClient()
  const { data: partner } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.from('partners') as any
  )
    .select('*, theme:partner_themes(*), links:partner_links(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (!partner) return null
  return partner
}

export async function createPartner(formData: FormData) {
  const supabase = await createClient()
  const payload = {
    slug: (formData.get('slug') as string).trim().toLowerCase(),
    name: (formData.get('name') as string).trim(),
    tagline: (formData.get('tagline') as string)?.trim() || null,
    bio: (formData.get('bio') as string)?.trim() || null,
    theme_id: formData.get('theme_id') as string,
    status: 'draft' as const,
  }
  const { data, error } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.from('partners') as any
  )
    .insert(payload)
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidatePath('/admin/parceiras')
  return { success: true, id: data.id as string }
}

export async function updatePartner(id: string, formData: FormData) {
  const supabase = await createClient()
  const payload = {
    slug: (formData.get('slug') as string).trim().toLowerCase(),
    name: (formData.get('name') as string).trim(),
    tagline: (formData.get('tagline') as string)?.trim() || null,
    bio: (formData.get('bio') as string)?.trim() || null,
    theme_id: formData.get('theme_id') as string,
    avatar_url: (formData.get('avatar_url') as string)?.trim() || null,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('partners') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/parceiras')
  revalidatePath(`/admin/parceiras/${id}`)
  revalidatePath(`/parceiras/${payload.slug}`)
  return { success: true }
}

export async function setPartnerStatus(id: string, slug: string, status: 'draft' | 'published') {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('partners') as any).update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/parceiras')
  revalidatePath(`/admin/parceiras/${id}`)
  revalidatePath(`/parceiras/${slug}`)
  return { success: true }
}

export async function deletePartner(id: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('partners') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/parceiras')
  return { success: true }
}

export async function addPartnerLink(partnerId: string, slug: string, formData: FormData) {
  const supabase = await createClient()
  const { count } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.from('partner_links') as any
  )
    .select('id', { count: 'exact', head: true })
    .eq('partner_id', partnerId)

  const payload = {
    partner_id: partnerId,
    label: (formData.get('label') as string).trim(),
    url: (formData.get('url') as string).trim(),
    type: (formData.get('type') as string) || 'link',
    icon: (formData.get('icon') as string)?.trim() || null,
    position: count ?? 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('partner_links') as any).insert(payload)
  if (error) return { error: error.message }
  revalidatePath(`/admin/parceiras/${partnerId}`)
  revalidatePath(`/parceiras/${slug}`)
  return { success: true }
}

export async function updatePartnerLink(
  linkId: string,
  partnerId: string,
  slug: string,
  formData: FormData
) {
  const supabase = await createClient()
  const payload = {
    label: (formData.get('label') as string).trim(),
    url: (formData.get('url') as string).trim(),
    type: (formData.get('type') as string) || 'link',
    icon: (formData.get('icon') as string)?.trim() || null,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('partner_links') as any).update(payload).eq('id', linkId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/parceiras/${partnerId}`)
  revalidatePath(`/parceiras/${slug}`)
  return { success: true }
}

export async function toggleLinkActive(
  linkId: string,
  partnerId: string,
  slug: string,
  isActive: boolean
) {
  const supabase = await createClient()
  const { error } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.from('partner_links') as any
  )
    .update({ is_active: isActive })
    .eq('id', linkId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/parceiras/${partnerId}`)
  revalidatePath(`/parceiras/${slug}`)
  return { success: true }
}

export async function deletePartnerLink(linkId: string, partnerId: string, slug: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('partner_links') as any).delete().eq('id', linkId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/parceiras/${partnerId}`)
  revalidatePath(`/parceiras/${slug}`)
  return { success: true }
}

export async function reorderPartnerLinks(partnerId: string, slug: string, orderedIds: string[]) {
  const supabase = await createClient()
  await Promise.all(
    orderedIds.map((id, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from('partner_links') as any).update({ position: index }).eq('id', id)
    )
  )
  revalidatePath(`/admin/parceiras/${partnerId}`)
  revalidatePath(`/parceiras/${slug}`)
  return { success: true }
}
