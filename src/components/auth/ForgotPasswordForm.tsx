'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { sendPasswordReset } from '@/lib/actions/auth'

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordInput) {
    setLoading(true)
    setServerError(null)
    const fd = new FormData()
    fd.append('email', data.email)
    const result = await sendPasswordReset(fd)
    setLoading(false)
    if (result?.error) setServerError(result.error)
    if (result?.success) setSuccess(result.success)
  }

  if (success) {
    return (
      <div className="space-y-4 text-center animate-fade-in">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl"
          style={{ background: 'rgba(255,169,2,0.15)', border: '1px solid rgba(255,169,2,0.3)' }}
        >
          📩
        </div>
        <h2 className="text-xl font-bold text-white">E-mail enviado!</h2>
        <p className="text-sm" style={{ color: '#888888' }}>{success}</p>
        <Link href="/login" className="block text-sm font-medium hover:underline" style={{ color: '#FFA902' }}>
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Esqueceu a senha?</h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-white">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="h-11 bg-secondary border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        {serverError && (
          <div
            className="text-sm text-center py-2 px-3 rounded-md"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 text-sm font-semibold"
          style={{ background: '#FFA902', color: '#000' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar link de redefinição'}
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm hover:underline transition-colors"
        style={{ color: '#888888' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao login
      </Link>
    </div>
  )
}
