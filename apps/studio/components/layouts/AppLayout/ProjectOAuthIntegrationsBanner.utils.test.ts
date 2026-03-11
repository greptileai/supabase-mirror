import { describe, expect, it } from 'vitest'

import type { AuthorizedApp } from 'data/oauth/authorized-apps-query'
import {
  getAuthorizedAppDisplayData,
  getConnectedAppsDescription,
  getConnectedAppsTitle,
  isProjectRoute,
} from './ProjectOAuthIntegrationsBanner.utils'

const createAuthorizedApp = (overrides: Partial<AuthorizedApp>): AuthorizedApp => ({
  id: 'auth-app-id',
  app_id: 'oauth-app-id',
  icon: null,
  name: 'Lovable',
  website: 'https://example.com',
  created_by: 'user-1',
  authorized_at: new Date().toISOString(),
  ...overrides,
})

describe('ProjectOAuthIntegrationsBanner utils', () => {
  it('detects project routes from pathname or asPath', () => {
    expect(isProjectRoute({ pathname: '/project/[ref]/database/tables' })).toBe(true)
    expect(isProjectRoute({ pathname: '/unknown', asPath: '/project/default/functions' })).toBe(
      true
    )
    expect(isProjectRoute({ pathname: '/org/[slug]/apps', asPath: '/org/default/apps' })).toBe(
      false
    )
  })

  it('returns unique display-safe apps and backfills icons from duplicate entries', () => {
    const displayApps = getAuthorizedAppDisplayData([
      createAuthorizedApp({ name: '  Lovable  ' }),
      createAuthorizedApp({ name: 'lovable' }),
      createAuthorizedApp({ name: 'Bolt.new' }),
      createAuthorizedApp({ name: ' ' }),
      createAuthorizedApp({ name: 'Figma', icon: null }),
      createAuthorizedApp({ name: 'figma', icon: 'https://cdn.example.com/figma.png' }),
    ])

    expect(displayApps).toEqual([
      { name: 'Lovable', icon: null },
      { name: 'Bolt.new', icon: null },
      { name: 'Figma', icon: 'https://cdn.example.com/figma.png' },
    ])
  })

  it('renders connected app titles for single and multi-app cases', () => {
    expect(getConnectedAppsTitle(['Lovable'])).toBe('This project is connected to Lovable')
    expect(getConnectedAppsTitle(['Lovable', 'Bolt', 'Replit'])).toBe(
      'This project is connected to Lovable, Bolt, and 1 other app'
    )
  })

  it('renders a connected app description', () => {
    expect(getConnectedAppsDescription(['Lovable'])).toBe(
      'Changes made here may affect how your project works in Lovable.'
    )
  })
})
