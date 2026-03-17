'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Badge, cn } from 'ui'

type ApiExample = {
  title: string
  darkHtml: string
  lightHtml: string
}

const LIBRARIES = [
  { label: 'Javascript', href: '/docs/reference/javascript/introduction' },
  { label: 'Flutter', href: '/docs/reference/dart/introduction' },
  { label: 'Python', href: '/docs/reference/python/introduction' },
  { label: 'C#', href: '/docs/reference/csharp/introduction' },
  { label: 'Kotlin', href: '/docs/reference/kotlin/introduction' },
  { label: 'Swift', href: '/docs/reference/swift/introduction' },
]

export function ApiSectionClient({ examples }: { examples: ApiExample[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = examples[activeIdx]

  return (
    <div className="py-24">
      <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: title + libraries */}
          <div className="min-w-0 flex flex-col justify-between pt-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl md:text-4xl text-foreground-lighter">
                Never write an API
                <span className="block text-foreground">again</span>
              </h3>

              <p className="text-foreground-lighter text-sm mt-4 max-w-md">
                We introspect your database and provide instant APIs. Focus on building your
                product, while Supabase handles the CRUD.
              </p>
            </div>

            {/* Available libraries */}
            <div className="flex flex-col gap-2 pb-4">
              <span className="text-foreground-muted text-sm">Available libraries</span>
              <div className="flex flex-wrap gap-1.5">
                {LIBRARIES.map((lib) => (
                  <Link key={lib.label} href={lib.href} target="_blank" className="flex">
                    <Badge>{lib.label}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: tabs + code */}
          <div className="min-w-0 flex flex-col border border-border rounded-md overflow-clip">
            {/* Tab row */}
            <div className="flex border-b border-border">
              {examples.map((example, index) => (
                <button
                  key={example.title}
                  onClick={() => setActiveIdx(index)}
                  className={cn(
                    'flex-1 flex items-center justify-center text-xs px-3 py-4 border-r border-border last:border-r-0 transition-colors whitespace-nowrap',
                    index === activeIdx
                      ? 'bg-surface-75 text-foreground'
                      : 'text-foreground-muted hover:text-foreground-light hover:bg-surface-75/50'
                  )}
                >
                  {example.title}
                </button>
              ))}
            </div>

            {/* Code area */}
            <div className="relative h-[440px] overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.title}
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
                href="/docs/guides/database"
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
