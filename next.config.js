const isProd = process.env.NODE_ENV === 'production';
const cdnPrefix = isProd ? '/blog' : '';

if (isProd && cdnPrefix) {
  console.log(`> You have customized the CDN prefix: ${cdnPrefix}.\n`);
}

const withPlugins = require("next-compose-plugins");


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})


const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [
      require('@mapbox/rehype-prism'),
      require('rehype-join-line'),
      require('rehype-pretty-code'),
      /** @type {Partial<import("rehype-pretty-code").Options>} */
      ({
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
    // ブラウザバックでスクロール位置を戻す。Pages Router の既定は「常に先頭」で、
    // 一覧の下のほうから記事を開いて戻ると毎回いちばん上に飛ばされる。
    // リンクを踏んだときに先頭へ行くのは従来どおりで、戻るときだけ位置を復元する。
    scrollRestoration: true,
  },
  redirects() {
    return [];
  },
};

module.exports = withPlugins([withBundleAnalyzer({}), withMDX(nextConfig)]);

//module.exports = withBundleAnalyzer(withMDX(nextConfig));
//module.exports = withMDX(nextConfig);
