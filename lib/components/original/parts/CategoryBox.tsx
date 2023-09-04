import Image from "next/image"
import Link from "next/link"
type Prop = {
  url: string
  imageUrl: string
  title: string
}

const CategoryBox: React.FC<Prop> = ({ url, imageUrl, title }) => {
  return <Link href={url} className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 shadow border w-12 h-12 md:w-40 md:h-40 rounded-xl">
    <Image src={imageUrl} width="200" height="240" alt="note" className="rounded-xl" />
    <div className="category-title text-center text-normal md:text-2xl text-black font-bold pt-0 h-8 mt-2">
      {title}
    </div>
  </Link>
}

export default CategoryBox