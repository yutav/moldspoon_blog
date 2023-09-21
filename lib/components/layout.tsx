import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Profile from './profile'
import Footer from './footer'
import Title from './title'
import { Spacer } from '@geist-ui/core'
import { Configs, changeTitle } from '../utils'
import ShareButtons from './original/parts/ShareButtons'
import TagLinks from './original/parts/TagLinks'
import IntroduceMyself from './original/parts/IntroduceMyself'
import "remixicon/fonts/remixicon.css"
import BLOG from 'blog.config'
import { getDNSPrefetchValue } from 'lib/data-transform'
import { useRouter } from "next/router"
import { usePageCounter } from 'hooks/usePageCounter'
import PrevNext from './original/parts/PrevNext'
import Toc from './original/parts/Toc'
import { renderToString } from 'react-dom/server';

export type PostMetadata = {
  title: string
  date: string
  updateDate?: string
  tags?: Array<string>
  description?: string
  image?: string
}

export type LayoutHeader = {
  isDetailPage: boolean
  currentUrl?: string
  meta: PostMetadata
}

const LayoutHeader: React.FC<LayoutHeader> = ({ isDetailPage, currentUrl, meta }) => {

  const domain = useMemo(() => getDNSPrefetchValue(BLOG.domain), [])

  return (
    <Head>
      {(isDetailPage && meta.title) ? (
        <title>
          {changeTitle({ title: meta.title })}
        </title>
      ) : (
        <title>{BLOG.title}</title>
      )}
      {domain && <link rel="dns-prefetch" href={domain} />}
      <meta name="google" content="notranslate" />
      <meta name="referrer" content="strict-origin" />
      <meta property="og:site_name" content={BLOG.title} />
      <meta property="og:type" content="website" />
      <meta name="generator" content="yuku_tas" />
      <meta name="author" content={BLOG.author} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={`@${BLOG.twitter}`} />
      {isDetailPage ? (
        <>
          {currentUrl && <meta property="og:url" content={currentUrl} />}
          {meta.title && <meta property="og:title" content={meta.title} />}
          {meta.description && <meta name="description" content={meta.description} />}
          {meta.description && <meta property="og:description" content={meta.description} />}
          {meta.title && <meta property="og:image" content={process.env.baseUrl + "/api/og?title=" + encodeURI(meta.title)} />}
          {meta.title && <meta property="twitter:image" content={process.env.baseUrl + "/api/og?title=" + encodeURI(meta.title)} />}
        </>
      ) : (
        <>
          <meta property="og:url" content={BLOG.domain} />
          <meta property="og:title" content={BLOG.title} />
          <meta name="description" content={BLOG.description} />
          <meta property="og:description" content={BLOG.description} />
          <meta property="og:image" content={`https:${domain}/blog/assets/moldspoonblog_ogp.png`} />
          <meta property="twitter:image" content={`https:${domain}/blog/assets/moldspoonblog_ogp.png`} />
        </>

      )}
      <meta
        name="viewport"
        content="initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
      />
    </Head >
  )
}

export type Props = {
  meta?: PostMetadata
}
const defaultProps = {
  meta: {
    title: '',
    date: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    tags: []
  },
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type LayoutProps = Props & NativeAttrs

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  meta
}: LayoutProps & typeof defaultProps) => {

  let childrenHtml = '';

  if (React.isValidElement(children)) {
    // childrenがReact要素である場合のみrenderToStringを呼び出す
    childrenHtml = renderToString(children);
  }

  const [showAfterRender, setShowAfterRender] = useState(false)
  const inDetailPage = useMemo(() => meta && meta.title, [])
  useEffect(() => setShowAfterRender(true), [])

  const router = useRouter()
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isDetailPage = router.pathname.startsWith('/posts');

  const [{ pageView }] = usePageCounter({
    slug: router.asPath
  })

  if (!showAfterRender) {
    return (
      <div className="article-content">
        <LayoutHeader currentUrl={currentUrl} meta={meta} isDetailPage={isDetailPage} />
        {children}
        <style jsx>{`
          .article-content {
            opacity: 0;
            display: none;
          }
        `}</style>
      </div>
    )
  }

  return (
    <section className="">
      <LayoutHeader meta={meta} isDetailPage={isDetailPage} />
      <div className="container p-0 lg:px-12 bg-white dark:bg-black">
        <Spacer />
        <Profile />
        {inDetailPage ? (

          <>
            <Title title={meta.title} date={meta.date} updateDate={meta.updateDate} pageView={pageView} />
            <TagLinks tags={meta.tags} />
            <div className="dynamic-content">
              <IntroduceMyself />
              {children}
            </div>
            <ShareButtons url={currentUrl} title={meta.title ? meta.title : ''} />
            <Toc body={childrenHtml} />

          </>
        ) : (
          <div className="dynamic-content">
            {children}
          </div>
        )}
        <PrevNext routerPathName={router.pathname} />

        <Spacer h={5} />
        <Footer isDetailPage={!!inDetailPage} />
      </div>


      <style jsx>{`
        section {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dynamic-content {
          width: 100%;
          height: auto;
        }

        .container {
          width: 100%;
          min-height: 1000px;
          max-width: ${Configs.layouts.pageWidth};
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .container :global(h1) {
          font-size: 2rem;
        }

        .container :global(h2) {
          font-size: 1.7rem;
        }

        .container :global(h3) {
          font-size: 1.4rem;
          padding-left: 0.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #f0f0f0;        
          position: relative; /* 親要素に対して相対的な位置を設定 */
        }
        
        .container :global(h3)::after {
          content: "";
          display: block;
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100px;
          height: 3px;
          background-color: #FFA500;
        }

        .container :global(h4) {
          font-size: 1.2rem;
          padding: 0.25rem 0.5rem;
          border-top: 2px solid purple;
          border-bottom: 2px solid purple;
          color: purple;
        }

        .container :global(h5) {
          padding-left: 0.5rem;
          padding-bottom: 0.25rem;
          border-left: 5px solid #FFA500;
        }

        @media only screen and (max-width: 1024px) {
          .container {
            max-width: ${Configs.layouts.pageWidthMobile};
            min-height: 100vh;
          }
        }
      `}</style>
    </section >
  )
}

Layout.defaultProps = defaultProps

export default Layout
