import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  // Ensure all links are root-relative
  experimental: {
    appDocumentPreloading: true,
    strictNextHead: true
  },
  // Fix static asset paths
  assetPrefix: '/',
  distDir: 'out'
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig) 