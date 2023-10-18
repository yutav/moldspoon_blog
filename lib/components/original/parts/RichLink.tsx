import Link from "next/link"
import Image from "next/image"

type Prop = {
  url: string
  icon?: string
  moldspoonIcon?: boolean
  title: string
  subtitle: string
  targetBlank?: boolean
}
const RichLink: React.FC<Prop> = ({ url, icon, moldspoonIcon, title, subtitle, targetBlank = false }) => {
  return (
    <>
      <Link href={url} className="dark:text-white text-black hover:text-gray-500" target={targetBlank ? "_blank" : ""}>
        {moldspoonIcon ? (
          <>
            <p className="mr-2 text-sm">参考記事:</p>
            <div className="border rounded-lg p-5">
              <Image src={process.env.baseUrl + "/assets/moldspoonblog_short.png"} width="160" height="40" alt="モルドスプーンアイコン" className="mr-2 mb-2" />
              <div>
                <div className="rich-link-title">{title}</div>
                <div className="rich-link-subtitle">{subtitle}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="border rounded-lg p-5 flex">
            <i
              className={icon + " text-3xl mr-2"}
            />
            <div>
              <div className="rich-link-title">{title}</div>
              <div className="rich-link-subtitle">{subtitle}</div>
            </div>
          </div>

        )}
      </Link >
      <style jsx>{`
        .rich-link-box {
          border: 1px solid #CCC;
          padding: 20px;
        }
        .rich-link-title {
          font-weight: bold;
          font-size: 1.2rem;
        }
        @media (prefers-color-scheme: dark) {
          .rich-link-box {
            border: 1px solid #CCC;
            padding: 10px;
            background: #F00;
          }
        }
      `}</style>
    </>
  )
}

export default RichLink