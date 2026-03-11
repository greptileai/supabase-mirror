import type { AuthorizedAppsData } from 'data/oauth/authorized-apps-query'

const PROJECT_ROUTE_PREFIX = '/project/'
const PROJECT_ROUTE_TEMPLATE = '/project/[ref]'
const MAX_APPS_IN_TITLE = 2

const sanitizeAppName = (name: string) => name.trim().replace(/\s+/g, ' ')

export const isProjectRoute = ({ pathname, asPath }: { pathname?: string; asPath?: string }) =>
  Boolean(pathname?.startsWith(PROJECT_ROUTE_TEMPLATE) || asPath?.startsWith(PROJECT_ROUTE_PREFIX))

export const getAuthorizedAppDisplayData = (authorizedApps: AuthorizedAppsData = []) => {
  const uniqueApps = new Map<string, { name: string; icon: string | null }>()

  authorizedApps.forEach((app) => {
    const safeName = sanitizeAppName(app.name)
    if (!safeName) return

    const normalizedName = safeName.toLowerCase()
    if (!uniqueApps.has(normalizedName)) {
      uniqueApps.set(normalizedName, { name: safeName, icon: app.icon })
      return
    }

    // Backfill an icon if a duplicate app entry has one and the first did not.
    const existingApp = uniqueApps.get(normalizedName)
    if (existingApp && !existingApp.icon && app.icon) {
      uniqueApps.set(normalizedName, { name: existingApp.name, icon: app.icon })
    }
  })

  return Array.from(uniqueApps.values())
}

const getConnectedAppsLabel = (appNames: string[]) => {
  if (appNames.length === 0) return 'external apps'
  if (appNames.length === 1) return appNames[0]
  if (appNames.length === 2) return `${appNames[0]} and ${appNames[1]}`

  const [firstName, secondName] = appNames
  const additionalApps = appNames.length - MAX_APPS_IN_TITLE
  const suffix = additionalApps === 1 ? 'other app' : 'other apps'

  return `${firstName}, ${secondName}, and ${additionalApps} ${suffix}`
}

export const getConnectedAppsTitle = (appNames: string[]) =>
  `This project is connected to ${getConnectedAppsLabel(appNames)}`

export const getConnectedAppsDescription = (appNames: string[]) => {
  const connectedAppsLabel = getConnectedAppsLabel(appNames)
  return `Changes made here may affect how your project works in ${connectedAppsLabel}.`
}
