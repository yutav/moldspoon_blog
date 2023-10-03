import Head from 'next/head'
import React, { useMemo } from 'react'
import PostItem from './post-item'
import { Configs } from 'lib/utils'
import Link from 'next/link'
import metadata from 'lib/data/metadata.json'
import { useTheme } from '@geist-ui/core'
import Pager from './pager'
import { NextRouter, useRouter } from 'next/router'

const getMoreLink = (len: number): React.ReactNode => {
  if (len < Configs.latestLimit) return null
  return (
    <Link href="/blog" passHref>
      もっと見る
    </Link>
  )
}

const getPosts = (data: typeof metadata, page?: number, tag?: string) => {
  const postNode = data.find(item => item.name === 'posts');
  const posts = (postNode || {}).children || [];

  let filteredPosts = posts;
  if (tag !== undefined) {
    filteredPosts = posts.filter(post => {
      const tags = (post.meta || {}).tags || [];
      return tags.includes(tag);
    });
  }

  let nowPage = page ? page : 1;

  const start = (nowPage - 1) * Configs.latestLimit;
  const end = nowPage * Configs.latestLimit;

  const postCount = filteredPosts.length; // ポストの総数を計算

  const paginatedPosts = filteredPosts.slice(start, end);

  return { postCount, posts: paginatedPosts };
};

export interface PostsProps {
  page?: number
  tag?: string
  router: NextRouter
}

const Posts: React.FC<PostsProps> = ({ page, tag, router }) => {

  const theme = useTheme()
  let title = ""
  let { postCount, posts } = useMemo(() => getPosts(metadata, page, tag), [page, tag]);

  if (tag !== undefined) {
    title = `「${tag}」 の記事一覧`
  }

  return (
    <section>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      {title !== "" && <h2 className="mb-8">{title}</h2>}
      <div className="content">
        {posts.map((post, index) => (
          <PostItem post={post} key={`${post.url}-${index}`} />
        ))}
        <Pager postCount={postCount} page={page} router={router} tag={tag} />
        {/*isLatest && <span className="more">{getMoreLink(posts.length)}</span>*/}
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
