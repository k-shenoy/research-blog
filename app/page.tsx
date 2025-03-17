import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    slug: 'sandbagging',
    title: 'Replicating "Frontier Models are Capable of In-context Scheming"',
    date: 'March 12, 2025',
    description: 'A replication study of the sandbagging behavior in large language models, examining their ability to deliberately underperform when incentivized.'
  }
  // Add more posts here as you create them
]

export default function Home() {
  return (
    <div className="space-y-12">
      <p className="text-xl text-gray-300">
        Short writeups of my experiments in AI safety.
      </p>

      <section className="flex items-center gap-8">
        <div className="relative w-40 h-40 flex-shrink-0">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <Image
              src="/profile.jpg"
              alt="Keshav Shenoy"
              width={160}
              height={160}
              className="object-cover"
              style={{ objectPosition: '50% 40%' }}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">About Me</h1>
          <p className="text-xl text-gray-300">
            Actively working on AI safety, former software engineer at ExodusPoint Capital, MS and BS from Georgia Tech
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        {blogPosts.map(post => (
          <article key={post.slug} className="group relative border border-gray-800 rounded-lg p-6 hover:border-gray-700 hover:bg-gray-900/50 transition-all cursor-pointer">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-0" aria-label={post.title} />
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 select-text w-fit">{post.date}</p>
              <p className="text-gray-300 select-text w-fit">{post.description}</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-2 transition-all">
              →
            </div>
          </article>
        ))}
      </section>
    </div>
  )
} 