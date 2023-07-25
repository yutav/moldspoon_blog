import React, { useState, useEffect } from 'react'
import { useTheme, User, Link } from '@geist-ui/core'
import NextLink from 'next/link'
import ProfileLinks from './profile-links'
import { Configs } from '../utils'

const Profile: React.FC<unknown> = React.memo(() => {
  const theme = useTheme()
  const [showText, setShowText] = useState(theme.type === 'dark')

  const avatarUrl = process.env.NODE_ENV == 'production' ? '/img/avatar.png' : '/assets/avatar.png'
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
            <User src={avatarUrl} name={Configs.author} altText="avatar">
              {Configs.summary}
            </User>
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
