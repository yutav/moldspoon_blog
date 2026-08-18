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
    // 本文の左脇に position: fixed で浮かせていたが、本文列を 780px に絞って
    // 右サイドバーを置いた結果、左に逃がす余地がなくなった。記事の下に置く。
    <div className="block w-full mt-8">
      <div className="px-2 py-4 w-full flex flex-wrap items-center gap-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-orange-500 my-0">Share Me!</p>
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