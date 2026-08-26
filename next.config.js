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
  // rewrites は置いていない。basePath: '/blog' を設定すると source / destination に
  // 自動で basePath が付くため、かつてここにあった 4 本は全て /blog/blog/... 宛に
  // なっており 1 本も効いていなかった（ビルドマニフェスト上も /blog/blog →
  // /blog/blog/blog と展開されていた）。
  // そもそも basePath が同じ役割を果たしている:
  //   API      /blog/api/*        → pages/api/*
  //   アセット  /blog/_next/*      → .next/*
  //   画像最適化 /blog/_next/image  → next/image
  // 追加するときは basePath が二重に付くことを前提に書くか、basePath: false を使う。

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
