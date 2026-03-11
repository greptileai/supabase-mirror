import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthorizedApp } from 'data/oauth/authorized-apps-query'
import { render } from 'tests/helpers'
import { routerMock } from 'tests/lib/route-mock'
import { ProjectOAuthIntegrationsBanner } from './ProjectOAuthIntegrationsBanner'

const mockUseSelectedOrganizationQuery = vi.fn()
const mockUseAuthorizedAppsQuery = vi.fn()
const mockUseIsProjectOauthIntegrationsBannerEnabled = vi.fn()

vi.mock('hooks/misc/useSelectedOrganization', () => ({
  useSelectedOrganizationQuery: () => mockUseSelectedOrganizationQuery(),
}))

vi.mock('data/oauth/authorized-apps-query', () => ({
  useAuthorizedAppsQuery: (...args: unknown[]) => mockUseAuthorizedAppsQuery(...args),
}))

vi.mock('components/interfaces/App/FeaturePreview/FeaturePreviewContext', () => ({
  useIsProjectOauthIntegrationsBannerEnabled: () =>
    mockUseIsProjectOauthIntegrationsBannerEnabled(),
}))

const createAuthorizedApp = (overrides: Partial<AuthorizedApp>): AuthorizedApp => ({
  id: 'authorized-app-1',
  app_id: 'oauth-app-1',
  icon: null,
  name: 'Lovable',
  website: 'https://example.com',
  created_by: 'user-1',
  authorized_at: new Date().toISOString(),
  ...overrides,
})

describe('ProjectOAuthIntegrationsBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routerMock.setCurrentUrl('/project/default/editor')

    mockUseSelectedOrganizationQuery.mockReturnValue({
      data: { slug: 'acme' },
    })
    mockUseIsProjectOauthIntegrationsBannerEnabled.mockReturnValue(true)

    mockUseAuthorizedAppsQuery.mockReturnValue({
      data: [createAuthorizedApp({ name: 'Lovable' })],
      isError: false,
    })
  })

  it('renders on project routes when authorized apps are available', () => {
    render(<ProjectOAuthIntegrationsBanner />)

    expect(screen.getByText('This project is connected to Lovable')).toBeInTheDocument()
    expect(
      screen.getByText('Changes made here may affect how your project works in Lovable.')
    ).toBeInTheDocument()

    const manageLink = screen.getByRole('link', { name: 'Manage' })
    expect(manageLink).toHaveAttribute('href', '/org/acme/apps')
    expect(mockUseAuthorizedAppsQuery).toHaveBeenCalledWith(
      { slug: 'acme' },
      expect.objectContaining({ enabled: true })
    )
  })

  it('does not render on non-project routes', () => {
    routerMock.setCurrentUrl('/org/acme/apps')

    render(<ProjectOAuthIntegrationsBanner />)

    expect(screen.queryByText(/This project is connected to/)).not.toBeInTheDocument()
    expect(mockUseAuthorizedAppsQuery).toHaveBeenCalledWith(
      { slug: 'acme' },
      expect.objectContaining({ enabled: false })
    )
  })

  it('does not render when feature preview is disabled', () => {
    mockUseIsProjectOauthIntegrationsBannerEnabled.mockReturnValue(false)

    render(<ProjectOAuthIntegrationsBanner />)

    expect(screen.queryByText(/This project is connected to/)).not.toBeInTheDocument()
    expect(mockUseAuthorizedAppsQuery).toHaveBeenCalledWith(
      { slug: 'acme' },
      expect.objectContaining({ enabled: false })
    )
  })

  it.each([
    {
      label: 'no authorized apps',
      organization: { slug: 'acme' },
      query: { data: [], isError: false },
    },
    {
      label: 'authorized apps query fails',
      organization: { slug: 'acme' },
      query: { data: [createAuthorizedApp({ name: 'Lovable' })], isError: true },
    },
    {
      label: 'organization context is unavailable',
      organization: undefined,
      query: { data: [createAuthorizedApp({ name: 'Lovable' })], isError: false },
    },
  ])('does not render when banner is ineligible: $label', ({ organization, query }) => {
    mockUseSelectedOrganizationQuery.mockReturnValue({
      data: organization,
    })
    mockUseAuthorizedAppsQuery.mockReturnValue(query)

    render(<ProjectOAuthIntegrationsBanner />)

    expect(screen.queryByText(/This project is connected to/)).not.toBeInTheDocument()
  })
})
