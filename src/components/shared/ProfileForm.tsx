'use client'

import { useState, useRef } from 'react'
import { Loader2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile'
import type { Profile } from '@/types'

export function ProfileForm({ profile, userEmail }: { profile: Profile; userEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await updateProfile(fd)
    setLoading(false)
    if (result?.error) setError(result.error)
    if (result?.success) setSuccess(result.success)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarLoading(true)
    const fd = new FormData()
    fd.append('avatar', file)
    const result = await uploadAvatar(fd)
    setAvatarLoading(false)
    if (result?.avatarUrl) setAvatarUrl(result.avatarUrl)
    if (result?.error) setError(result.error)
  }

  const initials = profile.full_name?.charAt(0)?.toUpperCase() ?? 'U'

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden"
            style={{ background: 'rgba(255,169,2,0.15)', color: '#c79a3b', border: '2px solid rgba(255,169,2,0.3)' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a' }}
          >
            {avatarLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="font-semibold text-white">{profile.full_name ?? 'Usuário'}</p>
          <p className="text-xs" style={{ color: '#555555' }}>{userEmail}</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-sm font-medium text-white">Nome completo</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name ?? ''}
            className="h-11 bg-secondary border-border text-white focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium" style={{ color: '#555555' }}>E-mail</Label>
          <Input
            value={userEmail}
            disabled
            className="h-11 border-border"
            style={{ background: '#0a0a0a', color: '#555555' }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium text-white">Bio <span style={{ color: '#444444' }}>(opcional)</span></Label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio ?? ''}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg text-sm text-white resize-none outline-none transition-colors focus:ring-2 focus:ring-primary"
            style={{ background: '#1a1a1a', border: '1px solid #222222', color: '#f0f0f0' }}
            placeholder="Conte um pouco sobre você..."
          />
        </div>

        {error && (
          <div className="text-sm px-3 py-2 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm px-3 py-2 rounded-md" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
            {success}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-6 text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a', boxShadow: '0 4px 12px rgba(199,154,59,0.2)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar alterações'}
        </Button>
      </form>
    </div>
  )
}
