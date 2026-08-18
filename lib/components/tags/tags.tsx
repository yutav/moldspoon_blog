import Head from 'next/head'
import React, { useMemo } from 'react'
import { Configs } from 'lib/utils'
import metadata from 'lib/data/metadata.json'
import { useTheme } from '@geist-ui/core'
import Link from 'next/link'

const getTags = (data: typeof metadata) => {

  const postsNode = data.find(item => item.name === 'posts'); // Find the node with name 'posts'
  const posts = (postsNode || {}).children || []; // Get the children of the 'posts' node

  const tagsCountArray: { [key: string]: number } = {}; // Object to store tag counts as key-value pairs

  // Loop through each post and count the tags
  posts.forEach(post => {
    const tags = (post.meta || {}).tags || []; // Get the tags array from the post's meta data

    tags.forEach(tag => {
      tagsCountArray[tag] = (tagsCountArray[tag] || 0) + 1; // Increment tag count in the tagsCount object
    });
  });

  const tagsCountArrayPairs = Object.entries(tagsCountArray);
  tagsCountArrayPairs.sort((a, b) => b[1] - a[1]);

  const sortedTagsCountArray = Object.fromEntries(tagsCountArrayPairs);

  return sortedTagsCountArray;

};

const getTitle = (): string => {
  return Configs.labels.tags
}

export interface PostsProps {
}

// 縦一列のリンク一覧だと100個近いタグが延々と続くので、件数付きのバッジを敷き詰める。
// 同一サイト内なので target="_blank" は付けない。
const Tags: React.FC<PostsProps> = () => {
  const theme = useTheme()
  const tags = useMemo(() => getTags(metadata), [])
  const title = useMemo(() => getTitle(), [])

  return (
    <section>
      <Head>
        <title>
          {getTitle()} - {Configs.title}
        </title>
      </Head>
      <h3>このブログの「{title}」</h3>
      <div className="content">
        <div className="flex flex-wrap gap-2">
          {Object.entries(tags).map(([tag, count]) => (
            <Link href={`/tags/${encodeURI(tag)}`} key={tag} className="group">
              <span className="inline-block text-xs md:text-sm px-3 py-1 rounded-2xl border border-orange-300
                text-orange-500 dark:text-orange-400 group-hover:bg-orange-400 group-hover:text-white
                group-hover:border-orange-400 transition-colors">
                {tag}
                <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-white">
                  &nbsp;({count})
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        section {
          margin-top: calc(${theme.layout.gap} * 2);
        }

        .content {
          margin: ${theme.layout.gap} 0;
        }

        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          section {
            margin-top: ${theme.layout.gapQuarter};
          }
        }
      `}</style>
    </section >
  )
}

export default Tags
