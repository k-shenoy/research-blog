'use client'

import { MDXProvider } from '@mdx-js/react'

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-8" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-300" {...props} />,
  a: (props: any) => <a className="text-blue-400 hover:text-blue-300" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 ml-4" {...props} />,
  li: (props: any) => <li className="mb-2 text-gray-300" {...props} />,
  table: (props: any) => <div className="overflow-x-auto mb-8"><table className="min-w-full table-auto border-collapse" {...props} /></div>,
  th: (props: any) => <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-left" {...props} />,
  td: (props: any) => <td className="border border-gray-600 px-4 py-2" {...props} />,
}

export function MDXLayout({ children }: { children: React.ReactNode }) {
  return (
    <MDXProvider components={components}>
      <article className="prose prose-invert max-w-none">
        {children}
      </article>
    </MDXProvider>
  )
}

export default MDXLayout 