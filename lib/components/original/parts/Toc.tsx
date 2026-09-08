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
  // 既定は折り畳み。開いた状態を初期値にするとサーバーとクライアントで
  // 描画が食い違うので、判定は必ずマウント後に行う
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const showNumberString = false // trueにすると、章立ての番号が表示される
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, "text/html");

    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    // このstackで階層構造を管理する。
    const stack: any[] = [];
    let tocData: TocData = {};

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1), 10);
      const text = heading.textContent || "";

      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      let parent = tocData;

      stack.forEach(item => {
        parent = parent[item.text];
      });

      parent[text] = {};

      stack.push({ text: text, level: level });
    });

    setTocObject(tocData);
  }, [body]);

  const renderToc = (
    data: { [key: string]: any },
    parentNumbers: number[] = []
  ) => {
    return (
      <ul className="toc-list px-0 mx-3 my-2 list-none">
        {Object.keys(data).map((key, index) => {
          const currentNumbers = [...parentNumbers, index + 1];
          const numberString = currentNumbers.join("-");

          return (
            <li key={key} className="p-0 m-0 text-xs">
              <Link href={`#${key.replace(/\s+/g, "-").toLowerCase()}`} className="text-black dark:text-white font-normal">
                {showNumberString && numberString + ". "}{key}
              </Link>
              {renderToc(data[key], currentNumbers)}
            </li>
          )
        })}
      </ul>
    );
  };

  // 折り畳んだ高さに収まりきらないときだけ「すべて表示」を出す。
  // 見出しが3〜4個の記事にまでボタンを出しても邪魔なだけなので、
  // 実際の高さを測って判断する
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    setTruncated(el.scrollHeight > el.clientHeight + 4);
  }, [tocObject]);

  // 以前は画面に position: fixed で貼り付けていたため、幅が足りない画面では
  // 右端で切れたり本文に迫ったりしていた。サイドバーの中の箱として置く。
  return (
    <div className="toc mb-4">
      <div className="toc-box p-2 rounded-xl break-words">
        <div className="rounded-xl bg-white dark:bg-black px-4 py-3">
          <p className="pt-0 font-bold">< i className="ri-list-unordered mr-1"></i>目次</p>
          <div className={"toc-body" + (expanded ? " is-expanded" : "")} ref={listRef}>
            {renderToc(tocObject)}
          </div>
          {truncated && (
            <button type="button" className="toc-toggle" onClick={() => setExpanded(v => !v)}>
              {expanded ? "目次を閉じる" : "すべて表示"}
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .toc-box {
          background: linear-gradient(0deg, rgb(195,34,175,1) 0%, rgba(253,187,45,1) 100%)
        }
        /* 既定は最初の数行だけ見せる。記事81本の見出し数は中央値11・最大36で、
           全部出すと中央値でも検索ボックスが900px高の画面から押し出される。
           開いたときは高さを制限しない（スクロール領域は作らない方針）。
           見出しが多い記事では末尾が sticky の外に出るが、それは許容する。 */
        .toc-body {
          max-height: 8.5rem;
          overflow: hidden;
          position: relative;
        }

        .toc-body.is-expanded {
          max-height: none;
          overflow: visible;
        }

        /* 続きがあることを示す。下端で文字がぶつ切りに見えるのを防ぐ */
        .toc-body:not(.is-expanded)::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2rem;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
          pointer-events: none;
        }

        :global(html.dark) .toc-body:not(.is-expanded)::after {
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000);
        }

        .toc-toggle {
          display: block;
          margin: 0.5rem 0 0 auto;
          padding: 0;
          font-size: 0.7rem;
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
        }

        .toc-toggle:hover {
          text-decoration: underline;
        }

        :global(html.dark) .toc-toggle {
          color: #9ca3af;
        }
        .toc-list li {
          padding: 0px;
        }
      `}</style>
    </div>
  );
};

export default Toc;
