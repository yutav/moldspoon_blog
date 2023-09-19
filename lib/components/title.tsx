import React, { useMemo } from 'react'
import { msToString } from '../data-transform'
import { useTheme } from '@geist-ui/core'
import { Configs } from '../utils'

export interface DateDisplayProps {
  date: string
  updateDate?: string
  pageView: number
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, updateDate, pageView }) => {
  const theme = useTheme()

  const d = useMemo(() => new Date(date), [])
  if (`${d}` === 'Invalid Date') return null

  const views = useMemo(() => `${pageView > 0 ? pageView : "-"} ${Configs.isJa() ? 'PV' : 'views'}`, [pageView])

  const publishString = d.getFullYear() + "年"
    + (d.getMonth() + 1).toString().padStart(2, "0") + "月"
    + d.getDate().toString().padStart(2, "0") + "日"
    + " " + d.getHours().toString().padStart(2, "0") + ":"
    + d.getMinutes().toString().padStart(2, "0")

  console.log(d)
  console.log(date)
  console.log(updateDate)

  let updateString
  let ud
  if (updateDate) {
    ud = useMemo(() => new Date(updateDate), [])
    console.log(ud)
    if (`${ud}` === 'Invalid Date') return null

    console.log(date)

    updateString = ud.getFullYear() + "年"
      + (ud.getMonth() + 1).toString().padStart(2, "0") + "月"
      + ud.getDate().toString().padStart(2, "0") + "日"
      + " " + ud.getHours().toString().padStart(2, "0") + ":"
      + ud.getMinutes().toString().padStart(2, "0")
    console.log(updateDate)
  }

  return (
    <p className="text-sm ">
      {updateDate ? (
        <>
          <i className="ri-restart-line"></i>&nbsp;最終更新: {updateString}
        </>
      ) : (
        <>
          <i className="ri-time-fill"></i> &nbsp;記事公開: {publishString}
        </>
      )}
      {pageView != undefined && (
        <>
          <span className="split"> / </span>
          {views}
        </>
      )}
      <style jsx>{`

     
      `}</style>
    </p>
  )
}

export interface TitleProps {
  title: string
  date: string
  updateDate?: string
  pageView: number
}

const Title: React.FC<TitleProps> = ({ title, date, updateDate, pageView }) => {
  const theme = useTheme()

  return (
    <div className="title">
      <h1>{title}</h1>
      <div className="date-box">
        <DateDisplay date={date} updateDate={updateDate} pageView={pageView} />
      </div>

      <style jsx>{`
        .title {
          margin: ${theme.layout.gap} 0;
        }

        .date-box {
          display: flex;
          width: fit-content;
          align-items: center;
          height: 30px;
          margin: -0.5rem 0 0 0;
          position: relative;
        }

        .date-box :global(.image) {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          margin: 0 0 0 10px;
        }

        .date-box :global(img) {
          object-fit: unset;
        }

        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .title h1 {
            font-size: 1.4rem;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Title
