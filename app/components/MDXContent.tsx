'use client'

import { MDXProvider } from '@mdx-js/react'
import { usePathname } from 'next/navigation'
import TableOfContents from './TableOfContents'

// Theme with dark and light mode support
const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-8 dark:text-white light-mode:text-gray-900" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white light-mode:text-gray-900 border-l-4 border-emerald-500 pl-3" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3 dark:text-gray-100 light-mode:text-gray-800" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  p: (props: any) => <p className="mb-4 dark:text-gray-300 light-mode:text-gray-700 leading-relaxed">{props.children}</p>,
  a: (props: any) => (
    <a 
      {...props} 
      className="!inline-flex !items-center !gap-1 dark:!text-emerald-400 dark:hover:!text-emerald-300 light-mode:!text-emerald-600 light-mode:hover:!text-emerald-700 !transition-colors"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {props.children}
      {props.href?.startsWith('http') && (
        <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
      )}
    </a>
  ),
  ul: (props: any) => <ul className="list-disc list-outside mb-4 ml-5 space-y-2" {...props} />,
  li: (props: any) => <li className="dark:text-gray-300 light-mode:text-gray-700" {...props} />,
  table: (props: any) => <div className="overflow-x-auto mb-8"><table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden" {...props} /></div>,
  th: (props: any) => <th className="px-4 py-3 dark:bg-slate-700 light-mode:bg-gray-200 text-left font-medium dark:text-gray-100 light-mode:text-gray-800 uppercase text-sm tracking-wider" {...props} />,
  td: (props: any) => <td className="px-4 py-3 dark:bg-slate-800 light-mode:bg-white dark:text-gray-300 light-mode:text-gray-700 dark:border-t dark:border-slate-700 light-mode:border-t light-mode:border-gray-200" {...props} />,
  img: (props: any) => <img {...props} className="rounded-lg shadow-lg dark:border dark:border-slate-700 light-mode:border light-mode:border-gray-200" />,
  figcaption: (props: any) => <figcaption {...props} className="text-center text-sm dark:text-gray-400 light-mode:text-gray-500 mt-3 italic" />,
  figure: (props: any) => <figure {...props} className="my-8" />,
  code: (props: any) => <code className="dark:bg-slate-800 light-mode:bg-gray-100 dark:text-emerald-300 light-mode:text-emerald-600 px-1 py-0.5 rounded text-sm" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 italic dark:text-gray-400 light-mode:text-gray-500" {...props} />,
}

export default function MDXContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith('/blog/') && pathname !== '/blog';
  
  return (
    <MDXProvider components={components}>
      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-8">
        {isBlogPost && <TableOfContents />}
        <article className={`prose blog-content
          ${!isBlogPost ? 'col-span-full' : ''}`}>
          {children}
        </article>
      </div>
    </MDXProvider>
  )
}