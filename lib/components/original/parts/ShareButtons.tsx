import { changeTitle } from "lib/utils";
import { TwitterShareButton, FacebookShareButton, LineShareButton, HatenaShareButton, TwitterIcon, FacebookIcon, LineIcon, HatenaIcon } from "react-share";

type Prop = {
  url: string
  title: string
}

const ShareButtons: React.FC<Prop> = ({ url, title }) => {

  const fullTitle = changeTitle({ title: title })

  return (
    <div className="pt-10">
      <div className="text-normal md:text-xl font-bold">
        シェアしていただけると嬉しいです🤗💖
      </div>

      <div className="py-5 w-full md:w-3/4 grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4 justify-items-center">

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