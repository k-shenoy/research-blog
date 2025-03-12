import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Keshav's Blog",
  description: 'A blog about my work and projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-gray-100 min-h-screen`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <nav className="flex items-center justify-between">
              <Link href="/research-blog" className="text-2xl font-bold hover:text-gray-300 transition-colors">
                Keshav's Blog
              </Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-8 py-4 text-center text-gray-400">
            © {new Date().getFullYear()} Keshav's Blog. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  )
} 