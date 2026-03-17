import { LOCAL_STORAGE_KEYS, useParams } from 'common'
import { useOrgSubscriptionQuery } from 'data/subscriptions/org-subscription-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'
import { X, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from 'ui'

export const ComputeUpgradeFloatingNotice = () => {
  const { ref } = useParams()
  const { data: project } = useSelectedProjectQuery()
  const { data: org } = useSelectedOrganizationQuery()
  const { data: subscription } = useOrgSubscriptionQuery({ orgSlug: org?.slug })

  const [isDismissed, setIsDismissed] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.MICRO_UPGRADE_BANNER_DISMISSED(ref ?? ''),
    false
  )
  const [isHovered, setIsHovered] = useState(false)

  const isProPlan = subscription?.plan.id === 'pro'
  const isOnNano = project?.infra_compute_size === 'nano'

  if (isDismissed || !isProPlan || !isOnNano) return null

  return (
    // Outer: positions above badge center + handles float animation
    <motion.div
      className="absolute bottom-full left-1/2 mb-2 z-10"
      style={{ x: '-50%' }}
      animate={isHovered ? { y: 0 } : { y: [0, -6, 0] }}
      transition={
        isHovered
          ? { duration: 0.2, ease: 'easeOut' }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Inner: expands from center via layout animation */}
      <motion.div
        layout
        className={`relative flex items-center gap-2 rounded-full bg-background backdrop-blur-sm border border-brand-500 shadow-md text-brand-600 ${isHovered ? 'pl-2 pr-3 py-1.5' : 'pl-1 pr-2.5 py-1'} cursor-default overflow-hidden whitespace-nowrap`}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <span className="absolute inset-0 bg-brand bg-opacity-10 w-full h-full" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isHovered ? 'icon-expanded' : 'icon-collapsed'}
            layout
            className={`flex-shrink-0 flex items-center justify-center rounded-full bg-brand-300 text-brand ${isHovered ? 'h-6 w-6' : 'h-4 w-4'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Zap size={isHovered ? 12 : 10} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {isHovered ? (
            <motion.div
              key="expanded"
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
              transition={{ duration: 0.25, delay: 0.18 }}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium leading-tight">Upgrade to Micro</span>
                <span className="text-[11px] text-foreground leading-tight">
                  Double the memory at no extra cost.
                </span>
              </div>
              <Button asChild type="primary" size="tiny" className="flex-shrink-0 !px-2 !py-1">
                <Link href={`/project/${ref}/settings/compute-and-disk`}>Upgrade</Link>
              </Button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="flex-shrink-0 text-brand/50 hover:text-foreground transition-colors h-4 w-4"
                aria-label="Dismiss"
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : (
            <motion.span
              key="collapsed"
              className="text-xs font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
              transition={{ duration: 0.2, delay: 0.12 }}
            >
              Upgrade available!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
