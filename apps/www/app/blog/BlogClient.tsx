'use client'

import { useState, useCallback } from 'react'
import BlogGridItem from 'components/Blog/BlogGridItem'
import BlogListItem from 'components/Blog/BlogListItem'
import BlogFilters from 'components/Blog/BlogFilters'
import FeaturedThumb from 'components/Blog/FeaturedThumb'
import { LOCAL_STORAGE_KEYS, isBrowser } from 'common'
import { useInfiniteScrollWithFetch } from 'hooks/useInfiniteScroll'

import type PostTypes from 'types/post'

export type BlogView = 'list' | 'grid'

const POSTS_PER_PAGE = 25
const SKELETON_COUNT = 6

function BlogListItemSkeleton() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-10 xl:grid-cols-12 w-full px-6 py-2 sm:py-4 h-full border-b border-border last:border-b-0">
      <div className="flex w-full lg:col-span-8 xl:col-span-8">
        <div className="h-6 bg-foreground-muted/20 rounded animate-pulse w-3/4" />
      </div>
      <div className="lg:col-span-2 xl:col-span-4 flex justify-start items-center lg:grid grid-cols-2 xl:grid-cols-3 gap-2 text-sm mt-2 lg:mt-0">
        <div className="hidden lg:flex items-center -space-x-2">
          <div className="w-6 h-6 rounded-full bg-foreground-muted/20 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-foreground-muted/20 animate-pulse" />
        </div>
        <div className="hidden xl:block">
          <div className="h-5 w-16 bg-foreground-muted/20 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 lg:text-right">
          <div className="h-4 w-24 bg-foreground-muted/20 rounded animate-pulse ml-auto" />
        </div>
      </div>
    </div>
  )
}

function BlogGridItemSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-6">
      <div className="relative w-full aspect-[1.91/1] overflow-hidden bg-foreground-muted/20 animate-pulse" />
      <div className="flex items-center space-x-1.5 mt-2">
        <div className="h-4 w-24 bg-foreground-muted/20 rounded animate-pulse" />
        <div className="h-4 w-4 bg-foreground-muted/20 rounded animate-pulse" />
        <div className="h-4 w-16 bg-foreground-muted/20 rounded animate-pulse" />
      </div>
      <div className="h-6 w-3/4 bg-foreground-muted/20 rounded animate-pulse mt-1" />
      <div className="h-4 w-full bg-foreground-muted/20 rounded animate-pulse mt-1" />
      <div className="h-4 w-2/3 bg-foreground-muted/20 rounded animate-pulse" />
    </div>
  )
}

interface BlogClientProps {
  initialBlogs: any[]
  totalPosts: number
}

export default function BlogClient({ initialBlogs, totalPosts }: BlogClientProps) {
  const { BLOG_VIEW } = LOCAL_STORAGE_KEYS
  const localView = isBrowser ? (localStorage?.getItem(BLOG_VIEW) as BlogView) : undefined
  const [view, setView] = useState<BlogView>(localView ?? 'list')
  const [isFiltering, setIsFiltering] = useState(false)
  const [filterParams, setFilterParams] = useState<{ category?: string; search?: string }>({})
  const [filteredPosts, setFilteredPosts] = useState<any[] | null>(null)
  const [filteredTotal, setFilteredTotal] = useState<number | null>(null)
  const isList = view === 'list'

  // Determine which posts and total to use based on filter state
  const currentPosts = filteredPosts ?? initialBlogs
  const currentTotal = filteredTotal ?? totalPosts

  const fetchMorePosts = useCallback(
    async (offset: number, limit: number) => {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      })

      if (filterParams.category && filterParams.category !== 'all') {
        params.set('category', filterParams.category)
      }
      if (filterParams.search) {
        params.set('q', filterParams.search)
      }

      const response = await fetch(`/api-v2/blog-posts?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch posts')
      }

      return data.posts
    },
    [filterParams]
  )

  const {
    items: blogs,
    setItems: setBlogs,
    hasMore,
    isLoading,
    loadMoreRef,
  } = useInfiniteScrollWithFetch({
    initialItems: currentPosts,
    totalItems: currentTotal,
    pageSize: POSTS_PER_PAGE,
    fetchMore: fetchMorePosts,
    rootMargin: '1000px',
  })

  // Handle filter changes - fetch filtered results from API
  const handleFilterChange = useCallback(async (category?: string, search?: string) => {
    // If no filters, reset to initial state
    if ((!category || category === 'all') && !search) {
      setFilterParams({})
      setFilteredPosts(null)
      setFilteredTotal(null)
      setIsFiltering(false)
      return
    }

    setIsFiltering(true)
    setFilterParams({ category, search })

    try {
      const params = new URLSearchParams({
        offset: '0',
        limit: POSTS_PER_PAGE.toString(),
      })

      if (category && category !== 'all') {
        params.set('category', category)
      }
      if (search) {
        params.set('q', search)
      }

      const response = await fetch(`/api-v2/blog-posts?${params}`)
      const data = await response.json()

      if (data.success) {
        setFilteredPosts(data.posts)
        setFilteredTotal(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch filtered posts:', error)
    } finally {
      setIsFiltering(false)
    }
  }, [])

  const featuredPost = initialBlogs[0]

  return (
    <div>
      <h1 className="sr-only">Supabase blog</h1>

      {/* Featured post section */}
      {featuredPost && (
        <div className="border-b border-border">
          <div className="mx-auto max-w-[var(--container-max-w,75rem)] border-x border-border">
            <FeaturedThumb key={featuredPost.slug} {...featuredPost} />
          </div>
        </div>
      )}

      {/* Filters row */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 border-x border-border">
          <div className="py-4">
            <BlogFilters onFilterChange={handleFilterChange} view={view} setView={setView} />
          </div>
        </div>
      </div>

      {/* Blog posts */}
      <div className="mx-auto max-w-[var(--container-max-w,75rem)] border-x border-border">
        {isFiltering ? (
          isList ? (
            <div>
              {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <BlogListItemSkeleton key={`skeleton-list-${idx}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-border [&>*]:sm:border-r [&>*:nth-child(2n)]:sm:border-r-0 [&>*:nth-child(2n)]:lg:border-r [&>*:nth-child(3n)]:lg:border-r-0">
              {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <div key={`skeleton-grid-${idx}`}>
                  <BlogGridItemSkeleton />
                </div>
              ))}
            </div>
          )
        ) : blogs?.length ? (
          isList ? (
            <div>
              {blogs.map((blog: PostTypes, idx: number) => (
                <BlogListItem post={blog} key={`list-${idx}-${blog.slug}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-border [&>*]:sm:border-r [&>*:nth-child(2n)]:sm:border-r-0 [&>*:nth-child(2n)]:lg:border-r [&>*:nth-child(3n)]:lg:border-r-0">
              {blogs.map((blog: PostTypes, idx: number) => (
                <BlogGridItem post={blog} key={`grid-${idx}-${blog.slug}`} />
              ))}
            </div>
          )
        ) : (
          <div className="px-6 py-12">
            <p className="text-sm text-light">No results</p>
          </div>
        )}

        {hasMore && !isFiltering && (
          <div
            ref={loadMoreRef}
            className="flex justify-center py-8 border-t border-border"
            aria-hidden="true"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground-muted border-t-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
