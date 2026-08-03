import React from 'react'
import Link from 'next/link'
import ThemeToggle from '../components/ThemeToggle'

type Post = {
  title: string
  date: string
  slug: string
}

// Only posts listed here are shown. Older drafts under app/blog/* stay unlisted.
const posts: Post[] = [
  {
    title: 'some things I liked and thought this year',
    date: 'May 23, 2026',
    slug: 'some-things-i-liked-and-thought-this-year',
  },
]

export const metadata = {
  title: 'blog | Keshav Shenoy',
  description: 'Writing by Keshav Shenoy.',
}

export default function BlogIndex() {
  return (
    <div>
      <ThemeToggle />

      <ul className="space-y-5">
        {posts.map(post => (
          <li key={post.slug} className="post-row">
            <Link href={`/blog/${post.slug}`} className="post-row-link">
              <span className="post-row-title">{post.title}</span>
              <span className="post-row-date">{post.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
