'use client'
import { useEffect } from 'react'

export function MetaPixelEvent({ event }: { event: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', event)
    }
  }, [event])
  return null
}
