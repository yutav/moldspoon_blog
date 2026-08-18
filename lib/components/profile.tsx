import React, { useState } from 'react'
import { useTheme } from '@geist-ui/core'
import NextLink from 'next/link'
// import ProfileLinks from './profile-links'
import { Configs } from '../utils'
import BLOG from '../../blog.config'
import Image from 'next/image'
import ThemeToggle from './theme-toggle'

// ヘッダーのナビ。PC では常時表示、狭い画面ではハンバーガーの中に出す。
// 出し分けで文言がずれないよう定義は1箇所にしてある。
//
// label はヘッダーに横並びで置く用の短い表記。fullLabel はハンバーガーメニュー用で、
// 縦に並ぶぶん幅を気にせず正式名称を出せる。アイコンもメニュー側だけで使う。
// 本体サイト（moldspoon.jp）のヘッダーもアイコンなし・短い語で揃えてある。
const NAV_ITEMS = [
  { href: () => process.env.domain as string, icon: 'ri-building-line', label: '企業サイト', fullLabel: 'MoldSpoon Inc.企業ページ' },
  { href: () => process.env.baseUrl + '/tags', icon: 'ri-price-tag-3-line', label: 'タグ一覧', fullLabel: 'タグ一覧' },
  { href: () => process.env.baseUrl + '/about', icon: 'ri-information-line', label: 'このブログについて', fullLabel: 'このブログについて' },
]

const Profile: React.FC<unknown> = React.memo(() => {
  const theme = useTheme()
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  let darkLogoUrl = "/blog/assets/moldspoonblog_short_white.png"
  let logoUrl = "/blog/assets/moldspoonblog_short.png"
  const menuLinkTextClass = "text-white hover:text-gray-300 dark:text-white dark:hover:text-gray-500 font-normal"

  return (
    <div className="profile">
      <div className="user">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex-none">
            <NextLink href="/" className="block">
              <span className="block w-48 sm:w-64 md:w-72 lg:w-80 p-0 m-0">
                <Image src={logoUrl} width="400" height="58" alt={BLOG.title} className="block dark:hidden w-full h-auto" />
                <Image src={darkLogoUrl} width="400" height="58" alt={BLOG.title} className="hidden dark:block w-full h-auto" />
              </span>
            </NextLink>
          </div>

          {/* テーマの切り替えはメニューを開かなくても押せるよう、常に出しておく */}
          <div className="flex items-center gap-3 md:gap-5">
            <nav className="hidden md:flex items-center gap-5 lg:gap-6">
              {NAV_ITEMS.map(item => (
                <a href={item.href()} key={item.label} className="whitespace-nowrap">
                  <span className="text-sm font-normal text-gray-800 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            <ThemeToggle />

            <div className='flex-none w-8 md:hidden'>
              <i className="ri-menu-line text-2xl md:text-3xl cursor-pointer" onClick={handleMenuOpen} ></i>
              <div
                className={
                  openMenu
                    ? 'text-left fixed border-l-2 dark:bg-gray-900 bg-gray-700 -right-8 top-0 py-4 px-8 h-screen flex flex-col justify-start -translate-x-8 transition ease-in-out z-20'
                    : 'fixed right-[-100%]'
                }
              >
                <div className="flex justify-between">
                  <div></div>
                  <i className="ri-close-line text-2xl md:text-3xl cursor-pointer text-white dark:text-white" onClick={handleMenuOpen} ></i>
                </div>
                <nav className="block">
                  {NAV_ITEMS.map(item => (
                    <p key={item.label}>
                      <a href={item.href()} className="leading-relaxed" onClick={handleMenuOpen}>
                        <span className={menuLinkTextClass}>
                          <i className={item.icon + " text-white"}></i>&nbsp;
                          {item.fullLabel}
                        </span>
                      </a>
                    </p>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div
          className="summary text-gray-700 dark:text-gray-200 pt-5 md:pt-6 pb-5 text-xs md:text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: Configs.summary }}
        />
      </div>
      {/*<ProfileLinks />*/}
      <style jsx>{`

        .profile {
          padding: ${theme.layout.gap} 0 0 0;
          margin-bottom: ${theme.layout.gapHalf};
          position: relative;
        }

        /* 区切り線の左側だけブランド色にする。最初に目に入る位置に色を置く */
        .profile::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: linear-gradient(90deg, #fb923c 0%, #f97316 40%, #e5e7eb 40%);
        }

        :global(html.dark) .profile::after {
          background: linear-gradient(90deg, #fb923c 0%, #f97316 40%, #374151 40%);
        }

        .profile :global(.user) {
          padding-left: 0;
          margin-bottom: 0;
          max-width: 100%;
          overflow: hidden;
        }

        .names .name {
          font-size: 3rem !important;
        }

        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .profile {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
})

Profile.displayName = 'Profile'

export default Profile
