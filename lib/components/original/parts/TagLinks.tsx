import Link from 'next/link';

type Prop = {
  tags: Array<string>;
};

const TagLinks: React.FC<Prop> = ({ tags }) => {
  return (
    <div className="flex">
      {tags.map((tag, index) => {
        const encodedTag = encodeURI(tag)
        return (
          <div className="px-2 mr-2 mb-10 border rounded-lg border-orange-100 text-center" key={index}>
            <Link href={`/tags/${encodedTag}`} target="_blank">
              <span className="text-orange-500 hover:text-orange-300" >
                {tag}
              </span>
            </Link>
          </div>
        )
      })}
    </div>
  );
};

export default TagLinks;
