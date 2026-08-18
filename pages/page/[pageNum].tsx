import React from 'react'
import Head from 'next/head'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import CategoryBoxes from 'lib/components/original/parts/CategoryBoxes'
import { Loading } from '@geist-ui/core'

// ページネーションもタグページと同じく title / description が全ページ同一で、
// ブログトップからの内部リンクは0本（sitemap にしか存在しない孤立URL だった）。
// 検索流入も12ヶ月で0。記事へのリンクは辿らせたいので follow は残す。
const NoIndex: React.FC = () => (
  <Head>
    <meta name="robots" content="noindex,follow" />
  </Head>
)

const Page: React.FC<unknown> = () => {
  const router = useRouter()

  const page = Array.isArray(router.query.pageNum) ? router.query.pageNum[0] : router.query.pageNum;

  if (page == undefined) {
    return <Layout>
      <NoIndex />
      <Loading />
    </Layout>
  }

  return (
    <Layout>
      <NoIndex />
      <CategoryBoxes />

      <h2 className="section-heading">記事一覧</h2>
      <Posts page={Number(page)} router={router} />

    </Layout>
  )
}

export default Page
