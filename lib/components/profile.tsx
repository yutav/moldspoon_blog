import React, { useState, useEffect } from 'react'
import { useTheme, Link } from '@geist-ui/core'
import NextLink from 'next/link'
// import ProfileLinks from './profile-links'
import { Configs } from '../utils'
import BLOG from '../../blog.config'
import Image from 'next/image'

const Profile: React.FC<unknown> = React.memo(() => {
  const theme = useTheme()
  const [showText, setShowText] = useState(theme.type === 'dark')
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  let logoUrl
  if (theme.type === 'dark') {
    logoUrl = process.env.NODE_ENV == 'production' ? "/blog/assets/moldspoonblog_short_white.png" : "/blog/assets/moldspoonblog_short_white.png"
  }
  else {
    logoUrl = process.env.NODE_ENV == 'production' ? "/blog/assets/moldspoonblog_short.png" : "/blog/assets/moldspoonblog_short.png"
  }
  useEffect(() => {
    const show = theme.type === 'dark'
    if (showText !== show) {
      setShowText(show)
    }
  }, [theme.type])

  return (
    <div className="profile">
      <div className="user">
        <div className="flex justify-between w-full">
          <div className="flex-none w-128">

            <NextLink href="/" passHref>
              <Link>
                <h1 className="w-56 sm:w-80 md:w-80 lg:w-full "><Image src={logoUrl} width="400" height="50" alt={BLOG.title} /></h1>
              </Link>
            </NextLink>
          </div>
          <div className='flex-none w-8'>
            <i className="ri-menu-line text-2xl md:text-3xl cursor-pointer" onClick={handleMenuOpen} ></i>
            <div
              className={
                openMenu
                  ? 'text-left fixed border-l-2 dark:bg-gray-900 bg-gray-700 text-white -right-8 top-0 py-4 px-8 h-screen flex flex-col justify-start -translate-x-8 transition ease-in-out'
                  : 'fixed right-[-100%]'
              }
            >
              <div className="flex justify-between">
                <div></div>

                <i className="ri-close-line text-2xl md:text-3xl cursor-pointer" onClick={handleMenuOpen} ></i>
              </div>
              <nav className="block">
                <p>
                  <Link href={process.env.domain} className="leading-relaxed hover:text-gray-500 transition">MoldSpoon Inc.企業ページ</Link>
                </p>
                <p>
                  <Link href={process.env.baseUrl + "/tags"} className="leading-relaxed">タグ一覧</Link>
                </p>
              </nav>
            </div>
          </div>
        </div>
        <div className={(theme.type === 'dark' ? "text-white" : "text-black") + " p-4 pt-8 text-xs md:text-sm"} dangerouslySetInnerHTML={{ __html: Configs.summary }} />
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
