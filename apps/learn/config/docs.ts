import { SidebarNavGroup } from 'types/nav'

export const courses: SidebarNavGroup = {
  title: 'Courses',
  items: [
    {
      title: 'Foundations',
      href: '/foundations',
      items: [
        {
          title: 'Introduction',
          href: '/foundations/introduction',
        },
        {
          title: 'Platform Architecture',
          items: [
            {
              title: 'Supabase Architecture',
              href: '/foundations/supabase-architecture',
            },
            {
              title: 'When to Choose Supabase',
              href: '/foundations/when-to-choose-supabase',
            },
            {
              title: 'Project Setup and Configuration',
              href: '/foundations/project-setup-and-configuration',
            },
            {
              title: 'Local Development Workflow',
              href: '/foundations/local-development-workflow',
            },
          ],
        },
        {
          title: 'Database Design & Postgres',
          items: [
            {
              title: 'Schema Design for Supabase',
              href: '/foundations/schema-design-for-supabase',
            },
            {
              title: 'Essential Postgres Data Types',
              href: '/foundations/essential-postgres-data-types',
            },
            {
              title: 'Database Functions and Triggers',
              href: '/foundations/database-functions-and-triggers',
            },
            {
              title: 'Key Postgres Extensions',
              href: '/foundations/key-postgres-extensions',
            },
            {
              title: 'Migrations and Version Control',
              href: '/foundations/migrations-and-version-control',
            },
            {
              title: 'Replication',
              href: '/foundations/replication',
            },
          ],
        },
        {
          title: 'Authentication & Users',
          items: [
            {
              title: 'Authentication Fundamentals',
              href: '/foundations/authentication-fundamentals',
            },
            {
              title: 'Authentication Methods',
              href: '/foundations/authentication-methods',
            },
            {
              title: 'Advanced Authentication',
              href: '/foundations/advanced-authentication',
            },
            {
              title: 'User Management',
              href: '/foundations/user-management',
            },
            {
              title: 'Security Considerations',
              href: '/foundations/security-considerations',
            },
          ],
        },
        {
          title: 'Row Level Security',
          items: [
            {
              title: 'RLS Fundamentals',
              href: '/foundations/rls-fundamentals',
            },
            {
              title: 'Policy Patterns',
              href: '/foundations/policy-patterns',
            },
            {
              title: 'Auth Helper Functions',
              href: '/foundations/auth-helper-functions',
            },
            {
              title: 'Multi-Tenancy Patterns',
              href: '/foundations/multi-tenancy-patterns',
            },
            {
              title: 'Performance Optimization',
              href: '/foundations/rls-performance-optimization',
            },
            {
              title: 'Pitfalls & Debugging',
              href: '/foundations/common-pitfalls-and-debugging',
            },
          ],
        },
        {
          title: 'Storage',
          items: [
            {
              title: 'Storage Architecture',
              href: '/foundations/storage-architecture',
            },
            {
              title: 'Access Control',
              href: '/foundations/access-control',
            },
            {
              title: 'File Operations',
              href: '/foundations/file-operations',
            },
            {
              title: 'Image Transformations',
              href: '/foundations/image-transformations',
            },
            {
              title: 'Integration Patterns',
              href: '/foundations/integration-patterns',
            },
          ],
        },
        {
          title: 'Realtime',
          items: [
            {
              title: 'Realtime Architecture',
              href: '/foundations/realtime-architecture',
            },
            {
              title: 'Database Changes',
              href: '/foundations/database-changes',
            },
            {
              title: 'Broadcast',
              href: '/foundations/broadcast',
            },
            {
              title: 'Presence',
              href: '/foundations/presence',
            },
            {
              title: 'Real-World Patterns',
              href: '/foundations/real-world-patterns',
            },
          ],
        },
        {
          title: 'Edge Functions',
          items: [
            {
              title: 'Edge Functions Architecture',
              href: '/foundations/edge-functions-architecture',
            },
            {
              title: 'Development Workflow',
              href: '/foundations/development-workflow',
            },
            {
              title: 'Common Patterns',
              href: '/foundations/common-patterns',
            },
            {
              title: 'Database Integration',
              href: '/foundations/database-integration',
            },
            {
              title: 'AI and LLM Integration',
              href: '/foundations/ai-and-llm-integration',
            },
            {
              title: 'Advanced Topics',
              href: '/foundations/advanced-topics',
            },
          ],
        },
        {
          title: 'AI and Vectors',
          items: [
            {
              title: 'Vector Fundamentals',
              href: '/foundations/vector-fundamentals',
            },
            {
              title: 'Indexing Strategies',
              href: '/foundations/indexing-strategies',
            },
            {
              title: 'Search Patterns',
              href: '/foundations/search-patterns',
            },
            {
              title: 'RAG Implementation',
              href: '/foundations/rag-implementation',
            },
            {
              title: 'Production Considerations',
              href: '/foundations/production-considerations',
            },
          ],
        },
        {
          title: 'Production Readiness',
          items: [
            {
              title: 'Performance Optimization',
              href: '/foundations/performance-optimization',
            },
            {
              title: 'Monitoring & Observability',
              href: '/foundations/monitoring-and-observability',
            },
            {
              title: 'Security Hardening',
              href: '/foundations/security-hardening',
            },
            {
              title: 'Backup and Recovery',
              href: '/foundations/backup-and-recovery',
            },
            {
              title: 'Deployment Patterns',
              href: '/foundations/deployment-patterns',
            },
            {
              title: 'Client Considerations',
              href: '/foundations/client-considerations',
            },
          ],
        },
      ],
      commandItemLabel: 'Foundations',
    },
  ],
}

// Recursively extract all items with hrefs for command palette
function extractCommandItems(
  items: any[],
  parentLabel?: string
): { label: string; href: string }[] {
  const result: { label: string; href: string }[] = []

  items.forEach((item) => {
    if (item.href) {
      const label = parentLabel ? `${parentLabel}: ${item.title}` : item.title
      result.push({ label, href: item.href })
    }

    if (item.items && item.items.length > 0) {
      const childLabel = item.commandItemLabel || item.title
      result.push(...extractCommandItems(item.items, childLabel))
    }
  })

  return result
}

export const COMMAND_ITEMS = extractCommandItems(courses.items)
