import React, { useState } from 'react'
import { useTheme, Link } from '@geist-ui/core'
import NextLink from 'next/link'
// import ProfileLinks from './profile-links'
import { Configs } from '../utils'
import BLOG from '../../blog.config'
import Image from 'next/image'

const Profile: React.FC<unknown> = React.memo(() => {
  const theme = useTheme()
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  let darkLogoUrl = process.env.NODE_ENV == 'production' ? "/blog/assets/moldspoonblog_short_white.png" : "/blog/assets/moldspoonblog_short_white.png"
  let logoUrl = process.env.NODE_ENV == 'production' ? "/blog/assets/moldspoonblog_short.png" : "/blog/assets/moldspoonblog_short.png"
  const linkClass = "leading-relaxed"
  const linkTextClass = "text-white hover:text-gray-300 dark:text-white dark:hover:text-gray-500"
  return (
    <div className="profile">
      <div className="user">
        <div className="flex justify-between w-full">
          <div className="flex-none w-128">

            <NextLink href="/" passHref>
              <Link>
                <h1 className="w-56 sm:w-80 md:w-80 lg:w-full ">
                  <Image src={logoUrl} width="400" height="50" alt={BLOG.title} className="block dark:hidden" />
                  <Image src={darkLogoUrl} width="400" height="50" alt={BLOG.title} className="hidden dark:block" />
                </h1>
              </Link>
            </NextLink>
          </div>
          <div className='flex-none w-8'>
            <i className="ri-menu-line text-2xl md:text-3xl cursor-pointer" onClick={handleMenuOpen} ></i>
            <div
              className={
                openMenu
                  ? 'text-left fixed border-l-2 dark:bg-gray-900 bg-gray-700 -right-8 top-0 py-4 px-8 h-screen flex flex-col justify-start -translate-x-8 transition ease-in-out'
                  : 'fixed right-[-100%]'
              }
            >
              <div className="flex justify-between">
                <div></div>
                <i className="ri-close-line text-2xl md:text-3xl cursor-pointer text-white dark:text-white" onClick={handleMenuOpen} ></i>
              </div>
              <nav className="block">
                <p>
                  <Link href={process.env.domain} className={linkClass}><span className={linkTextClass}>
                    <i className="ri-building-line text-white"></i>&nbsp;
                    MoldSpoon Inc.企業ページ</span></Link>
                </p>
                <p>
                  <Link href={process.env.baseUrl + "/tags"} className={
                    linkClass
                  }><span className={linkTextClass}>
                      <i className="ri-price-tag-3-line text-white"></i>&nbsp;
                      タグ一覧</span></Link>
                </p>
                <p>
                  <Link href={process.env.baseUrl + "/about"} className={
                    linkClass
                  }><span className={linkTextClass}>
                      <i className="ri-information-line text-white"></i>&nbsp;
                      このブログについて</span></Link>
                </p>
              </nav>
            </div>
          </div>
        </div>
        <div className={"font-bold text-gray-500 dark:text-white pt-8 text-xs md:text-sm"} dangerouslySetInnerHTML={{ __html: Configs.summary }} />
      </div>
      {/*<ProfileLinks />*/}
      <style jsx>{`
       
        .profile {
          padding: ${theme.layout.gap} 0 0 0;
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
            padding-top: 2rem;
          }
        }
      `}</style>
    </div>
  )
})

export default Profile
