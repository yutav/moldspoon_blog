const isProd = process.env.NODE_ENV == 'production'

module.exports = {
  siteUrl: isProd ? 'https://moldspoon.jp/' : 'http://localhost:3001/blog/',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: './public/',
  exclude: [
    '/thanks'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['tools'], // クローリングしたくないパスがある場合はここに指定します
      },
    ],
  },

};