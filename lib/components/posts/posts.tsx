import Head from 'next/head'
import React, { useMemo } from 'react'
import PostItem from './post-item'
import { Configs } from 'lib/utils'
import NextLink from 'next/link'
import metadata from 'lib/data/metadata.json'
import { useTheme, Link } from '@geist-ui/core'

const getMoreLink = (len: number): React.ReactNode => {
  if (len < Configs.latestLimit) return null
  return (
    <NextLink href="/blog" passHref>
      <Link title="More">...</Link>
    </NextLink>
  )
}

const getLatest = (data: typeof metadata, isLatest?: boolean) => {
  const postNode = data.find(item => item.name === 'posts')
  const posts = (postNode || {}).children || []
  if (!isLatest) return posts
  return posts.slice(0, Configs.latestLimit)
}

const getTitle = (isLatest?: boolean): string => {
  if (!isLatest) return Configs.labels.list
  return Configs.labels.latest
}

export interface PostsProps {
  isLatest?: boolean
}

const Posts: React.FC<PostsProps> = ({ isLatest = false }) => {

  return (
    <section>
      hogehoge
    </section>
  )
}

export default Posts
