'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Load saved theme from localStorage on client-side. The inline script in
    // the layout has already applied the class, so this only syncs React state.
    const savedTheme = localStorage.getItem('theme') as Theme
    const initialTheme: Theme = savedTheme === 'dark' ? 'dark' : 'light'
    setTheme(initialTheme)
    document.documentElement.classList.toggle('light-mode', initialTheme === 'light')
  }, [])
  
  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode')
    } else {
      document.documentElement.classList.remove('light-mode')
    }
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}