import Link from "next/link"

const OL = ({ children, href }: { children: React.ReactNode, href: string }) => {
  return (
    <Link href={href} target="_blank">
      {children}
    </Link>
  )
}

export default OL