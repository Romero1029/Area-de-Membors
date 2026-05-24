"use client";

type BadgeVariant = "new" | "inProgress" | "completed" | "level" | "category";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const variantConfig: Record<
  BadgeVariant,
  { bg: string; text: string; border: string; defaultLabel: string }
> = {
  new: {
    bg: "bg-[#FFA902]/10",
    text: "text-[#FFA902]",
    border: "border-[#FFA902]/20",
    defaultLabel: "Novo",
  },
  inProgress: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    defaultLabel: "Em andamento",
  },
  completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    defaultLabel: "Concluído",
  },
  level: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    defaultLabel: "Nível",
  },
  category: {
    bg: "bg-[#222222]",
    text: "text-[#888888]",
    border: "border-[#333333]",
    defaultLabel: "Categoria",
  },
};

export function Badge({ variant, label, className = "" }: BadgeProps) {
  const config = variantConfig[variant];
  const text = label ?? config.defaultLabel;

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
        border ${config.bg} ${config.text} ${config.border} ${className}
      `}
    >
      {variant === "new" && (
        <span className="w-1 h-1 rounded-full bg-[#FFA902] animate-pulse" />
      )}
      {variant === "completed" && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M1.5 4L3.5 6L6.5 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {text}
    </span>
  );
}
