import React from 'react'
import { useTheme } from '@geist-ui/core'
import NextLink from 'next/link'
import { Configs } from '../utils'

export interface FooterProps {
  isDetailPage?: boolean
}

const Footer: React.FC<React.PropsWithChildren<FooterProps>> = () => {
  const theme = useTheme()
  const externalProps = {
    rel: 'noreferrer',
    target: '_blank',
  }

  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    // 以前は position: absolute / bottom: 3.5rem で浮かせていたため、
    // 本文の高さによって重なったり途中に現れたりしていた。通常フローに戻す。
    <footer className="contacts border-t border-gray-200 dark:border-gray-700">
      <div className="links">
        <a aria-label="page top" href="#" onClick={scrollToTop}>
          ページトップ
        </a>
        {Configs.email && (
          <a aria-label="email" href={Configs.email} {...externalProps}>
            お問合せ
          </a>
        )}
        {Configs.github && (
          <a aria-label="github" href={Configs.github} {...externalProps}>
            Github
          </a>
        )}
        {Configs.twitter && (
          <a aria-label="twitter" href={Configs.twitter} {...externalProps}>
            Twitter
          </a>
        )}
        <NextLink aria-label="about" href="/about">
          このブログについて
        </NextLink>
        <NextLink aria-label="privacy" href="/privacy">
          プライバシーポリシー
        </NextLink>
      </div>

      <p className="copyright">© MoldSpoon Inc.</p>

      <style jsx>{`
        .contacts {
          width: 100%;
          margin-top: ${theme.layout.gap};
          padding: ${theme.layout.gap} 0 ${theme.layout.gap} 0;
        }

        .links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem 1.25rem;
        }

        /* 色は next-themes が html に付ける .dark を基準にする
           （geist の palette は themeType 依存で、トグルに即応させたいため） */
        .contacts :global(a) {
          color: #4b5563;
          font-size: 0.75rem;
          font-weight: normal;
        }

        .contacts :global(a:hover) {
          color: #f97316;
          text-decoration: underline;
          transition: color 150ms ease;
        }

        .copyright {
          margin: 1rem 0 0 0;
          font-size: 0.7rem;
          color: #6b7280;
        }

        :global(html.dark) .contacts :global(a) {
          color: #d1d5db;
        }

        :global(html.dark) .copyright {
          color: #9ca3af;
        }
      `}</style>
    </footer>
  )
}

export default Footer
