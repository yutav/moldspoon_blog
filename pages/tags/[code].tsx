import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import { Loading } from '@geist-ui/core'

const Page: React.FC<unknown> = () => {
  const router = useRouter()

  // router.query.codeがstring[]の場合、先頭の要素を取得する
  const tag = Array.isArray(router.query.code) ? router.query.code[0] : router.query.code;

  if (tag == undefined) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout>
      <Posts tag={tag} router={router} />
    </Layout>
  )
}

export default Page
