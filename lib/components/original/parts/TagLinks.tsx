import { getTagColor } from 'lib/utils';
import Link from 'next/link';

type Prop = {
  tags: Array<string>;
};

// 同じサイト内のタグページなので target="_blank" は付けない（元は新規タブが開いていた）
const TagLinks: React.FC<Prop> = ({ tags }) => {

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {tags.map((tag, index) => {
        const encodedTag = encodeURI(tag)
        return (
          <Link href={`/tags/${encodedTag}`} key={index}>
            <span className={getTagColor(tag) + " inline-block text-xs md:text-sm px-3 py-1 rounded-2xl hover:opacity-80 transition-opacity"}>
              {tag}
            </span>
          </Link>
        )
      })}
    </div>
  );
};

export default TagLinks;
