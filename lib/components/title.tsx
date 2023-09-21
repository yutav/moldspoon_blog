import React from 'react'
import { useTheme } from '@geist-ui/core'
import DateDisplay from './date-display'


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
