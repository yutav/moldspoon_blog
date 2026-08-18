import React from 'react'
import { useTheme } from '@geist-ui/core'
import Link from 'next/link'
import { getTagColor } from 'lib/utils'
import DateDisplay from 'lib/components/date-display'

// 4つだけは「カテゴリ」としてカード上部にバッジで出す。残りは下段のタグ行に回す。
const CATEGORY_TAGS = ['Tips', 'Blog', '経験者向け', '初級者向け']

export interface PostItemProps {
  post: {
    url: string
    name: string
    meta?: {
      date?: string
      updateDate?: string
      title?: string
      tags?: Array<string>
      description?: string
    }
  }
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {

  const theme = useTheme()

  const tags = post.meta?.tags ?? []
  const categories = CATEGORY_TAGS.filter(tag => tags.includes(tag))
  const otherTags = tags.filter(tag => !CATEGORY_TAGS.includes(tag))
  const description = post.meta?.description

  return (
    // 色は Tailwind の dark: で付ける。geist の palette は themeType（localStorage 由来で
    // 実質 light 固定）に従うので、OS のダークモードと食い違って白背景＋白文字になる。
    <article className="item bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-orange-400">
      <div className="flex flex-wrap gap-x-2 gap-y-2 mb-3">
        {categories.map(tag => (
          <Link href={`/tags/${encodeURI(tag)}`} key={tag}>
            <span className={getTagColor(tag) + " inline-block text-xs md:text-sm px-3 py-1 rounded-2xl"}>
              {tag}
            </span>
          </Link>
        ))}
      </div>

      <Link href={post.url} passHref className="block">
        <span className="title-text text-black dark:text-white text-base lg:text-xl xl:text-2xl font-bold">
          {post.name}
        </span>
      </Link>

      {description && (
        <p className="excerpt mt-2 mb-0 text-xs md:text-sm text-gray-700 dark:text-gray-200">
          {description}
        </p>
      )}

      <div className="mt-3 pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 meta-row">
        <DateDisplay date={post.meta?.date ?? ""} updateDate={post.meta?.updateDate} />
        {otherTags.length > 0 && (
          <p className="py-0 m-0 text-xs text-gray-600 dark:text-gray-300">
            {otherTags.map(value => (
              <Link href={`/tags/` + encodeURI(value)} key={value} className="!font-normal !text-gray-600 dark:!text-gray-300 hover:!text-orange-500 text-xs mr-2">
                #{value}
              </Link>
            ))}
          </p>
        )}
      </div>

      <style jsx>{`
        .item {
          max-width: 100%;
          /* 2列に並べたとき行の高さが揃うよう、カード自身を縦に伸ばす。
             grid item に height:100% を付けるとグリッド全体の高さを参照して
             カードが重なるので、stretch（既定）に任せる */
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          border-radius: 0.75rem;
          transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
        }

        .item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        /* 見出しはグローバルの h2/h3 装飾を避けて span のままにしてある。
           カードのどこにホバーしてもタイトルが反応するよう group で受ける */
        .item :global(.title-text) {
          transition: color 150ms ease;
          line-height: 1.5;
        }

        .item:hover :global(.title-text) {
          color: #f97316;
        }

        /* 日付とタグはカードの下端に揃える */
        .meta-row {
          margin-top: auto;
        }

        .excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
        }

        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .item {
            padding: 1rem;
          }

          .item:hover {
            transform: none;
          }
        }
      `}</style>
    </article>
  )
}

export default PostItem
