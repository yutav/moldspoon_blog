import Head from 'next/head'
import React, { useMemo } from 'react'
import { Configs } from 'lib/utils'
//import NextLink from 'next/link'
import metadata from 'lib/data/metadata.json'
import { useTheme } from '@geist-ui/core'
import TagItem from './tag-item'
import Link from 'next/link'

const getTags = (data: typeof metadata) => {
  const postsNode = data.find(item => item.name === 'posts'); // Find the node with name 'posts'
  const posts = (postsNode || {}).children || []; // Get the children of the 'posts' node

  const tagsCountArray = {}; // Object to store tag counts as key-value pairs

  // Loop through each post and count the tags
  posts.forEach(post => {
    const tags = (post.meta || {}).tags || []; // Get the tags array from the post's meta data

    tags.forEach(tag => {
      tagsCountArray[tag] = (tagsCountArray[tag] || 0) + 1; // Increment tag count in the tagsCount object
    });
  });

  return tagsCountArray;
};
const getTitle = (): string => {
  return Configs.labels.tags
}

export interface PostsProps {
}

const Tags: React.FC<PostsProps> = () => {
  const theme = useTheme()
  const tags = useMemo(() => getTags(metadata), [])
  const title = useMemo(() => getTitle(), [])

  console.log(tags)

  return (
    <section>
      <Head>
        <title>
          {getTitle()} - {Configs.title}
        </title>
      </Head>
      <h2>{title}</h2>
      <div className="content">
        <ul>
          {Object.entries(tags).map(([tag, count], index) => (
            <li>
              <Link key={index} href={`/tags/${tag}`}>
                <a className="text-orange-500 hover:text-orange-300" target="_blank">
                  {tag} ({count})
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        section {
          margin-top: calc(${theme.layout.gap} * 2);
        }

        section h2 {
          font-size: 0.8rem;
          color: ${theme.palette.accents_6};
          text-transform: uppercase;
          letter-spacing: 2px;
          border-bottom: 2px solid ${theme.palette.accents_6};
          padding: 2px ${theme.layout.gapQuarter} 0 0;
          display: inline-block;
          margin: 0;
        }

        .content {
          margin: ${theme.layout.gap} 0;
        }

        .more {
          display: block;
        }

        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          section {
            margin-top: ${theme.layout.gapQuarter};
          }

          section h2 {
            margin-top: calc(1.5 * ${theme.layout.gap});
          }
        }
      `}</style>
    </section >
  )
}

export default Tags
