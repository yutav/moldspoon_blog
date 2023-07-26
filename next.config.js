const isProd = process.env.NODE_ENV === 'production';
const cdnPrefix = isProd ? '/blog' : '';

if (isProd && cdnPrefix) {
  console.log(`> You have customized the CDN prefix: ${cdnPrefix}.\n`);
}

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [require('@mapbox/rehype-prism'), require('rehype-join-line')],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog', // basePathを空に設定
  assetPrefix: '/blog',
  reactStrictMode: true,

  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],
  generateEtags: false,
  poweredByHeader: false,
  env: {
    VERSION: require('./package.json').version,
  },

  redirects() {
    return [];
  },
};

module.exports = withMDX(nextConfig);