import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    slug: 'document-control',
    title: 'A New Control Eval for Summarizing Paper Results ',
    date: 'April 5, 2025',
    description: 'A preliminary control evaluation for document summarization tasks. Can an untrusted model lie about the results of a paper while evading detection?'
  },
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

      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
        <div className="md:col-span-1">
          <h1 className="text-3xl font-bold mb-4 md:hidden">About Me</h1>
          <div className="relative w-48 h-48 mx-auto md:w-full md:h-auto md:pb-[100%]">
            <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-gray-800">
              <Image
                src="/profile.jpg"
                alt="Keshav Shenoy"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 40%' }}
              />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-4 hidden md:block">About Me</h1>
          <div className="space-y-4">
            <p className="text-gray-300">
              I'm currently working on AI safety with a special interest in AI control evaluations, encoded reasoning in chain of thought, and model organisms of misalignment. 
            </p>
            <p className="text-gray-300">
              Previously, I spent two years as a trading engineer at ExodusPoint Capital, where I worked on a small team building out the firm's trading system and automated strategies. I got my Master's and Bachelor's in Computer Science from Georgia Tech, specializing in Computing Systems.
            </p>
            
            <p className="text-gray-300">
              Excited to talk about any of this stuff or anything else. Can be reached at keshavsy[at]gmail[dot]com or <a href="https://calendly.com/keshavsy/30min" target="_blank" rel="noopener noreferrer" className="text-blue-400">schedule a call with me here</a> or on LinkedIn below.
            </p>
            
            <div className="flex gap-4 pt-2">
              <a 
                href="https://github.com/k-shenoy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/keshav-shenoy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
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