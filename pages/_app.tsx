import { NextPage } from 'next'
import { AppProps } from 'next/app'
import useDomClean from 'lib/use-dom-clean'
import { PrismBaseline } from '@geist-ui/prism'
import { GeistProvider, CssBaseline, Image } from '@geist-ui/core'
import { useCallback, useState, useEffect, ReactChild, ReactFragment, ReactPortal } from 'react'
import { BlogConfigsProvider } from 'lib/components'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

const Application: NextPage<AppProps<unknown>> = ({ Component, pageProps }) => {
  const [themeType, setThemeType] = useState('light')
  const changeHandle = useCallback((isDark: boolean) => {
    const next = isDark ? 'light' : 'dark'
    setThemeType(next)
  }, [])

  useEffect(() => {
    if (typeof localStorage !== 'object') return
    setThemeType(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
  }, [])
  useEffect(() => localStorage.setItem('theme', themeType), [themeType])
  useDomClean()

  return (
    <>

      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <PrismBaseline />
        <BlogConfigsProvider onChange={changeHandle}>
          <Component {...pageProps} />
        </BlogConfigsProvider>
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
