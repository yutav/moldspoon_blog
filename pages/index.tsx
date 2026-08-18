import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import CategoryBoxes from 'lib/components/original/parts/CategoryBoxes'

const Page: React.FC<unknown> = () => {
  const router = useRouter()

  return (
    <Layout>
      <CategoryBoxes />

      <h2 className="section-heading">新着記事</h2>
      <Posts page={1} router={router} />

    </Layout>
  )
}

export default Page
