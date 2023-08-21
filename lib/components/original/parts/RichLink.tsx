import Link from "next/link"

type Prop = {
  url: string
  icon: string
  title: string
  subtitle: string
  targetBlank?: boolean
}
const RichLink: React.FC<Prop> = ({ url, icon, title, subtitle, targetBlank = false }) => {
  return (
    <>
      <Link href={url} className="text-black hover:text-gray-500" target={targetBlank ? "_blank" : ""}>
        <div className="border rounded-lg p-5 flex">
          {icon &&
            <i
              className={icon + " text-3xl mr-2"}
            />
          }
          <div>
            <div className="rich-link-title">{title}</div>
            <div className="rich-link-subtitle">{subtitle}</div>
          </div>
        </div>
      </Link>
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