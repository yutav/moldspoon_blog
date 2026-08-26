import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import BLOG from '../blog.config'
import { CssBaseline } from '@geist-ui/core'
import flush from 'styled-jsx/server'
import Script from 'next/script'

/*
  テーマをファーストペイントより前に確定させる。

  next-themes が差し込むスクリプトは ThemeProvider の位置、つまり <body> の先頭に出る。
  <head> は既に解析済みで、<body> のクラス（dark:bg-black 等）は html.dark が付くまで
  ライト側で解決されるため、フルリロードのたびに一瞬白く光る（ダークで見ていると顕著）。
  同じ判定を <head> 内の同期スクリプトで先に済ませ、next-themes には同じ結論を
  なぞらせる。storageKey / attribute は next-themes の既定値に合わせてある。
*/
const THEME_SCRIPT = `(function(){try{
var e=localStorage.getItem('theme');
var d=document.documentElement;
var dark=e==='dark'||((!e||e==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);
d.classList[dark?'add':'remove']('dark');
d.style.colorScheme=dark?'dark':'light';
}catch(err){}})();`

/*
  計測タグを読み込んでよい環境か。ローカル開発と Vercel のプレビューでは読み込まない。
  これまで無条件に読み込んでいたため、ローカルで開いたぶんが本番の GA4 に入っていた。
  NODE_ENV だけで見ると Vercel のプレビューも production になるので素通りする。
  本体サイト（moldspoon.jp）側と同じ判定にしてある。
*/
const isProductionSite =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'

class BlogDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = CssBaseline.flush()

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
          {flush()}
        </>
      ),
    }
  }

  render() {
    return (
      <Html lang={BLOG.language}>
        <Head>
          {/* 描画前にテーマを確定させる。詳細は THEME_SCRIPT のコメント */}
          <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        </Head>
        <body className="bg-white lg:bg-gray-100 dark:bg-black lg:dark:bg-gray-900 text-black dark:text-white">
          <Main />
          <NextScript />
          {isProductionSite && <Script
            async={true}
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${BLOG.googleAnalytics}');
      `,
            }}
          />}
        </body>
      </Html>
    )
  }
}

export default BlogDocument
