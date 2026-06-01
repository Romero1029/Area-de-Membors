'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduce ? 0 : 24 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 16, scale: shouldReduce ? 1 : 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: shouldReduce ? 0 : 16, scale: shouldReduce ? 1 : 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}
