import Link from "next/link"

type Prop = {
}
const IntroduceMyself: React.FC<Prop> = () => {
  return (
    <>
      <div className="flex">
        <div className="w-20 flex-none">
          <img src={process.env.baseUrl + "/posts/images/yuku_tas_clear.png?n=1"} className=" z-50  " alt="yuku_tasのアイコン" width={80} height={80} />
        </div>
        <div className="flex-auto p-3  mr-4 md:mr-0 rounded ">
          <div className="balloon2-left bg-white dark:bg-gray-900 text-black dark:text-white px-3 py-2 md:px-4 md:py-3 shadow rounded 
         md:h-auto
      ">
            <p className="leading-tight sm:leading-loose text-xs sm:text-sm">こんにちは、Webサービス開発者の<Link href="https://twitter.com/yuku_tas">yuku_tas</Link>です。</p>
            <p className="text-xs">簡単なプロフィール:&nbsp;開業から13年、業界に携わって17年。Webサイト/iOS/Androidアプリ開発から、<br className="hidden sm:block" />データ分析業務・コンサル業務、ベンチャーから保険会社まで様々な案件を個人会社の形で請け負ってまいりました。<br className="hidden sm:block" />詳しくは<Link href="/about" target="_blank">こちら</Link></p>
          </div>
        </div>
      </div>

    </>)
}

export default IntroduceMyself
