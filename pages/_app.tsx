import { NextPage } from 'next'
import { AppProps } from 'next/app'
import useDomClean from 'lib/use-dom-clean'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { ThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { useCallback } from 'react'
import { BlogConfigsProvider } from 'lib/components'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import "../styles/prism-a11y-dark.css";

/**
 * geist は Tailwind とは別に自前のテーマを持っている。
 * 以前はここで localStorage を直接読んでいたが、書き込むのもここだけだったため
 * 実質 light 固定で、Tailwind の dark:（当時は OS 設定に追従）と食い違い、
 * OS がダークだとカードが白背景＋白文字になるといった破綻が起きていた。
 * next-themes が解決した結果を渡して、両者を必ず一致させる。
 */
const GeistBridge: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { resolvedTheme, setTheme } = useNextTheme()
  const themeType = resolvedTheme === 'dark' ? 'dark' : 'light'
  const changeHandle = useCallback((isDark: boolean) => setTheme(isDark ? 'light' : 'dark'), [setTheme])

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <BlogConfigsProvider onChange={changeHandle}>
        {children}
      </BlogConfigsProvider>
    </GeistProvider>
  )
}

const Application: NextPage<AppProps<unknown>> = ({ Component, pageProps }) => {
  useDomClean()

  return (
    /*
      既定は "system"（OS のライト/ダーク設定に追従）。
      トグルで明示的に選ぶと localStorage の "theme" に保存され、以後はそちらが優先される。
      本体サイト（moldspoon.jp）と同じキー・同じオリジンなので、
      どちらで切り替えても両方に反映される。
    */
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <GeistBridge>
        <Component {...pageProps} />
      </GeistBridge>
      <style global jsx>{`
        @media only screen and (max-width: 767px) {
          html {
            font-size: 15px;
          }
        }
      `}</style>
    </ThemeProvider>
  )
}

export default Application
