'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import { updatePassword } from '@/lib/actions/auth'

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onSubmit(data: ResetPasswordInput) {
    setLoading(true)
    setServerError(null)
    const fd = new FormData()
    fd.append('password', data.password)
    const result = await updatePassword(fd)
    if (result?.error) {
      setServerError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Nova senha</h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          Escolha uma nova senha para sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-white">Nova senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              className="h-11 bg-secondary border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm_password" className="text-sm font-medium text-white">Confirmar nova senha</Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="Repita a nova senha"
            className="h-11 bg-secondary border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            {...register('confirm_password')}
          />
          {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password.message}</p>}
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
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redefinir senha'}
        </Button>
      </form>
    </div>
  )
}
