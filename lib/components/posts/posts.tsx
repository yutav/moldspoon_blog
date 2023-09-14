import Head from 'next/head'
import React, { useMemo } from 'react'
import PostItem from './post-item'
import { Configs } from 'lib/utils'
import NextLink from 'next/link'
import metadata from 'lib/data/metadata.json'
import { useTheme } from '@geist-ui/core'

const getMoreLink = (len: number): React.ReactNode => {
  if (len < Configs.latestLimit) return null
  return (
    <NextLink href="/blog" passHref>
      もっと見る
    </NextLink>
  )
}

const getPosts = (data: typeof metadata, isLatest?: boolean, tag?: string) => {

  const postNode = data.find(item => item.name === 'posts');
  const posts = (postNode || {}).children || [];

  console.log(posts)
  console.log(tag)

  if (!tag) {
    // tagが指定されていない場合、全てのポストを返す
    if (!isLatest) return posts;
    return posts.slice(0, Configs.latestLimit);
  }

  // tagが指定されている場合、tagが含まれているポストのみをフィルタリングして返す
  const filteredPosts = posts.filter(post => {
    const tags = (post.meta || {}).tags || [];
    return tags.includes(tag);
  });
  console.log(filteredPosts)

  if (!isLatest) return filteredPosts;
  return filteredPosts.slice(0, Configs.latestLimit);
};

export interface PostsProps {
  isLatest?: boolean
  tag?: string
}

const Posts: React.FC<PostsProps> = ({ isLatest = false, tag }) => {

  const theme = useTheme()
  let posts = []
  let title = ""
  posts = useMemo(() => getPosts(metadata, isLatest, tag), [tag]);
  if (tag !== undefined) {
    title = `「${tag}」 の記事一覧`
  }
  else if (isLatest) {
    title = Configs.title
  }
  else {
    title = Configs.labels.list + " - " + Configs.title
  }

  return (
    <section>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      {!isLatest && <h2 className="mb-8">{title}</h2>}
      <div className="content">
        {posts.map((post, index) => (
          <PostItem post={post} key={`${post.url}-${index}`} />
        ))}
        {isLatest && <span className="more">{getMoreLink(posts.length)}</span>}
      </div>
      <style jsx>{`
        section {
          margin-top: calc(${theme.layout.gap} * 2);
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
    </section>
  )
}

export default Posts
