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
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen transition-colors duration-200 
        bg-slate-900 text-gray-100`}>
        <ThemeProvider>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <header className="mb-8">
              <nav className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold nav-link hover:text-emerald-400 transition-colors">
                  Keshav Shenoy
                </Link>
              </nav>
            </header>
            <main>{children}</main>
            <footer className="mt-8 py-4 text-center dark:text-gray-400 light-mode:text-gray-500">
              © {new Date().getFullYear()} Keshav Shenoy. All rights reserved.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 