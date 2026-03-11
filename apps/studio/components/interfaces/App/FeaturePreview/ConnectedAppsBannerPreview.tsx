import { useParams } from 'common'

import { InlineLink } from '@/components/ui/InlineLink'

export const ConnectedAppsBannerPreview = () => {
  const { slug = '_', ref = '_' } = useParams()

  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground-light mb-4">
        Show a project-level awareness banner when your organization has connected OAuth apps.
      </p>
      <ul className="list-disc pl-6 text-sm text-foreground-light space-y-1">
        <li>
          Project scope:{' '}
          <InlineLink href={`/project/${ref}/editor`}>Visible across project pages</InlineLink>
        </li>
        <li>
          Manage connections:{' '}
          <InlineLink href={`/org/${slug}/apps`}>Organization OAuth apps</InlineLink>
        </li>
      </ul>
    </div>
  )
}
