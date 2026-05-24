"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Email ou senha incorretos."); return; }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-[#060606]">
        {/* Warm radial glow */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#FFA902]/8 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-violet-600/6 blur-[100px]" />
          <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
        </div>

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, #FFA902 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col h-full p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#FFA902] flex items-center justify-center shadow-lg shadow-[#FFA902]/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F0F0F0] tracking-tight leading-none">Instituto</p>
              <p className="text-[11px] font-bold text-[#FFA902] tracking-tight leading-none">Despertamente</p>
            </div>
          </div>

          {/* Main quote */}
          <div className="flex-1 flex flex-col justify-center max-w-[480px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-12 h-0.5 bg-[#FFA902] mb-8 rounded-full" />
              <h2 className="text-4xl font-bold text-[#F0F0F0] leading-[1.2] tracking-tight mb-6">
                Desperte o que já<br />
                existe <span className="text-[#FFA902]">dentro de você.</span>
              </h2>
              <p className="text-[#555555] text-base leading-relaxed">
                Uma jornada de autoconhecimento através da Psicanálise,
                Numerologia, PNL e Espiritualidade.
              </p>
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="border border-[#1A1A1A] rounded-[14px] p-5 bg-[#0D0D0D]/60 backdrop-blur-sm"
          >
            <p className="text-sm text-[#888888] leading-relaxed italic mb-4">
              "O Instituto Despertamente transformou minha relação comigo mesma. Cada aula é uma descoberta."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFA902]/30 to-violet-500/30 flex items-center justify-center text-sm font-bold text-[#FFA902]">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-[#CCCCCC]">Ana Beatriz</p>
                <p className="text-[11px] text-[#444444]">Membro desde 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center p-8 bg-[#050505] relative">
        {/* Mobile glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FFA902]/4 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[380px] relative"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-[10px] bg-[#FFA902] flex items-center justify-center shadow-lg shadow-[#FFA902]/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F0F0F0] tracking-tight leading-none">Instituto</p>
              <p className="text-[11px] font-bold text-[#FFA902] tracking-tight leading-none">Despertamente</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#F0F0F0] tracking-tight mb-1">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-[#555555] mb-8">
            Continue sua jornada de autoconhecimento.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#666666] mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="seu@email.com"
                className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-[10px] px-4 py-3 text-sm text-[#F0F0F0] placeholder-[#333333] outline-none focus:border-[#FFA902]/40 focus:bg-[#111111] transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#666666] mb-2 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-[10px] px-4 py-3 text-sm text-[#F0F0F0] placeholder-[#333333] outline-none focus:border-[#FFA902]/40 focus:bg-[#111111] transition-all duration-200 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] hover:text-[#888888] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-center gap-2.5 p-3 bg-red-500/8 border border-red-500/20 rounded-[8px] text-sm text-red-400"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full mt-2 py-3.5 bg-[#FFA902] text-black font-bold text-sm rounded-[10px] hover:bg-[#FFB832] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center gap-2 shadow-lg shadow-[#FFA902]/15"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar na plataforma
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 mt-8 mb-0">
            <div className="flex-1 h-px bg-[#1A1A1A]" />
            <span className="text-[11px] text-[#333333]">acesso exclusivo</span>
            <div className="flex-1 h-px bg-[#1A1A1A]" />
          </div>

          <p className="text-center text-xs text-[#2A2A2A] mt-6">
            Instituto Despertamente · Plataforma de membros
          </p>
        </motion.div>
      </div>
    </div>
  );
}
