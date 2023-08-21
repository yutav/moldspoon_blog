const isProd = process.env.NODE_ENV == 'production'

module.exports = {
  siteUrl: isProd ? 'https://moldspoon.jp/blog/' : 'http://localhost:3001/blog/',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: './public/',
  exclude: [
    '/thanks'
  ],


};