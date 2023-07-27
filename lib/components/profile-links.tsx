import React from 'react'
import NextLink from 'next/link'
import { useTheme, Link } from '@geist-ui/core'
import { Configs } from '../utils'

const fillSpace = (name: string): string => {
  return name.replace(/ /g, '-')
}

export type ProfileLinkItem = {
  url: string
  name: string
}

const makeLink = (data: ProfileLinkItem): React.ReactNode => {
  return (
    <NextLink href={data.url} key={data.url} passHref>
      <Link>{fillSpace(data.name)}</Link>
    </NextLink>
  )
}

const ProfileLinks: React.FC<unknown> = () => {
  const theme = useTheme()
  {/*const links = useMemo(() => getFixes(metadata), [])*/ }
  return (
    <div className="link">
      {makeLink({ url: 'https://moldspoon.jp/', name: Configs.labels.default })}
      {makeLink({ url: '/tags', name: Configs.labels.tags })}
      {/*links.map(link => makeLink(link)) */}

      <style jsx>{`
        .link :global(a) {
          font-size: 0.8rem;
          padding: ${theme.layout.gapQuarter};
          text-decoration: underline;
          color: rgb(107 114 128);
        }

        .link :global(a:hover) {
          color: ${theme.palette.accents_4};
        }

        .link :global(a:last-of-type) {
          margin-right: 0;
        }
      `}</style>
    </div>
  )
}

export default ProfileLinks
