import Link from "next/link"
import MdxImage from "./MdxImage"

type Prop = {
}
const IntroduceMyself: React.FC<Prop> = () => {
  return (
    <div className="flex">
      <img src={process.env.baseUrl + "/posts/images/yuku_tas_clear.png?n=1"} className="overImage z-50" alt="yuku_tasのアイコン" width={120} height={120} />
      <div className="bg-gray-200 dark:bg-gray-800 p-3 pl-32 md:p-6 md:pl-32 mr-2 md:mr-0 rounded absolute z-1 mt-5">
        <div className="icon rounded-full mr-6">
        </div>
        <div className="balloon2-left bg-white dark:bg-gray-900 text-black dark:text-white p-3 shadow rounded text-xs md:text-base
        h-16 md:h-auto
        before:border-r-4 before:dark:border-r-white
        after:border-r-5 after:dark:border-r-white
      ">
          こんにちは、Webサービス開発者の<Link href="https://twitter.com/yuku_tas">yuku_tas</Link>です。
        </div>


        <style jsx>{`

       .balloon2-left {
        position: relative;
        display: inline-block;
        padding: 7px 10px;
        min-width: 120px;
        max-width: 100%;
        border: solid 3px #555;
        box-sizing: border-box;
      }
      
      .balloon2-left:before {
        content: "";
        position: absolute;
        top: 50%;
        left: -24px;
        margin-top: -12px;
        border: 12px solid transparent;
        z-index: 2;
      }
      
      .balloon2-left:after {
        content: "";
        position: absolute;
        top: 50%;
        left: -30px;
        margin-top: -14px;
        border: 14px solid transparent;
        border-right: 15px solid #555;
        z-index: 1;
      }
      
      .balloon2-left p {
        margin: 0;
        padding: 0;
      }
      img.overImage {
        width: 100px !important;
        height: 100px !important;
      }
      `}</style>
      </div>
    </div>
  )
}

export default IntroduceMyself
