const isProd = process.env.NODE_ENV == 'production'

// 既定の autoLastmod は全 URL にビルド時刻を入れてしまう。そうすると 77 本すべてが
// 毎日更新されたことになり、Google は lastmod を信用しなくなる。実際にリライトした
// 記事のシグナルが、何も変えていない記事に埋もれる。
//
// 各記事の frontmatter は date と updateDate を持っていて、scripts/collect-meta.js が
// lib/data/metadata.json に集約する。lastmod はそこから引く。
// metadata.json は生成物（git 管理外）。build は collect → next build → next-sitemap の
// 順なので実行時には存在するが、単体で config を読まれても落ちないようにしておく。
let postLastmod = {}
try {
  const metadata = require('./lib/data/metadata.json')
  const postsNode = metadata.find((item) => item && item.name === 'posts')
  for (const post of (postsNode && postsNode.children) || []) {
    const meta = post.meta || {}
    // updateDate に不正な ISO 文字列（時が1桁など）が入っていた記事が実際にあった。
    // パースできなければ黙って落とさず date に戻す。
    const raw = [meta.updateDate, meta.date].find((v) => v && !Number.isNaN(Date.parse(v)))
    if (post.url && raw) postLastmod[post.url] = raw
  }
} catch (e) {
  console.warn('[sitemap] metadata.json を読めなかったため lastmod を省略します:', e.message)
}

// 予約公開のため frontmatter に未来日が入っている記事がある（release-queue）。
// 未来の lastmod は無視されるだけでなく不審に見えるので、現在時刻で頭を打つ。
const now = Date.now()
const toLastmod = (raw) => {
  if (!raw) return undefined
  const t = Date.parse(raw)
  if (Number.isNaN(t)) return undefined
  return new Date(Math.min(t, now)).toISOString()
}

module.exports = {
  siteUrl: isProd ? 'https://moldspoon.jp/blog/' : 'http://localhost:3001/blog/',
  generateRobotsTxt: false,
  sitemapSize: 7000,
  outDir: './public/',
  autoLastmod: false,
  transform: async (config, path) => {
    const isPost = path.startsWith('/posts/')
    return {
      loc: path,
      // 既定は全 URL が daily だった。記事は公開後そう頻繁には変わらないので
      // 実態に合わせる。トップと一覧だけは新着で変わる。
      changefreq: isPost ? 'monthly' : path === '/' ? 'daily' : 'weekly',
      priority: isPost ? 0.7 : path === '/' ? 1.0 : 0.5,
      // 日付が分からないページ（トップ・about 等）は lastmod を省く。
      // 嘘の日付を入れるより出さないほうがよい。
      lastmod: isPost ? toLastmod(postLastmod[path]) : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
