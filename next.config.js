const isProd = process.env.NODE_ENV === 'production'
const cdnPrefix = process.env.CDN_PREFIX || ''

if (isProd && cdnPrefix) {
  console.log(`> [unix.bio] You have customized the CDN prefix: ${cdnPrefix}.\n`)
}

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [require('@mapbox/rehype-prism'), require('rehype-join-line')],
  },
})

const nextConfig = {
  basePath: '/blog',

  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],

  generateEtags: false,

  poweredByHeader: false,

  assetPrefix: isProd ? cdnPrefix : '',

  env: {
    VERSION: require('./package.json').version,
  },


}

module.exports = withMDX(nextConfig)
