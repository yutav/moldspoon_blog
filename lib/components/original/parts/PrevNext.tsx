import Link from "next/link";
import metadata from 'lib/data/metadata.json'

type Prop = {
  routerPathName: string
}

// 高さを h-16 / h-32 で固定していたため、長いタイトルが枠からはみ出していた。
// 高さは min-height に留めて、行数は2行でクランプする。
const cardClass = "flex flex-col justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 " +
  "min-h-[5rem] md:min-h-[7rem] !text-black dark:!text-white !font-normal text-xs md:text-sm " +
  "hover:border-orange-300 hover:shadow-md transition duration-200 block"

const PrevNext: React.FC<Prop> = ({ routerPathName }) => {
  return (
    <div className="w-full">
      {metadata.map((subs, _) => {
        if (subs.name !== 'posts') {
          return null
        }
        if (subs.children == undefined) {
          return null
        }

        return subs.children.map((item, index) => {
          if (item.url === routerPathName) {
            const nextPost = index > 0 ? subs.children[index - 1] : null;
            const prevPost = index < subs.children.length - 1 ? subs.children[index + 1] : null;

            return (
              <div className="py-5 w-full grid grid-cols-1 md:grid-cols-2 gap-4" key={item.url}>
                {prevPost && (
                  <Link href={prevPost.url} passHref className={cardClass}>
                    <p className="font-bold my-0 mb-2 text-gray-600 dark:text-gray-300 text-xs">
                      <i className="ri-arrow-left-circle-fill text-green-700 text-base"></i>&nbsp;
                      前の記事
                    </p>
                    <span className="prevnext-title">{prevPost.name}</span>
                  </Link>
                )}
                {nextPost && (
                  <Link href={nextPost.url} passHref
                    className={cardClass + " text-right" + (prevPost ? "" : " md:col-start-2")}>
                    <p className="font-bold my-0 mb-2 text-gray-600 dark:text-gray-300 text-xs">
                      次の記事
                      &nbsp;
                      <i className="ri-arrow-right-circle-fill text-green-700 text-base"></i>
                    </p>
                    <span className="prevnext-title">{nextPost.name}</span>
                  </Link>
                )}
              </div>
            );
          }
          return null;
        });
      })}
      <style jsx global>{`
        .prevnext-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}

export default PrevNext
