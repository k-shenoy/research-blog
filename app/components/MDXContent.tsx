'use client'

import { MDXProvider } from '@mdx-js/react'
import { usePathname } from 'next/navigation'
import TableOfContents from './TableOfContents'

// Modern theme with a slate background and emerald accents
const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-8 text-white" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white border-l-4 border-emerald-500 pl-3" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-gray-100" id={`heading-${props.children?.toString().toLowerCase().replace(/\s+/g, '-')}`} {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-300 leading-relaxed">{props.children}</p>,
  a: (props: any) => (
    <a 
      {...props} 
      className="!inline-flex !items-center !gap-1 !text-emerald-400 hover:!text-emerald-300 !transition-colors"
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
  li: (props: any) => <li className="text-gray-300" {...props} />,
  table: (props: any) => <div className="overflow-x-auto mb-8"><table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden" {...props} /></div>,
  th: (props: any) => <th className="px-4 py-3 bg-slate-800 text-left font-medium text-gray-100 uppercase text-sm tracking-wider" {...props} />,
  td: (props: any) => <td className="px-4 py-3 bg-slate-900 text-gray-300 border-t border-slate-800" {...props} />,
  img: (props: any) => <img {...props} className="rounded-lg shadow-lg border border-slate-700" />,
  figcaption: (props: any) => <figcaption {...props} className="text-center text-sm text-gray-400 mt-3 italic" />,
  figure: (props: any) => <figure {...props} className="my-8" />,
  code: (props: any) => <code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded text-sm" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 italic text-gray-400" {...props} />,
}

export default function MDXContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith('/blog/') && pathname !== '/blog';
  
  return (
    <MDXProvider components={components}>
      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-8">
        {isBlogPost && <TableOfContents />}
        <article className={`prose prose-invert max-w-none prose-a:no-underline bg-slate-950 p-8 rounded-lg ${!isBlogPost ? 'col-span-full' : ''}`}>
          {children}
        </article>
      </div>
    </MDXProvider>
  )
}