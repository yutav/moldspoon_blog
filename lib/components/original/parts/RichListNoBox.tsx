import { ReactElement } from "react"

type Prop = {
  color?: string
  list: ReactElement[]
}
const RichListNoBox: React.FC<Prop> = ({ color = "orange", list }) => {
  return (
    <div className="mt-5">
      <div className={`bg-${color}-50 px-2 py-2`}>
        {
          list.map((value, _) => {
            return (
              <p className="leading-normal">
                ・
                &nbsp;&nbsp;
                <span
                  dangerouslySetInnerHTML={{ __html: value }}
                />
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

export default RichListNoBox