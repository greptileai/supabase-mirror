import { useStripeSyncingState } from 'data/database-integrations/stripe/sync-state-query'
import { SchemasVariables, useSchemasQuery } from 'data/database/schemas-query'
import { useEffect } from 'react'
import { getCurrentVersion, parseSchemaComment } from 'stripe-experiment-sync/supabase'

import {
  findStripeSchema,
  isInProgress,
  isInstalled,
  type StripeSyncStatusResult,
} from '@/components/interfaces/Integrations/templates/StripeSyncEngine/stripe-sync-status'

// Maximum time allowed for installation or uninstallation operations before the UI times out
const OPERATION_TIME_OUT_MS: number = 5 * 60 * 1000 // 5 minutes

/**
 * Unified hook for Stripe Sync installation status.
 *
 * This hook consolidates all schema querying, status parsing, and polling logic
 * into a single source of truth. It returns a discriminated union status that
 * makes impossible states unrepresentable.
 */
export function useStripeSyncStatus({
  projectRef,
  connectionString,
}: SchemasVariables): StripeSyncStatusResult {
  // Query schemas once
  const {
    data: schemas,
    isLoading: isSchemasLoading,
    refetch,
  } = useSchemasQuery({ projectRef, connectionString }, { enabled: !!projectRef })

  // Find and parse stripe schema status
  const stripeSchema = findStripeSchema(schemas)
  const schemaComment = parseSchemaComment(stripeSchema?.comment)

  const installed = isInstalled(schemaComment.status)
  const inProgress = isInProgress(schemaComment.status)

  // Poll schemas during install/uninstall operations
  useEffect(() => {
    // Return if installation/uninstallation is not in progress
    // inProgres is likely to be false during initial render
    if (!inProgress) return

    const interval = setInterval(() => {
      refetch()
    }, 5000)

    return () => clearInterval(interval)
  }, [inProgress, refetch])

  const now = Date.now()
  const timedOut = schemaComment.startTime
    ? now - schemaComment.startTime > OPERATION_TIME_OUT_MS
    : false

  if (timedOut) {
    if (schemaComment.status == 'installing') {
      schemaComment.status = 'install error'
      schemaComment.errorMessage = 'Installation timed out'
    } else if (schemaComment.status == 'uninstalling') {
      schemaComment.status = 'uninstall error'
      schemaComment.errorMessage = 'Uninstallation timed out'
    }
  }

  // Query sync state only when installed
  const { data: syncState } = useStripeSyncingState(
    { projectRef: projectRef!, connectionString },
    {
      refetchInterval: 4000,
      enabled: !!projectRef && installed,
    }
  )

  const latestAvailableVersion = getCurrentVersion()

  return {
    schemaComment,
    syncState: installed ? syncState : undefined,
    isLoading: isSchemasLoading,
    latestAvailableVersion,
    timedOut,
  }
}
