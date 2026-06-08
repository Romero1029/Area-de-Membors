'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Live {
  id: string
  title: string
  description: string | null
  date_label: string
  time_label: string
  audience: string
  status: 'live' | 'scheduled' | 'ended' | 'cancelled'
  join_url: string | null
  calendar_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getLives(): Promise<Live[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('lives')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) return []
  return data ?? []
}

export async function getAllLives(): Promise<Live[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('lives')
    .select('*')
    .order('sort_order')
  if (error) return []
  return data ?? []
}

export async function createLive(formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('lives').insert({
    title:        formData.get('title'),
    description:  formData.get('description') || null,
    date_label:   formData.get('date_label'),
    time_label:   formData.get('time_label'),
    audience:     formData.get('audience') || 'Todos os alunos',
    status:       formData.get('status') || 'scheduled',
    join_url:     formData.get('join_url') || null,
    calendar_url: formData.get('calendar_url') || null,
    sort_order:   Number(formData.get('sort_order')) || 0,
  })
  revalidatePath('/admin/ao-vivo')
  revalidatePath('/ao-vivo')
}

export async function updateLive(id: string, formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('lives').update({
    title:        formData.get('title'),
    description:  formData.get('description') || null,
    date_label:   formData.get('date_label'),
    time_label:   formData.get('time_label'),
    audience:     formData.get('audience') || 'Todos os alunos',
    status:       formData.get('status') || 'scheduled',
    join_url:     formData.get('join_url') || null,
    calendar_url: formData.get('calendar_url') || null,
    sort_order:   Number(formData.get('sort_order')) || 0,
  }).eq('id', id)
  revalidatePath('/admin/ao-vivo')
  revalidatePath('/ao-vivo')
}

export async function deleteLive(id: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('lives').delete().eq('id', id)
  revalidatePath('/admin/ao-vivo')
  revalidatePath('/ao-vivo')
}

export async function toggleLiveStatus(id: string, status: Live['status']) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('lives').update({ status }).eq('id', id)
  revalidatePath('/admin/ao-vivo')
  revalidatePath('/ao-vivo')
}
