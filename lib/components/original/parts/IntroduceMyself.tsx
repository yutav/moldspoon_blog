import Link from "next/link"
import MdxImage from "./MdxImage"

type Prop = {
}
const IntroduceMyself: React.FC<Prop> = () => {
  return (
    <div className="bg-gray-200 p-6 flex rounded">
      <div className="icon rounded-full mr-6">
        <MdxImage image="yuku_tas.jpeg" alt="yuku_tas アイコン" width={40} height={40} classStr="rounded-full shadow-xl" />
      </div>
      <div className="balloon2-left bg-white p-3 shadow rounded
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
        color: #555;
        font-size: 16px;
        background: #FFF;
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
        border-right: 12px solid #FFF;
        z-index: 2;
      }
      
      .balloon2-left:after {
        content: "";
        position: absolute;
        top: 50%;
        left: -30px;
        margin-top: -14px;
        border: 14px solid transparent;
        border-right: 14px solid #555;
        z-index: 1;
      }
      
      .balloon2-left p {
        margin: 0;
        padding: 0;
      }

      `}</style>
    </div>
  )
}

export default IntroduceMyself
