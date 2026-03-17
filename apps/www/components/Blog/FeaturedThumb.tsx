import Image from 'next/image'
import Link from 'next/link'

import authors from '@/lib/authors.json'
import type PostTypes from '@/types/post'

function FeaturedThumb(blog: PostTypes) {
  // For static posts, look up author info from authors.json
  const authorArray = blog.author?.split(',').map((a) => a.trim()) || []
  const author = []

  for (let i = 0; i < authorArray.length; i++) {
    const foundAuthor = authors.find((authors: any) => {
      return authors.author_id === authorArray[i]
    })
    if (foundAuthor) {
      author.push(foundAuthor)
    }
  }

  return renderFeaturedThumb(blog, author)
}

function renderFeaturedThumb(blog: PostTypes, author: any[]) {
  const resolveImagePath = (img: string | undefined): string | null => {
    if (!img) return null
    return img.startsWith('/') || img.startsWith('http') ? img : `/images/blog/${img}`
  }

  const imageUrl =
    resolveImagePath(blog.imgThumb) ||
    resolveImagePath(blog.imgSocial) ||
    '/images/blog/blog-placeholder.png'

  return (
    <div key={blog.slug} className="w-full">
      <Link
        href={`${blog.path}`}
        className="group grid lg:grid-cols-12 hover:bg-surface-75/50 transition-colors"
      >
        <div className="relative w-full aspect-[4/2.25] lg:col-span-7 overflow-hidden p-6">
          <div className="relative w-full h-full min-h-[200px] lg:min-h-0 shadow-lg">
            <Image
              src={imageUrl}
              fill
              sizes="100%"
              quality={100}
              priority
              className="object-cover bg-alternative rounded-lg"
              alt="blog thumbnail"
            />
          </div>
        </div>
        <div className="flex flex-col lg:col-span-5 lg:border-l lg:border-border px-6 py-8">
          <div className="flex-1">
            <h2 className="h2 lg:!text-2xl xl:!text-3xl !mb-2">{blog.title}</h2>
            <p className="p xl:text-lg">{blog.description}</p>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="flex items-center gap-2">
              {author.filter(Boolean).map((author: any, i: number) => {
                const authorImageUrl =
                  typeof author.author_image_url === 'string'
                    ? author.author_image_url
                    : (author.author_image_url as { url: string })?.url || ''

                return (
                  <div
                    className="flex items-center space-x-2"
                    key={`author-feat-${i}-${author.author}`}
                  >
                    {authorImageUrl && (
                      <div className="relative h-6 w-6 overflow-hidden">
                        <Image
                          src={authorImageUrl}
                          alt={`${author.author} avatar`}
                          className="rounded-full object-cover"
                          fill
                          sizes="30px"
                        />
                      </div>
                    )}
                    <span className="text-foreground m-0 text-sm">{author.author}</span>
                  </div>
                )
              })}
            </div>

            <div className="text-foreground-lighter flex space-x-2 text-sm">
              <span>{blog.formattedDate}</span>
              <span>•</span>
              <span>{blog.readingTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default FeaturedThumb
