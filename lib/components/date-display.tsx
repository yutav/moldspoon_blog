import React, { useMemo } from 'react'
import { Configs } from '../utils'

export interface DateDisplayProps {
  date: string
  updateDate?: string
  pageView?: number
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, updateDate, pageView }) => {

  const d = useMemo(() => new Date(date), [])
  if (`${d}` === 'Invalid Date') return null

  const views = useMemo(() => `${pageView !== undefined && pageView > 0 ? pageView : "-"} ${Configs.isJa() ? 'PV' : 'views'}`, [pageView])

  const publishString = d.getFullYear() + "年"
    + (d.getMonth() + 1).toString().padStart(2, "0") + "月"
    + d.getDate().toString().padStart(2, "0") + "日"
    + " " + d.getHours().toString().padStart(2, "0") + ":"
    + d.getMinutes().toString().padStart(2, "0")

  let updateString
  let ud
  if (updateDate) {
    ud = useMemo(() => new Date(updateDate), [])
    if (`${ud}` === 'Invalid Date') return null

    updateString = ud.getFullYear() + "年"
      + (ud.getMonth() + 1).toString().padStart(2, "0") + "月"
      + ud.getDate().toString().padStart(2, "0") + "日"
      + " " + ud.getHours().toString().padStart(2, "0") + ":"
      + ud.getMinutes().toString().padStart(2, "0")
    console.log(updateDate)
  }

  return (
    <p className="text-sm text-gray-900 dark:text-white m-0">
      {updateDate ? (
        <>
          <i className="ri-restart-line"></i>&nbsp; {updateString}
        </>
      ) : (
        <>
          <i className="ri-time-fill"></i> &nbsp; {publishString}
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

export default DateDisplay