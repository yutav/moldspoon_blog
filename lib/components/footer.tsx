import React from 'react'
import { useTheme, Spacer, Link, Divider } from '@geist-ui/core'
import { Configs } from '../utils'

export interface FooterProps {
  isDetailPage?: boolean
}

const Footer: React.FC<React.PropsWithChildren<FooterProps>> = ({
  isDetailPage = false,
}) => {
  const theme = useTheme()
  const linkProps = {
    rel: 'noreferrer',
    target: '_blank',
  }

  return (
    <>
      <div className="contacts">
        {isDetailPage && <Divider h={0.5} />}
        <div className="between">
          <div className="socials">
            {Configs.email && (
              <Link aria-label="email" href={Configs.email} {...linkProps}>
                Email
              </Link>
            )}
            {Configs.github && (
              <Link aria-label="github" href={Configs.github} {...linkProps}>
                Github
              </Link>
            )}
            {Configs.twitter && (
              <Link aria-label="twitter" href={Configs.twitter} {...linkProps}>
                Twitter
              </Link>
            )}
            <Link aria-label="sitemap" href={process.env.baseUrl + "/sitemap"} {...linkProps}>
              サイトマップ
            </Link>
            <Link aria-label="about" href={process.env.baseUrl + "/about"} {...linkProps}>
              このブログについて
            </Link>
          </div>
        </div>

        <style jsx>{`
          .contacts {
            width: ${Configs.layouts.pageWidth};
            padding: 0 ${theme.layout.gapQuarter};
            position: absolute;
            z-index: 1;
            bottom: 3.5rem;
            left: 50%;
            transform: translateX(-50%);
            color: ${theme.palette.accents_6};
          }

          .between {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .contacts :global(svg) {
            cursor: pointer;
            margin: ${theme.layout.gapQuarter} ${theme.layout.gapHalf};
            position: relative;
            color: inherit;
            z-index: 2;
          }

          .contacts :global(a) {
            color: inherit;
          }

          .socials :global(a) {
            margin-right: 0.5rem;
            font-size: 0.75rem;
          }

          .contacts span {
            color: inherit;
            display: inline-flex;
            justify-content: center;
            align-items: center;
          }

          .contacts span:hover {
            color: ${theme.palette.accents_4};
          }

          .contacts :global(a:hover) {
            color: ${theme.palette.accents_4};
            text-decoration: underline dashed;
            cursor: ne-resize;
            transition: all 150ms ease;
          }

          @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
            .contacts {
              position: absolute;
              width: ${Configs.layouts.pageWidthMobile};
            }
          }
        `}</style>
      </div>
      <Spacer h={3.5} />
    </>
  )
}

export default Footer
