import React from 'react'
import { Layout, Posts } from 'lib/components'
import { useRouter } from "next/router"
import CategoryBox from 'lib/components/original/parts/CategoryBox'
import { Loading } from '@geist-ui/core'
const Page: React.FC<unknown> = () => {
  const router = useRouter()

  const page = Array.isArray(router.query.pageNum) ? router.query.pageNum[0] : router.query.pageNum;

  if (page == undefined) {
    return <Layout>
      <Loading />
    </Layout>
  }

  return (
    <Layout>
      <div className="mt-2 md:mt-8 
       mb-8 md:mb-20
       px-0 py-5 
       w-full lg:w-full grid grid-cols-4 lg:gap-x-16 gap-y-16 justify-items-center">
        <CategoryBox url={"/tags/Tips"} imageUrl={process.env.baseUrl + "/assets/f_f_business_48_svg_f_business_48_0bg.svg"} title="Tips" />
        <CategoryBox url={"/tags/Blog"} imageUrl={process.env.baseUrl + "/assets/f_f_business_41_svg_f_business_41_1bg.svg"} title="Blog" />
        <CategoryBox url={"/tags/%E5%88%9D%E7%B4%9A%E8%80%85%E5%90%91%E3%81%91"} imageUrl={process.env.baseUrl + "/assets/f_f_event_98_s512_f_event_98_2bg.png"} title="初級者向け" />
        <CategoryBox url={"/tags/%E7%B5%8C%E9%A8%93%E8%80%85%E5%90%91%E3%81%91"} imageUrl={process.env.baseUrl + "/assets/f_f_object_151_svg_f_object_151_1bg.svg"} title="経験者向け" />
      </div>

      <Posts page={Number(page)} router={router} />

    </Layout>
  )
}

export default Page
