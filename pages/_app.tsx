import Head from 'next/head'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import BLOG from '../blog.config'
import useDomClean from 'lib/use-dom-clean'
import { MDXProvider } from '@mdx-js/react'
import { PrismBaseline } from '@geist-ui/prism'
import { GeistProvider, CssBaseline, Image } from '@geist-ui/core'
import { useCallback, useState, useEffect, useMemo } from 'react'
import { getDNSPrefetchValue } from 'lib/data-transform'
import { BlogConfigsProvider } from 'lib/components'
import { HybridLink, HybridCode } from 'lib/components/mdx'
import { useRouter } from "next/router"
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

const Application: NextPage<AppProps<unknown>> = ({ Component, pageProps }) => {
  const router = useRouter()
  console.log(router)
  const [themeType, setThemeType] = useState('light')
  const [isNotDetail, setIsNotDetail] = useState(false)
  const domain = useMemo(() => getDNSPrefetchValue(BLOG.domain), [])
  const changeHandle = useCallback((isDark: boolean) => {
    const next = isDark ? 'light' : 'dark'
    setThemeType(next)
  }, [])

  useEffect(() => {
    if (typeof localStorage !== 'object') return
    setThemeType(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
    const _isNotDetail = router.pathname.match("/posts/(.*?)$") ? false : true
    setIsNotDetail(_isNotDetail)
  }, [])
  useEffect(() => localStorage.setItem('theme', themeType), [themeType])
  useDomClean()

  const components = {
    a: HybridLink,
    img: Image,
    pre: HybridCode,
  };

  return (
    <>
      <Head>
        <title>{BLOG.title}</title>
        {domain && <link rel="dns-prefetch" href={domain} />}
        <meta name="google" content="notranslate" />
        <meta name="referrer" content="strict-origin" />
        <meta property="og:site_name" content={BLOG.title} />
        <meta property="og:type" content="website" />
        <meta name="generator" content="yuku_tas" />
        <meta name="author" content={BLOG.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={`@${BLOG.twitter}`} />
        {isNotDetail && (
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
      </Head>
      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <PrismBaseline />
        <MDXProvider
          components={components} >
          <BlogConfigsProvider onChange={changeHandle}>
            <Component {...pageProps} />
          </BlogConfigsProvider>
        </MDXProvider>
        <style global jsx>{`
          @media only screen and (max-width: 767px) {
            html {
              font-size: 15px;
            }
          }
        `}</style>
      </GeistProvider >
    </>
  )
}

export default Application
