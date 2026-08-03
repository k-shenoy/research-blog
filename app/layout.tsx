import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from './context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Keshav Shenoy',
  description: 'A blog about my work and projects',
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-icon.png',
    shortcut: '/favicon/icon1.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark light-mode" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint. Light is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('light-mode',localStorage.getItem('theme')!=='dark')}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen transition-colors duration-200
        bg-slate-900 text-gray-100`}>
        <ThemeProvider>
          <div className="max-w-4xl mx-auto px-6 pt-24 pb-32">
            <header className="mb-14">
              {/* Tabs sit next to the name, not flush right, to clear the fixed theme toggle */}
              <nav className="flex items-baseline gap-6">
                <Link href="/" className="text-xl font-semibold nav-link transition-colors">
                  Keshav Shenoy
                </Link>
                <Link href="/blog" className="nav-tab transition-colors">
                  blog
                </Link>
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 