import { LOCAL_STORAGE_KEYS, useParams } from 'common'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { useTrack } from 'lib/telemetry/track'
import { Cpu } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'ui'
import { BannerCard } from '../BannerCard'
import { useBannerStack } from '../BannerStackProvider'

interface BannerComputeExhaustionProps {
  isCritical: boolean
}

export const BannerComputeExhaustion = ({ isCritical }: BannerComputeExhaustionProps) => {
  const track = useTrack()
  const { ref } = useParams()
  const { dismissBanner } = useBannerStack()
  const [, setIsDismissed] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.COMPUTE_EXHAUSTION_BANNER_DISMISSED(ref ?? ''),
    false
  )

  const title = isCritical ? 'Compute is maxed out' : 'Compute is running high'
  const description = isCritical
    ? 'Your project CPU or memory is at 100%. Performance is severely affected — consider upgrading your compute.'
    : 'Your project is experiencing high CPU or memory usage. Upgrading your compute can prevent downtime.'

  return (
    <BannerCard
      onDismiss={() => {
        setIsDismissed(true)
        dismissBanner('compute-exhaustion-banner')
        track('compute_exhaustion_banner_dismiss_button_clicked', { is_critical: isCritical })
      }}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2 items-start">
          <div
            className={`p-2 rounded-lg ${isCritical ? 'bg-destructive-300 text-destructive' : 'bg-warning-300 text-warning'}`}
          >
            <Cpu size={16} />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 mb-2">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-foreground-lighter text-balance">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild type="primary" size="tiny">
            <Link
              href={`/project/${ref}/settings/compute-and-disk`}
              onClick={() =>
                track('compute_exhaustion_banner_upgrade_button_clicked', {
                  is_critical: isCritical,
                })
              }
            >
              Upgrade compute
            </Link>
          </Button>
        </div>
      </div>
    </BannerCard>
  )
}
