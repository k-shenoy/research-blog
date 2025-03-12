'use client'

import { MDXProvider } from '@mdx-js/react'

const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="mb-4" {...props} />,
  pre: (props: any) => <pre className="bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto" {...props} />,
  code: (props: any) => <code className="bg-gray-800 px-1 py-0.5 rounded" {...props} />,
}

export default function MDXContent({ children }: { children: React.ReactNode }) {
  return (
    <MDXProvider components={components}>
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </MDXProvider>
  )
} 