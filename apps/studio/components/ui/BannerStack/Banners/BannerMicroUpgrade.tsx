import { useParams } from 'common'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'ui'
import { BannerCard } from '../BannerCard'
import { useBannerStack } from '../BannerStackProvider'

export const BannerMicroUpgrade = () => {
  const { ref } = useParams()
  const { dismissBanner } = useBannerStack()

  return (
    <BannerCard onDismiss={() => dismissBanner('micro-upgrade-banner')}>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2 items-start">
          <div className="p-2 rounded-lg bg-brand-300 text-brand">
            <Zap size={16} />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 mb-2">
          <p className="text-sm font-medium">Free Micro compute upgrade available</p>
          <p className="text-xs text-foreground-lighter text-balance">
            Your Pro plan includes a free upgrade from Nano to Micro compute — double the memory at
            no extra cost.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild type="primary" size="tiny">
            <Link href={`/project/${ref}/settings/compute-and-disk`}>Upgrade now</Link>
          </Button>
        </div>
      </div>
    </BannerCard>
  )
}
