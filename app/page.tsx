import React from 'react'
import Link from 'next/link'

const blogPosts = [
  {
    slug: 'sample-post',
    title: 'Sample Blog Post',
    date: 'March 11, 2024',
    description: 'This is a sample blog post demonstrating the capabilities of MDX with Next.js.'
  }
  // Add more posts here as you create them
]

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="prose prose-invert">
        <h1>Welcome to Keshav's Blog</h1>
        <p className="text-xl">
          This is where I share my thoughts, projects, and experiences in technology and development.
        </p>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        {blogPosts.map(post => (
          <article key={post.slug} className="group relative border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-300 transition-colors">
                <Link href={`/research-blog/blog/${post.slug}`} className="absolute inset-0 z-0" aria-label={post.title} />
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 select-text w-fit">{post.date}</p>
              <p className="text-gray-300 select-text w-fit">{post.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
} 