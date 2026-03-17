'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from 'ui'

const TABS = [
  {
    label: 'Spreadsheet like editing',
    title: 'The simplicity of a spreadsheet',
    description: 'Add, edit, and update your data with the simplicity of a no-code tool.',
    image: '/images/product/database/table-view/spreadsheet-interface.png',
  },
  {
    label: 'Create tables',
    title: 'Create tables',
    description:
      'Add tables, columns and rows right in the dashboard. Without a single line of SQL.',
    image: '/images/product/database/table-view/create-table.png',
  },
  {
    label: 'Set up foreign keys',
    title: 'Set up foreign keys',
    description:
      'Build connections throughout your data with the full power of a Relational Database.',
    image: '/images/product/database/table-view/foreign-keys.png',
  },
  {
    label: 'Select and Export',
    title: 'Select and Export',
    description: 'Pick the rows you want and export them into a CSV.',
    image: '/images/product/database/table-view/export.png',
  },
]

export function TableEditorSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = TABS[activeIdx]

  return (
    <div className="py-24 flex flex-col gap-16">
      {/* Header */}
      <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 w-full">
        <h3 className="text-2xl md:text-4xl text-foreground-lighter max-w-xl">
          Easy to use
          <br />
          <span className="text-foreground">Table Editor</span>
        </h3>
      </div>

      <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 w-full">
        <div className="border border-border rounded-md overflow-clip">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: tabs + content */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-border">
              {/* Tab row */}
              <div className="flex border-b border-border">
                {TABS.map((tab, index) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveIdx(index)}
                    className={cn(
                      'flex-1 flex items-center justify-center text-xs px-3 py-4 border-r border-border last:border-r-0 transition-colors whitespace-nowrap',
                      index === activeIdx
                        ? 'bg-surface-75 text-foreground'
                        : 'text-foreground-muted hover:text-foreground-light hover:bg-surface-75/50'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content + tweet */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Active tab content */}
                <div className="relative h-[160px] px-6 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.label}
                      initial={{ opacity: 0, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, filter: 'blur(2px)', transition: { duration: 0.1 } }}
                      className="absolute inset-x-6 flex flex-col gap-3"
                    >
                      <h4 className="text-foreground text-lg font-medium">{active.title}</h4>
                      <p className="text-foreground-lighter text-sm max-w-md">
                        {active.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Tweet card */}
                <div className="border-t border-border px-6 py-4 bg-surface-200">
                  <div className="flex items-start gap-3">
                    <img
                      src="/images/twitter-profiles/v6citnk33y2wpeyzrq05_400x400.jpeg"
                      alt="@Elsolo244"
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground text-sm font-medium">@Elsolo244</span>
                      <p className="text-foreground-lighter text-sm">
                        Where has @supabase been all my life?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: visual */}
            <div className="relative h-[480px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.05 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="absolute inset-0 flex items-end justify-center px-6"
                >
                  <Image
                    src={active.image}
                    alt={active.title}
                    width={600}
                    height={400}
                    className="rounded-lg border border-border shadow-sm object-contain -mb-4"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
