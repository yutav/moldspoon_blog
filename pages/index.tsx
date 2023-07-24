import React from 'react'
import { Layout, Posts } from 'lib/components'

const Page: React.FC<unknown> = () => (
  <Layout>
    {/* 
    <Posts isLatest />
    */}
    <Posts />
  </Layout>
)

export default Page
