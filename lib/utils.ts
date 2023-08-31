import BLOG from '../blog.config'

const labels = BLOG.labels || {}
const layouts = BLOG.layouts || {}

export const Configs = {
  author: BLOG.author || 'Anonymous',
  summary: BLOG.summary || 'This is my favorite blog.',
  title: BLOG.title || 'moldspoon inc.',

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
    tags: labels.tags || 'tags'
  },

  layouts: {
    pageWidth: layouts.pageWidth || '750px',
    pageWidthMobile: layouts.pageWidthMobile || '88vw',
  },
}


export const changeTitle = ({ title }: { title: string }) => {
  return title + "-" + Configs.title
}

export const fixedEncodeURIComponent = (
  { str }: { str: string }) => {
  return encodeURIComponent(str).replace(/[.-]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

export const getRandomString = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}