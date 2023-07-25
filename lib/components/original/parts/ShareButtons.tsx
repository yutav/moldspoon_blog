import { TwitterShareButton, FacebookShareButton, LineShareButton, HatenaShareButton, TwitterIcon, FacebookIcon, LineIcon, HatenaIcon } from "react-share";

type Prop = {
  url: string
  title: string
}

const ShareButtons: React.FC<Prop> = ({ url, title }) => {
  return (
    <div className="pt-10">
      <div className="text-xl font-bold">
        シェアしていただけると嬉しいです🤗💖
      </div>

      <div className="py-5 w-3/4 grid grid-cols-12 gap-4 justify-items-center">

        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={30} round={true} />
        </TwitterShareButton>

        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={30} round={true} />
        </FacebookShareButton>

        <LineShareButton url={url} title={title}>
          <LineIcon size={30} round={true} />
        </LineShareButton>

        <HatenaShareButton url={url} title={title}>
          <HatenaIcon size={30} round={true} />
        </HatenaShareButton>

      </div>
    </div>
  )
}

export default ShareButtons