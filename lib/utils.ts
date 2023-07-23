import BLOG from '../blog.config'

const labels = BLOG.labels || {}
const layouts = BLOG.layouts || {}

export const Configs = {
  author: BLOG.author || 'Anonymous',
  summary: BLOG.summary || 'This is my favorite blog.',
  title: BLOG.title || 'unix-bio',

  //  email: BLOG.email ? `mailto:${BLOG.email}` : null,
  email: BLOG.email ? `https://moldspoon.jp#contact` : null,
  github: BLOG.github ? `https://github.com/${BLOG.github}` : null,
  twitter: BLOG.twitter ? `https://twitter.com/${BLOG.twitter}` : null,

  enableViews: BLOG.enableViews || false,
  latestLimit: BLOG.latestLimit || 5,
  isCN: () => BLOG.language.includes('cn'),
  isJa: () => BLOG.language.includes('ja'),

  labels: {
    default: labels.default || 'posts',
    latest: labels.latest || 'latest',
    list: labels.list || 'all posts',
  },

  layouts: {
    pageWidth: layouts.pageWidth || '750px',
    pageWidthMobile: layouts.pageWidthMobile || '88vw',
  },
}
