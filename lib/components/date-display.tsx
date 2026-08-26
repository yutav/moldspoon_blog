import React, { useMemo } from 'react'
import { Configs } from '../utils'

export interface DateDisplayProps {
  date: string
  updateDate?: string
  pageView?: number
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, updateDate, pageView }) => {

  const format = (value: string) => {
    const t = new Date(value)
    if (`${t}` === 'Invalid Date') return null
    return t.getFullYear() + "年"
      + (t.getMonth() + 1).toString().padStart(2, "0") + "月"
      + t.getDate().toString().padStart(2, "0") + "日"
      + " " + t.getHours().toString().padStart(2, "0") + ":"
      + t.getMinutes().toString().padStart(2, "0")
  }

  // updateDate 側の useMemo を if の中で呼んでいたためフックの規則に反していた。
  // updateDate の有無が違う記事で同じ位置のコンポーネントが再利用されると、
  // レンダーごとにフックの数が変わる。早期 return も useMemo より前にあった。
  // 呼び出しを条件分岐の外へ出し、常に同じ数・同じ順で呼ぶ形にする。
  const publishString = useMemo(() => format(date), [date])
  const updateString = useMemo(() => (updateDate ? format(updateDate) : null), [updateDate])
  const views = useMemo(
    () => `${pageView !== undefined && pageView > 0 ? pageView : "-"} ${Configs.isJa() ? 'PV' : 'views'}`,
    [pageView],
  )

  if (!publishString) return null

  return (
    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 m-0">
      {updateString ? (
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