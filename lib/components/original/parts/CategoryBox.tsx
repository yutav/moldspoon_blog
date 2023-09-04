import Image from "next/image"
import Link from "next/link"
type Prop = {
  url: string
  imageUrl: string
  title: string
}

const CategoryBox: React.FC<Prop> = ({ url, imageUrl, title }) => {
  return (
    <Link href={url}
      className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 shadow border 
      w-16 h-16 
      md:w-32 md:h-32
      lg:w-40 lg:h-40 rounded-xl">
      <Image src={imageUrl} width="160" height="160" alt="note" className="rounded-xl" />
      <div className="category-title text-center text-sm md:text-2xl text-black dark:text-white font-bold pt-0 h-8 mt-2">
        {title}
      </div>
    </Link>
  )
}

export default CategoryBox