import { getTagColor } from 'lib/utils';
import Link from 'next/link';

type Prop = {
  tags: Array<string>;
};

const TagLinks: React.FC<Prop> = ({ tags }) => {


  return (
    <div className="flex flex-wrap mb-10">
      {tags.map((tag, index) => {
        const encodedTag = encodeURI(tag)
        return (
          <Link href={`/tags/${encodedTag}`} target="_blank" className="mr-2 mb-2" key={index}>
            <span className={getTagColor(tag) + " text-xs md:text-base px-4 py-1 rounded-xl text-center"}>
              {tag}
            </span>
          </Link>
        )
      })}
    </div>
  );
};

export default TagLinks;
