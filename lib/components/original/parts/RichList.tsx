import { ReactElement } from "react"

type Prop = {
  color?: string
  title?: string
  list: ReactElement[]
}
const RichList: React.FC<Prop> = ({ color = "orange", title, list }) => {
  return (
    <div className="mt-5">
      {title && <div className={`font-bold bg-${color}-50 w-20 text-center px-4 py-2 rounded-tl-2xl rounded-tr-2xl border-t-4 border-l-4 border-r-4 border-${color}-300`}>{title}</div>}
      <div className={`bg-${color}-50 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border-4 border-${color}-300 px-8 py-2`}>
        {
          list.map((value, _) => {
            return (
              <p className="leading-relaxed">
                <i className={`ri-circle-fill text-${color}-300`}></i>
                &nbsp;&nbsp;
                {value}
              </p>
            )
          })
        }

        < style jsx>{`
        .list {

        }
      `}</style>
      </div>
    </div >
  )
}

export default RichList