import { GetServerSideProps } from 'next'
import { ISitemapField, getServerSideSitemapLegacy } from 'next-sitemap'
import metadata from '../../lib/data/metadata.json'
import { Configs } from 'lib/utils'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const fields: ISitemapField[] = []

  let postCount = 0
  metadata.forEach((item) => {
    item.children?.forEach((_) => {
      postCount++
    })
  });

  let pageCount = Math.ceil(postCount / Configs.latestLimit)

  for (let i = 1; i < pageCount; i++) {

    fields.push({
      loc: process.env.baseUrl + `/page/${i}`,
      changefreq: 'weekly',
      priority: 0.5,
    });
    console.log(pageCount)
  }

  // タグ

  const tagsSet = new Set<string>();
  metadata.forEach((item) => {
    item.children?.forEach((child) => {
      child?.meta?.tags?.forEach((tag) => {
        tagsSet.add(tag)
      })
    })
  });

  const tagsArray = Array.from(tagsSet);

  tagsArray.forEach((tag) => {
    fields.push({
      loc: process.env.baseUrl + `/tags/${tag}`,
      changefreq: 'monthly',
      priority: 0.3,
    });
  });

  return getServerSideSitemapLegacy(ctx, fields)
}

export default function Sitemap() { }