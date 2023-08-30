import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
const Page: React.FC<unknown> = () => {
  const router = useRouter()

  console.log(router)

  let isLatest = router.asPath == "/" ? true : false

  console.log(isLatest)

  return (
    <Layout>
      <Posts isLatest={isLatest} />
    </Layout>
  )
}

export default Page
