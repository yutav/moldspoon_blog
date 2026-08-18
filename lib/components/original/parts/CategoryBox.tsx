import Image from "next/image"
import Link from "next/link"
type Prop = {
  url: string
  imageUrl: string
  title: string
}

// 以前は Link 自身に w-16/h-16 を当てつつ中に 176px の画像を置いていたため、
// 枠と中身のサイズが噛み合っていなかった。枠は div で持ち、画像は枠に合わせる。
const CategoryBox: React.FC<Prop> = ({ url, imageUrl, title }) => {
  return (
    <Link href={url} className="group flex flex-col items-center w-full no-underline">
      <div className="flex items-center justify-center bg-white dark:bg-gray-900
        w-20 h-20 md:w-32 md:h-32 lg:w-36 lg:h-36
        rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm
        transition ease-in-out duration-300
        group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-orange-300">
        <Image src={imageUrl} width="176" height="176" alt={title}
          className="w-full h-full object-contain p-2 md:p-3 rounded-xl" />
      </div>
      <div className="category-title text-center text-xs md:text-lg lg:text-xl
        text-black dark:text-white font-bold mt-2
        transition-colors duration-300 group-hover:text-orange-500">
        {title}
      </div>
    </Link>
  )
}

export default CategoryBox
