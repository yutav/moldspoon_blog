import CategoryBox from './CategoryBox'

// トップ（/blog）と /blog/top の2ページで同じものを出しているので、
// 片方だけ直してしまわないよう1箇所にまとめている。
const CATEGORIES = [
  { url: '/tags/Tips', image: '/assets/f_f_business_48_svg_f_business_48_0bg.svg', title: 'Tips' },
  { url: '/tags/Blog', image: '/assets/f_f_business_41_svg_f_business_41_1bg.svg', title: 'Blog' },
  { url: '/tags/%E5%88%9D%E7%B4%9A%E8%80%85%E5%90%91%E3%81%91', image: '/assets/f_f_event_98_s512_f_event_98_2bg.png', title: '初級者向け' },
  { url: '/tags/%E7%B5%8C%E9%A8%93%E8%80%85%E5%90%91%E3%81%91', image: '/assets/f_f_object_151_svg_f_object_151_1bg.svg', title: '経験者向け' },
]

const CategoryBoxes: React.FC<unknown> = () => {
  return (
    // container が広い画面で伸びるので、こちらは上限を決めておかないと
    // 4つの箱が横に散らばって間延びする
    <div className="mt-2 md:mt-6 mb-8 md:mb-12 px-0 py-4 w-full max-w-3xl mx-auto
      grid grid-cols-4 gap-x-2 md:gap-x-6 lg:gap-x-12 gap-y-6 justify-items-center">
      {CATEGORIES.map(category => (
        <CategoryBox
          key={category.title}
          url={category.url}
          imageUrl={process.env.baseUrl + category.image}
          title={category.title}
        />
      ))}
    </div>
  )
}

export default CategoryBoxes
