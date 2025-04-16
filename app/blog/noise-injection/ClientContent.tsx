'use client'

import Content from './content.mdx'
import MDXContent from '../../components/MDXContent'
import BackToTopButton from '../../components/BackToTopButton'

export default function ClientContent() {
  return (
    <>
      <MDXContent>
        <Content />
      </MDXContent>
      <BackToTopButton />
    </>
  )
}