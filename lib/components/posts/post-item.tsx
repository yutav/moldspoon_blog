import React from 'react'
import { useTheme } from '@geist-ui/core'
import Link from 'next/link'
import Image from "next/image"

const options: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const getDateString = (date: string = ''): string => {
  const d = new Date(date)
  if (`${d}` === 'Invalid Date') return ''
  return new Date(date).toLocaleString('ja', options).replace('日', '日, &nbsp;')
}

export interface PostItemProps {
  post: {
    url: string
    name: string
    meta?: {
      date?: string
      title?: string
      tags?: Array<string>
    }
  }
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const theme = useTheme()

  return (
    <div className="item">
      <Link href={post.url} passHref>
        <div className="flex">
          <Image src={process.env.baseUrl + "/api/og?v=2&title=" + encodeURI(post.name)} width="200" height="120" alt={post.name} style={{
            borderRadius: '12.5px'
          }} className='hidden sm:block' />
          <div className="p-3">
            <span className={(theme.type == 'dark' ? 'dark:text-white' : "text-black") + " text-2xl font-bold"}>{post.name}</span>
            <span
              className={(theme.type == 'dark' ? 'dark:text-white' : "text-black") + " text-sm leading-loose block"}
              dangerouslySetInnerHTML={{ __html: getDateString(post.meta?.date) }}
            />
          </div>
        </div>
      </Link >
      <style jsx>{`
        .item {
          margin-bottom: calc(1.35 * ${theme.layout.gapHalf});
          overflow: hidden;
          max-width: 100vw;
        }

        .item :global(.link) {
          color: ${theme.palette.accents_7};
          transition: color 120ms ease;
          font-size: 0.95rem;
          max-width: 95%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          display: inline-block;
        }

        .date {
          color: ${theme.palette.accents_5};
          font-size: 0.75em;
          display: block;
          line-height: 1.5rem;
        }

        .item :global(.link:hover) {
          color: ${theme.palette.accents_3};
        }

        .item :global(.link:hover .date) {
          color: ${theme.palette.accents_3};
        }

        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .item {
            max-width: 90vw;
          }

          .item :global(.link) {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </div >
  )
}

export default PostItem
