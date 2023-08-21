import Link from "next/link"

type Prop = {
}
const IntroduceMyself: React.FC<Prop> = () => {
  return <>
    こんにちは、Webサービス開発者の<Link href="https://twitter.com/yuku_tas">yuku_tas</Link>です。
  </>
}

export default IntroduceMyself
