'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { signUp } from '@/lib/actions/auth'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    setServerError(null)
    const fd = new FormData()
    fd.append('email', data.email)
    fd.append('password', data.password)
    fd.append('full_name', data.full_name)
    const result = await signUp(fd)
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
          ✉️
        </div>
        <h2 className="text-xl font-bold text-white">Verifique seu e-mail</h2>
        <p className="text-sm" style={{ color: '#888888' }}>{success}</p>
        <Link href="/login" className="block text-sm font-medium hover:underline" style={{ color: '#FFA902' }}>
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-white">Criar conta</h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          Junte-se ao Instituto Despertamente
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-sm font-medium text-white">Nome completo</Label>
          <Input
            id="full_name"
            placeholder="Seu nome"
            autoComplete="name"
            className="h-11 bg-secondary border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            {...register('full_name')}
          />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-white">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            className="h-11 bg-secondary border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-white">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
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
          <Label htmlFor="confirm_password" className="text-sm font-medium text-white">Confirmar senha</Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
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
          style={{ background: '#FFA902', color: '#000', boxShadow: '0 0 20px rgba(255,169,2,0.2)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar conta'}
        </Button>
      </form>

      <p className="text-center text-sm" style={{ color: '#888888' }}>
        Já tem uma conta?{' '}
        <Link href="/login" className="font-medium hover:underline" style={{ color: '#FFA902' }}>
          Entrar
        </Link>
      </p>
    </div>
  )
}
