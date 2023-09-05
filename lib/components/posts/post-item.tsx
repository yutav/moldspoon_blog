import React from 'react'
import { useTheme } from '@geist-ui/core'
import Link from 'next/link'
import Image from "next/image"
import { getTagColor } from 'lib/utils'

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
      <div className="flex">
        <Link href={post.url} passHref className="flex-none">
          <Image src={process.env.baseUrl + "/api/og?v=2&title=" + encodeURI(post.name)} width="320" height="140" alt={post.name} style={{
            borderRadius: '12.5px'
          }} className='hidden sm:block hover:opacity-80'
          />
          <Image src={process.env.baseUrl + "/api/og?v=2&title=" + encodeURI(post.name)} width="120" height="70" alt={post.name} style={{
            borderRadius: '5px'
          }} className='block sm:hidden hover:opacity-80'
          />
        </Link>
        <div className="p-3">
          <div className="flex flex-wrap">
            {post.meta?.tags?.includes('Tips') && (
              <div className="px-2 mb-2 md:mb-2 dark:bg-gray-900 text-center">
                <Link href={`/tags/Tips`} target="_blank" className={getTagColor('Tips') +
                  " text-xs md:text-base hover:opacity-80 px-4 py-1 rounded-2xl"
                }>
                  Tips
                </Link>
              </div>
            )}
            {post.meta?.tags?.includes('Blog') && (
              <div className="px-2 mb-2 md:mb-2 dark:bg-gray-900 text-center">
                <Link href={`/tags/Blog`} target="_blank"
                  className={getTagColor('Blog') + " text-xs md:text-base hover:opacity-80 px-4 py-1 rounded-2xl"}>
                  Blog
                </Link>
              </div>
            )}
            {post.meta?.tags?.includes('経験者向け') && (
              <div className="px-2 mb-2 md:mb-2 dark:bg-gray-900 text-center">
                <Link href={`/tags/%E4%B8%8A%E7%B4%9A%E8%80%85`} target="_blank"
                  className={getTagColor('経験者向け') + " text-xs md:text-base  hover:opacity-80 px-4 py-1 rounded-2xl"}>
                  経験者向け
                </Link>
              </div>
            )}
            {post.meta?.tags?.includes('初心者向け') && (
              <div className="px-2 mb-2 md:mb-2 dark:bg-gray-900 text-center">
                <Link href={`/tags/%E5%88%9D%E7%B4%9A%E8%80%85`} target="_blank"
                  className={getTagColor('初心者向け') + " text-xs md:text-base  hover:opacity-80 px-4 py-1 rounded-2xl"}>
                  初級者向け
                </Link>
              </div>
            )}
          </div>
          <Link href={post.url} passHref className="hover:opacity-80 ">
            <span className={"text-black dark:text-white md:text-base lg:text-xl xl:text-2xl font-bold"}>{post.name}</span>
          </Link>
          <span
            className={"text-black dark:text-white text-sm leading-loose block z-0"}
            dangerouslySetInnerHTML={{ __html: getDateString(post.meta?.date) }}
          />
        </div>
      </div>
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
