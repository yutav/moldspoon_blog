import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import CategoryBox from 'lib/components/original/parts/CategoryBox'
const Page: React.FC<unknown> = () => {
  const router = useRouter()

  let isLatest = router.asPath == "/" ? true : false

  return (
    <Layout>
      <div className="mt-2 md:mt-8 mb-8 md:mb-20 px-0 py-5 w-full md:w-10/12 grid grid-cols-4 gap-4 justify-items-center">
        <CategoryBox url={"/tags/tips"} imageUrl={process.env.baseUrl + "/assets/f_f_business_48_svg_f_business_48_0bg.svg"} title="Tips" />
        <CategoryBox url={"/tags/Blog"} imageUrl={process.env.baseUrl + "/assets/f_f_business_41_svg_f_business_41_1bg.svg"} title="Blog" />
      </div>

      <h2>新着記事</h2>
      <Posts isLatest={isLatest} />

    </Layout>
  )
}

export default Page
