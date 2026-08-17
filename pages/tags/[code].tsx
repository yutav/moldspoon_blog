import React from 'react'
import Head from 'next/head'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import { Loading } from '@geist-ui/core'

// タグページは記事一覧の絞り込みでしかなく、155本すべて title / description / og が
// 同一になる（このページは Automatic Static Optimization で1枚の静的HTMLに畳まれ、
// タグ名はクライアントでしか確定しないため）。過去12ヶ月の検索流入もクリック0・
// 表示53回だったので、インデックスさせずリンクだけ辿らせる。
// query が未確定の初期HTMLこそクローラーが読む実体なので、両方の分岐に入れる。
const NoIndex: React.FC = () => (
  <Head>
    <meta name="robots" content="noindex,follow" />
  </Head>
)

const Page: React.FC<unknown> = () => {
  const router = useRouter()

  // router.query.codeがstring[]の場合、先頭の要素を取得する
  const tag = Array.isArray(router.query.code) ? router.query.code[0] : router.query.code;

  if (tag == undefined) {
    return (
      <Layout>
        <NoIndex />
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout>
      <NoIndex />
      <Posts tag={tag} page={1} router={router} />
    </Layout>
  )
}

export default Page
