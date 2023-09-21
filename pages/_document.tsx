import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import BLOG from '../blog.config'
import { CssBaseline } from '@geist-ui/core'
import flush from 'styled-jsx/server'
import Script from 'next/script'

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
        <Head />
        <body className="bg-white lg:bg-gray-100 dark:bg-black lg:dark:bg-gray-900 text-black dark:text-white">
          <Main />
          <NextScript />
          <Script
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
          />
        </body>
      </Html>
    )
  }
}

export default BlogDocument
