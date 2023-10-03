import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import { Loading } from '@geist-ui/core'

const Page: React.FC<unknown> = () => {
  const router = useRouter()

  // router.query.codeがstring[]の場合、先頭の要素を取得する
  const tag = Array.isArray(router.query.code) ? router.query.code[0] : router.query.code;
  const page = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  if (page == undefined || tag == undefined) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  console.log(tag)

  return (
    <Layout>
      <Posts tag={tag} page={Number(page)} router={router} />
    </Layout>
  )
}

export default Page
