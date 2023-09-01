import Link from "next/link";
import metadata from 'lib/data/metadata.json'

type Prop = {
  routerPathName: string
}

const PrevNext: React.FC<Prop> = ({ routerPathName }) => {
  return (
    <div className="w-full">
      {metadata.map((subs, _) => {
        if (subs.name !== 'posts') {
          return null;
        }
        return subs.children.map((item, index) => {
          if (item.url === routerPathName) {
            const nextPost = index > 0 ? subs.children[index - 1] : null;
            const prevPost = index < subs.children.length - 1 ? subs.children[index + 1] : null;

            return (
              <div className="py-5 w-full grid grid-cols-2 gap-4 justify-between">
                {prevPost && (

                  <Link href={prevPost.url} passHref className="border rounded-lg px-4 h-32 text-black block">
                    <p className="font-bold">
                      <i className="ri-arrow-left-circle-fill text-green-700 text-lg"></i>&nbsp;
                      前の記事
                    </p>
                    {prevPost.name}
                  </Link>
                )}
                {nextPost && (
                  <Link href={nextPost.url} passHref className="border rounded-lg px-4 h-32 text-black text-right block">
                    <p className="font-bold">
                      次の記事
                      &nbsp;
                      <i className="ri-arrow-right-circle-fill text-green-700 text-lg"></i>
                    </p>
                    {nextPost.name}
                  </Link>
                )}
              </div>
            );
          }
          return null;
        });
      })}
    </div>
  )
}

export default PrevNext