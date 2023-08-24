import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Profile from './profile'
import Contacts from './contacts'
import Title from './title'
import { Spacer } from '@geist-ui/core'
import { Configs, changeTitle } from '../utils'
import ShareButtons from './original/parts/ShareButtons'
import TagLinks from './original/parts/TagLinks'
import IntroduceMyself from './original/parts/IntroduceMyself'
import "remixicon/fonts/remixicon.css"

export type PostMetadata = {
  title: string
  date: string
  tags?: Array<string>
  description?: string
  image?: string
}

export type LayoutHeader = {
  currentUrl?: string
  meta: PostMetadata
}

const LayoutHeader: React.FC<LayoutHeader> = ({ currentUrl, meta }) => {

  return (
    <Head>
      {
        meta.title && (
          <title>
            {changeTitle({ title: meta.title })}
          </title>
        )
      }
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {meta.title && <meta property="og:title" content={meta.title} />}
      {meta.description && <meta name="description" content={meta.description} />}
      {meta.description && <meta property="og:description" content={meta.description} />}
      {meta.title && <meta property="og:image" content={process.env.baseUrl + "/api/og?title=" + encodeURI(meta.title)} />}
      {meta.title && <meta property="twitter:image" content={process.env.baseUrl + "/api/og?title=" + encodeURI(meta.title)} />}
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
    tags: []
  },
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type LayoutProps = Props & NativeAttrs

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  meta,
}: LayoutProps & typeof defaultProps) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [showAfterRender, setShowAfterRender] = useState(false)
  const inDetailPage = useMemo(() => meta && meta.title, [])
  useEffect(() => setShowAfterRender(true), [])

  if (!showAfterRender)
    return (
      <div className="article-content">
        <LayoutHeader currentUrl={currentUrl} meta={meta} />
        {children}
        <style jsx>{`
          .article-content {
            opacity: 0;
            display: none;
          }
        `}</style>
      </div>
    )

  return (
    <section>
      <LayoutHeader meta={meta} />
      <div className="container p-0 md:px-5 lg:px-0">
        <Spacer />
        <Profile />
        {inDetailPage &&
          <>
            <Title title={meta.title} date={meta.date} />
            <TagLinks tags={meta.tags} />
          </>
        }
        <div className="dynamic-content">
          {inDetailPage &&
            <IntroduceMyself />
          }
          {children}
        </div>
        {inDetailPage &&
          <ShareButtons url={currentUrl} title={meta.title ? meta.title : ''} />
        }
        <Spacer h={5} />
        <Contacts isDetailPage={!!inDetailPage} />
      </div>


      <style jsx>{`
        section {
          width: 100vw;
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
          margin-top: 2.25rem;
        }

        .container :global(h3) {
          font-size: 1.4rem;
          margin-top: 3rem;
          padding-left: 0.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 5px dotted #f0f0f0;
        
        }

        .container :global(h4) {
          font-size: 1.2rem;
          margin-top: 1.5rem;
          padding-left: 0.25rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px groove #f8f8f8;
        }

        .container :global(h5) {
          margin-top: 1.5rem;
          padding-left: 0.5rem;
          padding-bottom: 0.25rem;
          border-left: 5px solid #FFA500;
        }

        @media only screen and (max-width: 767px) {
          .container {
            max-width: ${Configs.layouts.pageWidthMobile};
            min-height: 100vh;
          }
        }
      `}</style>
    </section>
  )
}

Layout.defaultProps = defaultProps

export default Layout
