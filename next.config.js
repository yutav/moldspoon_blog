const isProd = process.env.NODE_ENV === 'production';
const cdnPrefix = isProd ? '/blog' : '';

if (isProd && cdnPrefix) {
  console.log(`> You have customized the CDN prefix: ${cdnPrefix}.\n`);
}

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [
      require('@mapbox/rehype-prism'),
      require('rehype-join-line'),
      require('rehype-pretty-code'),
      /** @type {Partial<import("rehype-pretty-code").Options>} */
      ({
        theme: "github-light",
        getHighlighter: require('shiki').getHighlighter,
      })],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERSION: require('./package.json').version,
    ...require(`./env/${process.env.APP_ENV || 'local'}.json`),
    TZ: 'Asia/Tokyo',
  },
  basePath: '/blog', // basePathを空に設定
  assetPrefix: '/blog',
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "/blog/blog",
      },
      {
        source: "/blog/api/:path*",
        destination: "/api/:path*",
      },
      {
        source: "/blog/images/:query*",
        destination: '/_next/image/:query*'
      },
      {
        source: "/blog/_next/:path*",
        destination: "/_next/:path*",
      },
    ]
  },

  pageExtensions: ['jsx', 'js', 'mdx', 'md', 'ts', 'tsx'],
  generateEtags: false,
  poweredByHeader: false,
  images: {
    domains: ['localhost', 'moldspoon.jp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    appDir: true,
  },
  redirects() {
    return [];
  },
};

module.exports = withMDX(nextConfig);