import React from 'react'
import { useTheme } from '@geist-ui/core'
import Link from 'next/link'
import Image from "next/image"
import { getTagColor } from 'lib/utils'
import DateDisplay from 'lib/components/date-display'
import { useIsMobile } from 'hooks/useIsMobile'


export interface PostItemProps {
  post: {
    url: string
    name: string
    meta?: {
      date?: string
      updateDate?: string
      title?: string
      tags?: Array<string>
    }
  }
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {

  const { isMedium } = useIsMobile()

  const theme = useTheme()

  const postName = encodeURI(post.name)

  return (
    <div className="item">
      <div className="flex">
        <Link href={post.url} passHref className="flex-none">
          {isMedium ? (
            <Image
              src={process.env.baseUrl + "/api/og?title=" + postName}
              width="100"
              height="44"
              alt={post.name}
              style={{
                borderRadius: '5px'
              }}
              className='hover:opacity-80'
            />
          ) : (
            <Image
              src={process.env.baseUrl + "/api/og?title=" + postName}
              width="320"
              height="140"
              alt={post.name}
              style={{
                borderRadius: '12.5px'
              }}
              className='hover:opacity-80'
            />
          )}
        </Link>
        <div className="p-0 md:p-3">
          <div className="flex flex-wrap">
            {post.meta?.tags?.includes('Tips') && (
              <div className="px-2 mb-2 md:mb-2 bg-transparent text-center">
                <Link href={`/tags/Tips`} target="_blank" className={getTagColor('Tips') +
                  " text-xs md:text-base hover:opacity-80 px-4 py-1 rounded-2xl"
                }>
                  Tips
                </Link>
              </div>
            )}
            {post.meta?.tags?.includes('Blog') && (
              <div className="px-2 mb-2 md:mb-2 bg-transparent text-center">
                <Link href={`/tags/Blog`} target="_blank"
                  className={getTagColor('Blog') + " text-xs md:text-base hover:opacity-80 px-4 py-1 rounded-2xl"}>
                  Blog
                </Link>
              </div>
            )}
            {post.meta?.tags?.includes('経験者向け') && (
              <div className="px-2 mb-2 md:mb-2 bg-transparent text-center">
                <Link href={`/tags/%E7%B5%8C%E9%A8%93%E8%80%85%E5%90%91%E3%81%91`} target="_blank"
                  className={getTagColor('経験者向け') + " text-xs md:text-base  hover:opacity-80 px-4 py-1 rounded-2xl"}>
                  経験者向け
                </Link>
              </div>
            )}
            {post.meta?.tags?.includes('初級者向け') && (
              <div className="px-2 mb-2 md:mb-2 bg-transparent text-center">
                <Link href={`/tags/%E5%88%9D%E7%B4%9A%E8%80%85%E5%90%91%E3%81%91`} target="_blank"
                  className={getTagColor('初級者向け') + " text-xs md:text-base  hover:opacity-80 px-4 py-1 rounded-2xl"}>
                  初級者向け
                </Link>
              </div>
            )}
          </div>
          <Link href={post.url} passHref className="hover:opacity-80 ">
            <span className={"text-black dark:text-white md:text-base lg:text-xl xl:text-2xl font-bold"}>{post.name}</span>
          </Link>

          <div className="py-2">
            <DateDisplay date={post.meta?.date ?? ""} updateDate={post.meta?.updateDate} />
          </div>
          <p className="py-0 m-0 mt-0 text-xs text-gray-700 dark:text-white">
            タグ: &nbsp;
            {post.meta?.tags?.map((value) => {
              const excludedTags = ["経験者向け", "初級者向け", "Tips", "Blog"];
              if (excludedTags.includes(value)) {
                return
              }
              return (
                <Link href={`/tags/` + encodeURI(value)} key={value} className="underline text-xs mr-2 text-gray-700 dark:text-white">{value}</Link>
              )
            })}
          </p>
        </div>
      </div>
      <style jsx>{`
       
        .item {
          margin-bottom: calc(1.35 * ${theme.layout.gap});
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
