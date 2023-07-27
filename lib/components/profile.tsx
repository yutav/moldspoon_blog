import React, { useState, useEffect } from 'react'
import { useTheme, Link } from '@geist-ui/core'
import NextLink from 'next/link'
import ProfileLinks from './profile-links'
import { Configs } from '../utils'
import BLOG from '../../blog.config'
import Image from 'next/image'

const Profile: React.FC<unknown> = React.memo(() => {
  const theme = useTheme()
  const [showText, setShowText] = useState(theme.type === 'dark')

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
        <NextLink href="/" passHref>
          <Link>
            <div className="">
              <h1><Image src={logoUrl} width="400" height="50" alt={BLOG.title} /></h1>
              <div className="text-gray-500 text-xs" dangerouslySetInnerHTML={{ __html: Configs.summary }} />
            </div>
          </Link>
        </NextLink>
      </div>
      <ProfileLinks />
      <style jsx>{`
       
        .profile {
          padding: ${theme.layout.gap} 0;
        }

        .profile :global(.user) {
          padding-left: 0;
          margin-bottom: ${theme.layout.gapQuarter};
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
            padding-top: 5rem;
          }
        }
      `}</style>
    </div>
  )
})

export default Profile
