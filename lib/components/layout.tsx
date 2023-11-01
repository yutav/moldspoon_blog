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
import GoogleAdsense from './original/parts/GoogleAdsense'
import DetailLeftBox from './original/parts/DetailLeftBox'

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
      <link rel="icon" href={process.env.baseUrl + "/favicon.ico"}></link>
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
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1104475365452915"
        crossOrigin="anonymous"></script>
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
    tags: [],
    description: '',
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
  const isDetailPage = router.pathname.startsWith('/posts') as boolean;

  const [{ pageView }] = usePageCounter({
    slug: router.asPath
  })

  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = () => {
    const googleSearchUrl = `https://www.google.com/search?q=site:moldspoon.jp/blog+${encodeURIComponent(
      searchQuery
    )}`;
    window.open(googleSearchUrl, '_blank')
  };

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
    <section className="animate-fadeIn">
      <LayoutHeader meta={meta} isDetailPage={isDetailPage} />
      <div className="flex">
        <div className="container p-0 lg:px-12 bg-white dark:bg-black lg:shadow">
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
              <DetailLeftBox detailContents={
                <div>

                  <div className="bg-white dark:bg-black lg:shadow rounded-lg p-6 mb-2">
                    <h3 className="!mt-0 mb-6">検索</h3>
                    <div className="border-2 border-gray-100 rounded py-2 px-3 flex">
                      <i className="mt-0.5 mr-2 cursor-pointer ri-search-line" onClick={handleSearch}></i>
                      <input
                        type="text"
                        name="search"
                        className={"w-full text-xl bg-transparent "}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          console.log(e.key)
                          console.log(composing)
                          switch (e.key) {
                            case "Enter":
                              if (composing) break;
                              handleSearch();
                              break;
                          }
                        }}
                        onCompositionStart={startComposition}
                        onCompositionEnd={endComposition}
                      />
                    </div>
                    <p className="text-xs">※Google検索を使用しています。</p>
                  </div>
                </div>
              } />
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

        {inDetailPage ? (<></>) : (
          <div className="mt-2 ml-6 right-container hidden xl:block h-screen">

            <div className="right-container fixed z-2">
              <div className="bg-white dark:bg-black lg:shadow rounded-lg p-6 mb-2">
                <h3 className="mb-6">検索</h3>
                <div className="border-2 border-gray-100 rounded py-2 px-3 flex">
                  <i className="mt-0.5 mr-2 cursor-pointer ri-search-line" onClick={handleSearch}></i>
                  <input
                    type="text"
                    name="search"
                    className={"w-full text-xl bg-transparent "}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      console.log(e.key)
                      console.log(composing)
                      switch (e.key) {
                        case "Enter":
                          if (composing) break;
                          handleSearch();
                          break;
                      }
                    }}
                    onCompositionStart={startComposition}
                    onCompositionEnd={endComposition}
                  />
                </div>
                <p className="text-xs">※Google検索を使用しています。</p>
              </div>

              <div className="bg-white dark:bg-black lg:shadow rounded-lg px-6 py-2"
                style={{ minHeight: '400px', maxHeight: "550px" }}
              >
                <p className='text-xs py-1 my-0'>Ads:</p>
                {/* blog-top-square */}
                {process.env.NODE_ENV == 'production' && (
                  <GoogleAdsense
                    client="ca-pub-1104475365452915" //
                    slot="1717621406"
                    style={{ display: 'block' }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

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
        }

        
        .container :global(h5) {
          padding-left: 0.5rem;
          padding-bottom: 0.25rem;
          border-left: 5px solid #FFA500;
        }

        .right-container {
          width: 348px;
        }

        .right-container :global(h3) {
          font-size: 1.2rem;
          padding-left: 0.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #f0f0f0;        
          position: relative; /* 親要素に対して相対的な位置を設定 */
        }
        
        .right-container :global(h3)::after {
          content: "";
          display: block;
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100px;
          height: 3px;
          background-color: #FFA500;
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
