import { changeTitle } from "lib/utils";
import { TwitterShareButton, FacebookShareButton, LineShareButton, HatenaShareButton, TwitterIcon, FacebookIcon, LineIcon, HatenaIcon } from "react-share";
import { useEffect } from "react";
type Prop = {
  url: string
  title: string
}

const ShareButtons: React.FC<Prop> = ({ url, title }) => {

  const fullTitle = changeTitle({ title: title })

  useEffect(() => {
    /*
    // スクロール位置を監視し、400px以上スクロールしたらopacityを1に、400px未満の場合は0に設定する
    const handleScroll = () => {
      const triggerHeight = 200; // 200px以上スクロールしたら表示
      const newOpacity = Math.min(1, Math.max(0, (window.scrollY - triggerHeight) / triggerHeight));
      setOpacity(newOpacity);
    };

    // スクロールイベントリスナーを追加
    window.addEventListener("scroll", handleScroll);

    return () => {
      // コンポーネントがアンマウントされるときにリスナーを削除
      window.removeEventListener("scroll", handleScroll);
    };
    */
  }, []);

  return (
    <div
      className="block lg:fixed lg:-ml-32 lg:top-1/2"
    >
      <div className="px-2 lg:px-0 py-5 w-full lg:w-12 grid grid-cols-6 md:grid-cols-10 lg:grid-cols-1 md:grid-rows-8 gap-4 justify-items-center lg:bg-white lg:dark:bg-black lg:dark:border lg:dark:border-gray-300 lg:rounded-2xl">
        <p className="text-lg lg:text-xs font-bold text-center lg:text-orange-500">Share Me!</p>
        <TwitterShareButton url={url} title={fullTitle}>
          <TwitterIcon size={30} round={true} />
        </TwitterShareButton>

        <FacebookShareButton url={url} quote={fullTitle}>
          <FacebookIcon size={30} round={true} />
        </FacebookShareButton>

        <LineShareButton url={url} title={fullTitle}>
          <LineIcon size={30} round={true} />
        </LineShareButton>

        <HatenaShareButton url={url} title={fullTitle}>
          <HatenaIcon size={30} round={true} />
        </HatenaShareButton>

      </div>
    </div>
  )
}

export default ShareButtons