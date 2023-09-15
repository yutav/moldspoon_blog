import { Configs } from "lib/utils";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Prop = {
  body: string
};

// 入れ子の目次オブジェクトを型定義する
type TocData = {
  [key: string]: TocData
};

const Toc: React.FC<Prop> = ({ body }) => {
  const [tocObject, setTocObject] = useState<{ [key: string]: any }>({});

  const showNumberString = false // trueにすると、章立ての番号が表示される

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, "text/html");

    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const stack: (string | number)[] = [];
    let tocData: TocData = {};

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1), 10);
      const text = heading.textContent || "";

      while (stack.length >= level) {
        stack.pop();
      }

      let parent = tocData;
      for (let i = 1; i < stack.length; i++) {
        parent = parent[stack[i]];
      }

      parent[text] = {};

      stack.push(text);

    });

    setTocObject(tocData);
  }, [body]);

  const renderToc = (
    data: { [key: string]: any },
    parentNumbers: number[] = []
  ) => {
    return (
      <ul className="toc-list p-0 mx-3 my-2 list-none">
        {Object.keys(data).map((key, index) => {
          const currentNumbers = [...parentNumbers, index + 1];
          const numberString = currentNumbers.join("-");

          return (
            <li key={key} className="p-0 m-0 text-xs">
              <Link href={`#${key.replace(/\s+/g, "-").toLowerCase()}`} className="text-black dark:text-white">
                {showNumberString && numberString + ". "}{key}
              </Link>
              {renderToc(data[key], currentNumbers)}
            </li>
          )
        })}
      </ul>
    );
  };

  return (
    <div className={`toc xl:fixed xl:pl-8 xl:top-16 hidden xl:block `}>
      <div className="toc-box p-2 rounded-xl break-words">
        <div className="rounded-xl shadow-2xl bg-white dark:bg-black px-4 py-2">
          <p className="pt-0 font-bold">目次</p>
          {renderToc(tocObject)}
        </div>
      </div>
      <style jsx>{`
        .toc-box {
          background: linear-gradient(0deg, rgb(195,34,175,1) 0%, rgba(253,187,45,1) 100%)
        }
        .toc {
          margin-left: ${Configs.layouts.pageWidth};
        }
        .toc-list li {
          padding: 0px;
        }
      `}</style>
    </div>
  );
};

export default Toc;
