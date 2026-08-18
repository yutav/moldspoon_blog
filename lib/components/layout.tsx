import React, { useMemo } from 'react'
import Head from 'next/head'
import Profile from './profile'
import Footer from './footer'
import Title from './title'
import { Spacer } from '@geist-ui/core'
import { Configs, changeTitle } from '../utils'
import ShareButtons from './original/parts/ShareButtons'
import TagLinks from './original/parts/TagLinks'
import IntroduceMyself from './original/parts/IntroduceMyself'
import BLOG from 'blog.config'
import { getDNSPrefetchValue } from 'lib/data-transform'
import { useRouter } from "next/router"
import { usePageCounter } from 'hooks/usePageCounter'
import PrevNext from './original/parts/PrevNext'
import Toc from './original/parts/Toc'
import { renderToString } from 'react-dom/server';
import GoogleAdsense from './original/parts/GoogleAdsense'
import SearchBox from './original/parts/SearchBox'
import "../../scripts/marker.js";
import Script from 'next/script'
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

// canonical はこれまでブログ全体で1つも出していなかった。記事ページは内容が
// 個別なので Google が自己参照を推測してくれていたが、タグページのように
// 中身が同一のページでは正規URLの判断を委ねることになる。currentUrl は
// basePath を除いた asPath から組み立てた絶対URLで、サーバーとクライアントで
// 同じ値になる（og:url と同じもの）。
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
      {/* 静的最適化されたページの初期HTMLでは asPath に [code] のような未解決の
          動的セグメントが残る。誤った正規URLを主張するくらいなら出さない */}
      {currentUrl && !currentUrl.includes('[') && <link rel="canonical" href={currentUrl} />}
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
      {(process.env.NODE_ENV == 'production') && (
        <Script strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1104475365452915" crossOrigin="anonymous" />
      )}
      <link rel="stylesheet" href={`${process.env.baseUrl}/css/speed-highlight-1.2.4/default.css`} media="all"
        // // Next.js doesn't like this but it allows us to load CSS asynchronously
        // @ts-ignore
        onload="this.media='all';this.onload=null;"
      />
      <noscript>
        <link rel="stylesheet" href={`${process.env.baseUrl}/css/speed-highlight-1.2.4/default.css`} />
      </noscript>
      <link rel="stylesheet" href={`https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css`} media="all"
        // // Next.js doesn't like this but it allows us to load CSS asynchronously
        // @ts-ignore
        onload="this.media='all';this.onload=null;"
      />
      <noscript>
        <link rel="stylesheet" href={`https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css`} />
      </noscript>
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

  const inDetailPage = useMemo(() => meta && meta.title, [])

  const router = useRouter()
  // window.location から取るとサーバー側が空になり、og:url が初期HTMLから消えるうえ
  // ハイドレーションで値が入れ替わる。basePath を除いた asPath から組み立てて、
  // サーバーとクライアントで同じ値にする
  // トップは asPath が '/' なので、そのまま繋ぐと baseUrl 末尾と合わせて
  // https://moldspoon.jp/blog/ になる。実際の /blog/ は /blog へ308される側なので、
  // canonical がリダイレクト元を指してしまう。ルートだけ空にして正規化する。
  //
  // さらに本番の /blog は pages/top.tsx が返っており asPath が '/top' になる
  // （ローカルの dev では index.tsx が出るので再現しない）。素直に組み立てると
  // インデックス済みのトップが、未登録の /blog/top を正規URLだと主張してしまう。
  // 中身は /blog と完全に同一なので、どちらもトップに寄せる。
  const rawPath = router.asPath.split('?')[0].split('#')[0]
  const currentPath = rawPath === '/' || rawPath === '/top' ? '' : rawPath
  const currentUrl = process.env.baseUrl + currentPath
  const isDetailPage = router.pathname.startsWith('/posts') as boolean;

  const [{ pageView }] = usePageCounter({
    slug: router.asPath
  })

  // かつてはマウントするまで本文を display:none で隠していたが、プロフィール・
  // タグ・前後記事・フッターごと初期HTMLから消えるため、クローラーからは
  // 内部リンクの無いページに見えていた。ちらつき対策は個々のコンポーネント側で持たせる。
  return (
    <section>
      <LayoutHeader currentUrl={currentUrl} meta={meta} isDetailPage={isDetailPage} />
      <div className="flex">
        <div className="container p-0 lg:px-12 bg-white dark:bg-black lg:shadow">
          <Spacer />
          <Profile />
          {inDetailPage ? (
            <>
              <Title title={meta.title} date={meta.date} updateDate={meta.updateDate} pageView={pageView} />
              <TagLinks tags={meta.tags} />
              <div className="dynamic-content detail-body">
                <IntroduceMyself />
                {children}
              </div>
              <ShareButtons url={currentUrl} title={meta.title ? meta.title : ''} />
            </>
          ) : (
            <div className="dynamic-content">
              {children}
            </div>
          )}
          <PrevNext routerPathName={router.pathname} />

          <Footer isDetailPage={!!inDetailPage} />
        </div>

        {/* 右サイドバー。以前はトップにしか無く、記事詳細では目次・検索・広告が
            それぞれ position: fixed で画面に貼り付いているだけだった。
            CNET のように本文の隣の「列」としてまとめ、両方で同じ骨格にする。 */}
        <aside className="mt-2 ml-6 right-container hidden xl:block">
          <div className="sidebar-inner">
            {inDetailPage && <Toc body={childrenHtml} />}

            <SearchBox />

            <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-3"
              style={{ minHeight: '400px', maxHeight: "550px" }}
            >
              <p className='text-xs py-1 my-0 text-gray-600 dark:text-gray-300'>Ads:</p>
              {/* blog-top-square */}
              {(process.env.NODE_ENV == 'production') && (
                <GoogleAdsense
                  client="ca-pub-1104475365452915" //
                  slot="1717621406"
                  style={{ display: 'block' }}
                />
              )}
            </div>
          </div>
        </aside>

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

        /* サイドバーは本文と一緒にスクロールし、追い越したら止まる。
           position: fixed と違って本文やフッターと重ならない */
        .sidebar-inner {
          position: sticky;
          top: 1rem;
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
