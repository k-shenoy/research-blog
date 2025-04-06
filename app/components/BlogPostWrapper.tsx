'use client'

import MDXContent from './MDXContent'
import BackToTopButton from './BackToTopButton'

interface BlogPostWrapperProps {
  children: React.ReactNode
}

export default function BlogPostWrapper({ children }: BlogPostWrapperProps) {
  return (
    <>
      <MDXContent>
        {children}
      </MDXContent>
      <BackToTopButton />
    </>
  )
}