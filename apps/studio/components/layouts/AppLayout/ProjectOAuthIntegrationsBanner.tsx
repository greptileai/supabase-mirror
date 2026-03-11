import { useIsProjectOauthIntegrationsBannerEnabled } from 'components/interfaces/App/FeaturePreview/FeaturePreviewContext'
import { useAuthorizedAppsQuery } from 'data/oauth/authorized-apps-query'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'
import { Plug, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Alert_Shadcn_, AlertDescription_Shadcn_, AlertTitle_Shadcn_, Button, cn } from 'ui'

import {
  getAuthorizedAppDisplayData,
  getConnectedAppsDescription,
  getConnectedAppsTitle,
  isProjectRoute,
} from './ProjectOAuthIntegrationsBanner.utils'

export const ProjectOAuthIntegrationsBanner = () => {
  const router = useRouter()
  const { data: selectedOrganization } = useSelectedOrganizationQuery()
  const isProjectOauthIntegrationsBannerEnabled = useIsProjectOauthIntegrationsBannerEnabled()

  const organizationSlug = selectedOrganization?.slug
  const showProjectBanner = isProjectRoute({ pathname: router.pathname, asPath: router.asPath })
  const canShowProjectBanner =
    isProjectOauthIntegrationsBannerEnabled && showProjectBanner && !!organizationSlug

  const { data: authorizedApps = [], isError } = useAuthorizedAppsQuery(
    { slug: organizationSlug },
    { enabled: canShowProjectBanner }
  )

  if (
    !isProjectOauthIntegrationsBannerEnabled ||
    !showProjectBanner ||
    !organizationSlug ||
    isError
  )
    return null

  if (authorizedApps.length === 0) return null

  const displayApps = getAuthorizedAppDisplayData(authorizedApps)
  const appNames = displayApps.map((app) => app.name)
  const appIcon = displayApps.find((app) => app.icon)?.icon ?? null

  return (
    <Alert_Shadcn_
      variant="default"
      className="flex flex-wrap items-center gap-3 border-0 rounded-none border-b light:bg-background-200"
    >
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        {/* Oauth app icon or fallback icon */}
        <div
          className={cn(
            'h-5 w-5 rounded-full bg-no-repeat bg-cover bg-center border border-control flex items-center justify-center text-xs shrink-0',
            !appIcon && 'bg-surface-75'
          )}
          style={{ backgroundImage: appIcon ? `url('${appIcon}')` : 'none' }}
        >
          {!appIcon && <Plug size={12} />}
        </div>
        <div>
          <AlertTitle_Shadcn_>{getConnectedAppsTitle(appNames)}</AlertTitle_Shadcn_>
          <AlertDescription_Shadcn_>
            {getConnectedAppsDescription(appNames)}
          </AlertDescription_Shadcn_>
        </div>
      </div>
      {/* Right: button to manage oauth apps */}
      <Button asChild type="default" icon={<Settings2 />}>
        <Link href={`/org/${organizationSlug}/apps`}>Manage</Link>
      </Button>
    </Alert_Shadcn_>
  )
}
