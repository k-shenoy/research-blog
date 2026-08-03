'use client'

import Content from './content.mdx'
import MDXContent from '../../components/MDXContent'
import BackToTopButton from '../../components/BackToTopButton'
import ThemeToggle from '../../components/ThemeToggle'

export default function ClientContent() {
  return (
    <>
      <ThemeToggle />
      <MDXContent>
        <Content />
      </MDXContent>
      <BackToTopButton />
    </>
  )
}
