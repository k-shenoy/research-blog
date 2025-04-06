'use client'

import { MDXProvider } from '@mdx-js/react'
import { usePathname } from 'next/navigation'
import TableOfContents from './TableOfContents'

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-8" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-300">{props.children}</p>,
  a: (props: any) => (
    <a 
      {...props} 
      className="!inline-flex !items-center !gap-1 !text-blue-400 hover:!text-blue-300 !underline !decoration-dotted hover:!decoration-solid !transition-all group"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {props.children}
      {props.href?.startsWith('http') && (
        <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
      )}
    </a>
  ),
  ul: (props: any) => <ul className="list-disc list-inside mb-4 ml-4" {...props} />,
  li: (props: any) => <li className="mb-2 text-gray-300" {...props} />,
  table: (props: any) => <div className="overflow-x-auto mb-8"><table className="min-w-full table-auto border-collapse" {...props} /></div>,
  th: (props: any) => <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-left" {...props} />,
  td: (props: any) => <td className="border border-gray-600 px-4 py-2" {...props} />,
}

export default function MDXContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith('/blog/') && pathname !== '/blog';
  
  return (
    <MDXProvider components={components}>
      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-8">
        {isBlogPost && <TableOfContents />}
        <article className={`prose prose-invert max-w-none prose-a:no-underline ${!isBlogPost ? 'col-span-full' : ''}`}>
          {children}
        </article>
      </div>
    </MDXProvider>
  )
} 