import Link from "next/link"

type Prop = {
}
const IntroduceMyself: React.FC<Prop> = () => {
  return (
    <div className="flex mb-6">
      <img src={process.env.baseUrl + "/posts/images/yuku_tas_clear.png?n=1"} className="overImage z-50" alt="yuku_tasのアイコン" width={80} height={80} />
      <div className="bg-gray-200 dark:bg-gray-800 p-3 pl-28 md:pl-32 mr-4 md:mr-0 rounded absolute z-1 mt-5">
        <div className="balloon2-left bg-white dark:bg-gray-900 text-black dark:text-white px-3 py-2 md:px-4 md:py-3 shadow rounded text-xs md:text-base
        h-16 md:h-auto
      ">
          こんにちは、Webサービス開発者の<Link href="https://twitter.com/yuku_tas">yuku_tas</Link>です。
        </div>


        <style jsx>{`

      `}</style>
      </div>
    </div>
  )
}

export default IntroduceMyself
