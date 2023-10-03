import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from 'next/router'

const Page: React.FC<unknown> = () => {
  const router = useRouter()
  return <Layout>
    <Posts page={1} router={router} />
  </Layout>
}

export default Page
