'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Button, cn } from 'ui'

const customerStories = [
  {
    name: 'Resend',
    logo: '/images/customers/logos/resend.png',
    description:
      'Scaling seamlessly to 5,000+ paying customers and millions of emails sent daily with Supabase.',
    author: 'Zeno Rocha, CEO',
    slug: 'resend',
  },
  {
    name: 'Hyper',
    logo: '/images/customers/logos/hyper.svg',
    description:
      'Hyper is an AI-native marketing platform with agents that operate across the entire marketing workflow, powered by Supabase.',
    author: 'Hyper Team',
    slug: 'hyper',
  },
  {
    name: 'Firecrawl',
    logo: '/images/customers/logos/firecrawl.png',
    description:
      'Firecrawl switched from Pinecone to Supabase Vector to boost efficiency and accuracy of chat powered search for documentation.',
    author: 'Mendable Team',
    slug: 'firecrawl',
  },
  {
    name: 'Mobbin',
    logo: '/images/customers/logos/mobbin.png',
    description:
      'How Mobbin migrated 200,000 users from Firebase for a better authentication experience with Supabase.',
    author: 'Anselm Bild, Co-Founder',
    slug: 'mobbin',
  },
  {
    name: 'E2B',
    logo: '/images/customers/logos/e2b.png',
    description:
      'E2B leveraged Supabase to streamline its platform, allowing secure, scalable execution of AI-generated code in the cloud.',
    author: 'Vasek Mlejnsky, Co-Founder',
    slug: 'e2b',
  },
]

const aiBuilderStories = [
  {
    name: 'Bolt',
    logo: '/images/logos/publicity/bolt.svg',
    description: 'We store embeddings in a PostgreSQL database, hosted by Supabase.',
    slug: 'bolt',
    gradient: 'linear-gradient(to top, #0a1a3a 0%, #1a3f6f 30%, #2563eb 65%, #60a5fa 100%)',
  },
  {
    name: 'Lovable',
    logo: '/images/logos/publicity/lovable.svg',
    description:
      'We store embeddings in a PostgreSQL database. Supabase is a great partner for us as we scale.',
    slug: 'lovable',
    gradient:
      'linear-gradient(to bottom, #c4b5fd 0%, #a78bfa 20%, #ec4899 50%, #fb7185 75%, #ef4444 100%)',
  },
]

function LovableLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 121 122" fill="none" className={className}>
      <path
        fill="white"
        fillRule="evenodd"
        d="M36.069 0c19.92 0 36.068 16.155 36.068 36.084v13.713h12.004c19.92 0 36.069 16.156 36.069 36.084 0 19.928-16.149 36.083-36.069 36.083H0v-85.88C0 16.155 16.148 0 36.069 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function CustomerStoriesSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = customerStories[activeIdx]

  return (
    <div className="py-24 flex flex-col gap-16 border-b border-border">
      {/* Header row */}
      <div className="">
        <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h3 className="text-2xl md:text-4xl text-foreground-lighter max-w-xl">
              How industry leaders <br />{' '}
              <span className="text-foreground">are building with Supabase</span>
            </h3>
            <Link
              href="/customers"
              className="text-sm text-foreground-light hover:text-foreground underline"
            >
              More customer stories
            </Link>
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div className="px-6 mx-auto max-w-[var(--container-max-w,75rem)]">
        <div className="border border-border rounded-md overflow-clip">
          {/* Mobile: stacked cards */}
          <div className="flex flex-col md:hidden">
            {customerStories.map((story, index) => {
              const isActive = index === activeIdx
              return (
                <button
                  key={story.slug}
                  onClick={() => setActiveIdx(index)}
                  className={cn(
                    'text-left border-b border-border last:border-b-0 p-6 flex flex-col gap-4 overflow-hidden',
                    isActive ? 'bg-surface-75' : 'hover:bg-surface-75/50'
                  )}
                >
                  <img
                    src={story.logo}
                    alt={story.name}
                    className="size-16 rounded object-contain shrink-0 dark:invert"
                  />
                  {isActive && (
                    <div className="flex flex-col gap-1.5 flex-1">
                      <p className="text-foreground text-sm font-medium">{story.name}</p>
                      <p className="text-foreground-lighter text-sm leading-relaxed text-pretty">
                        {story.description}
                      </p>
                      <p className="text-foreground-muted text-xs mt-1">{story.author}</p>
                      <Link
                        href={`/customers/${story.slug}`}
                        className="text-sm text-foreground-light hover:text-foreground underline mt-2"
                      >
                        View more about {story.name}
                      </Link>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Desktop: animated accordion grid */}
          <motion.div
            className="hidden md:grid min-h-[480px]"
            initial={false}
            animate={{
              gridTemplateColumns: customerStories
                .map((_, i) => (i === activeIdx ? '4fr' : '1fr'))
                .join(' '),
            }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          >
            {customerStories.map((story, index) => {
              const isActive = index === activeIdx
              return (
                <button
                  key={story.slug}
                  onClick={() => setActiveIdx(index)}
                  className={cn(
                    'text-left border-r border-border last:border-r-0 p-6 flex flex-col gap-8 overflow-hidden',
                    isActive ? 'bg-surface-75' : 'hover:bg-surface-75/50'
                  )}
                >
                  <motion.img
                    layoutId={`logo-${story.slug}`}
                    src={story.logo}
                    alt={story.name}
                    className="size-20 rounded object-contain shrink-0 dark:invert"
                    style={{ alignSelf: isActive ? 'flex-start' : 'center' }}
                    transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                  />

                  <motion.div
                    className="flex flex-col gap-1.5 flex-1 w-[30rem]"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      filter: isActive ? 'blur(0px)' : 'blur(2px)',
                    }}
                    transition={{
                      duration: 0.42,
                      ease: [0.165, 0.84, 0.44, 1],
                      delay: isActive ? 0.2 : 0,
                    }}
                  >
                    <p className="text-foreground text-sm font-medium">{story.name}</p>
                    <p className="text-foreground-lighter text-sm leading-relaxed text-pretty">
                      {story.description}
                    </p>
                    <p className="text-foreground-muted text-xs mt-1">{story.author}</p>
                    <Link
                      href={`/customers/${story.slug}`}
                      className="text-sm text-foreground-light hover:text-foreground underline mt-auto"
                    >
                      View more about {story.name}
                    </Link>
                  </motion.div>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* AI Builder stories */}
      <div className="mt-10">
        <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            <div className="flex flex-col md:min-h-[320px] gap-4 justify-between">
              <h3 className="text-xl md:text-3xl text-foreground-lighter">
                Powering the next wave
                <br />
                <span className="text-foreground">of AI builders</span>
              </h3>
              <p className="text-sm text-foreground-lighter leading-relaxed text-pretty max-w-sm">
                Create full backend experiences in behalf of your users with Supabase for Platforms,
                the all-in-one solution for building AI-native platforms and marketplaces.
              </p>

              <Button type="default" size="medium" asChild className="w-fit mt-auto">
                <Link href="/partners/integrations">Explore Supabase for Platforms</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiBuilderStories.map((story) => (
                <Link
                  key={story.slug}
                  href={`/customers/${story.slug}`}
                  className="group relative overflow-hidden rounded-md w-full aspect-[4/2.5] md:aspect-auto md:h-full flex items-center justify-center"
                  style={{ background: story.gradient }}
                >
                  {story.slug === 'lovable' ? (
                    <LovableLogo className="h-12 w-auto relative z-10 select-none" />
                  ) : (
                    <img
                      src={story.logo}
                      alt={story.name}
                      className="h-12 w-auto object-contain brightness-0 invert relative z-10 select-none"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium mb-1">{story.name}</p>
                    <p className="text-white/70 text-xs leading-relaxed text-pretty">
                      {story.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
