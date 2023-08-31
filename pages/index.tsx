import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
const Page: React.FC<unknown> = () => {
  const router = useRouter()

  let isLatest = router.asPath == "/" ? true : false

  return (
    <Layout>
      <Posts isLatest={isLatest} />
    </Layout>
  )
}

export default Page
