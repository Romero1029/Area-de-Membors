"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-100
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
};

export function ProgressBar({
  value,
  size = "sm",
  showLabel = false,
  animated = false,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#888888]">Progresso</span>
          <span className="text-xs font-medium text-[#FFA902]">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full bg-[#222222] rounded-full overflow-hidden ${sizeMap[size]}`}
      >
        <motion.div
          className={`h-full rounded-full ${animated ? "progress-animated" : "bg-[#FFA902]"}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
