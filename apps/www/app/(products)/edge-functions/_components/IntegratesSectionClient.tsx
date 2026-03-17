'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Database, HardDrive, Shield, Webhook, Zap } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from 'ui'

const ICONS = { Zap, Database, Webhook, Shield, HardDrive } as const

type IconName = keyof typeof ICONS

type UseCase = {
  icon: IconName
  label: string
  paragraph: React.ReactNode
  darkHtml: string
  lightHtml: string
}

const INTERVAL_DURATION = 6000 // ms per tab

export function IntegratesSectionClient({ useCases }: { useCases: UseCase[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 })
  const active = useCases[activeIdx]

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    setProgress(0)
    const updateFrequency = 30
    const increment = (100 / INTERVAL_DURATION) * updateFrequency
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) return 100
        return next
      })
    }, updateFrequency)
  }, [clearTimer])

  // Auto-advance when progress completes
  useEffect(() => {
    if (progress >= 100) {
      setActiveIdx((prev) => (prev + 1) % useCases.length)
    }
  }, [progress, useCases.length])

  // Start/stop timer based on visibility
  useEffect(() => {
    if (inView) {
      startTimer()
    } else {
      clearTimer()
    }
    return clearTimer
  }, [inView, activeIdx, startTimer, clearTimer])

  const handleTabClick = (index: number) => {
    setActiveIdx(index)
    startTimer()
  }

  return (
    <div ref={inViewRef} className="py-24 flex flex-col gap-16">
      {/* Header */}
      <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 w-full">
        <h3 className="text-2xl md:text-4xl text-foreground-lighter max-w-xl">
          Integrates with the <span className="text-foreground">Supabase ecosystem</span>
        </h3>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 w-full">
        <div className="border border-border rounded-md overflow-clip">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: vertical tabs */}
            <div className="flex flex-col">
              {useCases.map((useCase, index) => {
                const isActive = index === activeIdx
                return (
                  <button
                    key={useCase.label}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      'relative text-left flex flex-col gap-1 px-6 py-5 transition-colors',
                      isActive
                        ? 'bg-surface-75 text-foreground'
                        : 'text-foreground-muted hover:text-foreground-light hover:bg-surface-75/50'
                    )}
                  >
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      {(() => {
                        const Icon = ICONS[useCase.icon]
                        return <Icon size={14} strokeWidth={2} />
                      })()}
                      {useCase.label}
                    </h4>
                    <p
                      className={cn(
                        'text-sm transition-colors',
                        isActive ? 'text-foreground-lighter' : 'text-foreground-muted'
                      )}
                    >
                      {useCase.paragraph}
                    </p>
                    {/* Progress bar — hide on last item to avoid doubling with section border */}
                    <div
                      className={cn(
                        'absolute bottom-0 left-0 right-0 h-[1px] bg-border-strong overflow-hidden',
                        index === useCases.length - 1 && 'hidden'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          className={cn(
                            'absolute inset-0 w-full right-full bg-foreground-muted h-full transition-opacity',
                            progress > 99.5 ? 'opacity-0' : 'opacity-100'
                          )}
                          style={{ x: `${progress - 100}%` }}
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right: code area */}
            <div className="relative min-h-[440px] overflow-auto lg:border-l border-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15, delay: 0.05 } }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: active.darkHtml }}
                    className="hidden dark:block [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-6"
                    style={{ fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.7 }}
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: active.lightHtml }}
                    className="block dark:hidden [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-6"
                    style={{ fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.7 }}
                  />
                </motion.div>
              </AnimatePresence>
              <Link
                href="/docs/guides/functions"
                className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-surface-100 border border-border px-3 py-1.5 text-xs text-foreground-light hover:text-foreground hover:bg-surface-200 transition-colors whitespace-nowrap"
              >
                Documentation
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M3.5 2.5H9.5V8.5M9.5 2.5L2.5 9.5"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
