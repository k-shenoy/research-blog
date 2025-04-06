'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
  parentH2?: string
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [h3Headings, setH3Headings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState('')
  const [activeH2Id, setActiveH2Id] = useState('')

  useEffect(() => {
    // Find all h1, h2, and h3 elements in the document
    const allElements = Array.from(document.querySelectorAll('h1, h2, h3'))
      .filter(element => element.id) // Only include elements with IDs
      
    // Split h1/h2 from h3
    const mainElements = allElements
      .filter(element => element.tagName === 'H1' || element.tagName === 'H2')
      .map(element => ({
        id: element.id,
        text: element.textContent || '',
        level: element.tagName === 'H1' ? 1 : 2
      }))
      
    const h3Elements = allElements
      .filter(element => element.tagName === 'H3')
      .map(element => ({
        id: element.id,
        text: element.textContent || '',
        level: 3,
        // Find the h2 that precedes this h3
        parentH2: findParentH2(element)
      }))
    
    setHeadings(mainElements)
    setH3Headings(h3Elements)

    // Setup intersection observer to highlight active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            
            // If this is an h2, update active h2
            if (entry.target.tagName === 'H2') {
              setActiveH2Id(entry.target.id)
            } 
            // If this is an h1, clear active h2
            else if (entry.target.tagName === 'H1') {
              setActiveH2Id('')
            }
            // If this is an h3, find its parent h2
            else if (entry.target.tagName === 'H3') {
              const parentH2 = findParentH2(entry.target)
              if (parentH2) {
                setActiveH2Id(parentH2)
              }
            }
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    // Observe all headings
    allElements.forEach(heading => {
      observer.observe(heading)
    })

    return () => observer.disconnect()
  }, [])

  // Function to find the parent h2 of an h3 element
  function findParentH2(element: Element): string {
    let currentElement = element.previousElementSibling
    
    while (currentElement) {
      if (currentElement.tagName === 'H2' && currentElement.id) {
        return currentElement.id
      }
      currentElement = currentElement.previousElementSibling
    }
    
    return ''
  }
  
  // Get h3 headings for current active h2
  const activeH3s = h3Headings.filter(h3 => h3.parentH2 === activeH2Id)

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4 hidden lg:block">
      <h2 className="text-lg font-semibold mb-2 text-gray-400">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map(heading => (
          <li key={heading.id}>
            <a 
              href={`#${heading.id}`} 
              className={`
                block transition-colors
                ${heading.level === 2 ? 'ml-4' : ''}
                ${activeId === heading.id ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}
              `}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {heading.text}
            </a>
            
            {/* Show h3s under active h2 */}
            {heading.level === 2 && heading.id === activeH2Id && activeH3s.length > 0 && (
              <ul className="mt-1 ml-3 space-y-1 border-l-2 border-gray-800 pl-2">
                {activeH3s.map(h3 => (
                  <li key={h3.id}>
                    <a 
                      href={`#${h3.id}`} 
                      className={`
                        block text-sm transition-colors
                        ${activeId === h3.id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}
                      `}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(h3.id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {h3.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}