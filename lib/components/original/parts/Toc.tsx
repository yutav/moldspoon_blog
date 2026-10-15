import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import css from "styled-jsx/css";

/**
 * 記事の目次。
 *
 * 以前は Layout が renderToString した本文 HTML を受け取り、DOMParser で見出しを
 * 拾っていた。見出しの id は mdx-components.tsx が付けたものと別に組み立てていたので
 * 両者がずれる余地があり、またスクロール追従のためには結局 DOM 上の要素が要る。
 * いまはマウント後に `.detail-body` の見出し要素を直接読む。
 *
 * 見た目と挙動は iret.media の記事サイドバーに倣った。
 * - 縦線の上にドットが並び、読んでいる位置のドットだけ塗りつぶされた丸（thumb）が
 *   滑って移動する
 * - 読んでいる項目が目次の枡の外に出たら、ページは動かさず目次だけスクロールして
 *   見える位置に戻す。ただし目次を自分で触った直後 1.2 秒は上書きしない
 * - 1280px 未満（サイドバーが消える幅）では右下の「目次」ボタンから同じ目次を
 *   パネルで開く。記事本文に入るまではボタンを出さない
 *
 * 見出しレベルは記事ごとにばらつく（# から始める記事と ### から始める記事がある）ので、
 * 絶対的なレベルではなく「その記事の中での相対的な深さ」で入れ子にする。
 */

type Heading = {
  id: string;
  text: string;
  depth: number;
  el: HTMLElement;
};

type Node = Heading & { children: Node[] };

type Variant = "sidebar" | "mobile";

type Prop = {
  variant?: Variant;
};

const SCROLL_OFFSET = 100; // 見出しがこの位置（px）を越えたら「読んでいる」と判定する
const CLICK_OFFSET = 16; // クリックで飛んだときに見出しの上に残す余白
const USER_INTERACT_GRACE = 1200; // 目次を触った後、自動スクロールを止める時間
const CHARS_PER_MINUTE = 500; // 日本語の読了時間の目安

const headingSelector = ".detail-body h1, .detail-body h2, .detail-body h3, .detail-body h4, .detail-body h5, .detail-body h6";

const collectHeadings = (): Heading[] => {
  const els = Array.from(document.querySelectorAll<HTMLElement>(headingSelector));
  const stack: Array<{ level: number; depth: number }> = [];
  const result: Heading[] = [];

  els.forEach((el) => {
    const text = (el.textContent || "").trim();
    if (!el.id || !text) return;

    const level = parseInt(el.tagName.charAt(1), 10);
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    const depth = stack.length;
    stack.push({ level, depth });
    result.push({ id: el.id, text, depth, el });
  });

  return result;
};

const buildTree = (headings: Heading[]): Node[] => {
  const root: Node[] = [];
  const parents: Node[] = [];

  headings.forEach((h) => {
    const node: Node = { ...h, children: [] };
    while (parents.length > h.depth) parents.pop();
    if (parents.length === 0) {
      root.push(node);
    } else {
      parents[parents.length - 1].children.push(node);
    }
    parents.push(node);
  });

  return root;
};

const estimateReadingMinutes = (): number => {
  const body = document.querySelector(".detail-body");
  if (!body) return 0;
  const length = (body.textContent || "").replace(/\s+/g, "").length;
  return Math.max(1, Math.round(length / CHARS_PER_MINUTE));
};

/**
 * 見出し一覧と、いま読んでいる見出しの id。
 * ページ遷移で本文が入れ替わるので asPath が変わるたびに拾い直す。
 */
const useTocState = () => {
  const router = useRouter();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [minutes, setMinutes] = useState(0);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    setHeadings(collectHeadings());
    setMinutes(estimateReadingMinutes());
  }, [router.asPath]);

  useEffect(() => {
    if (!headings.length) {
      setActiveId("");
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      let current = headings[0].id;
      for (const h of headings) {
        const top = h.el.getBoundingClientRect().top + scrollY - SCROLL_OFFSET;
        if (scrollY >= top) {
          current = h.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };
    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    request();

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [headings]);

  return { headings, minutes, activeId, setActiveId };
};

const scrollToHeading = (el: HTMLElement) => {
  const top = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - CLICK_OFFSET);
  window.scrollTo({ top, behavior: "smooth" });
};

type ListProps = {
  nodes: Node[];
  activeId: string;
  onSelect: (h: Heading) => void;
  isRoot?: boolean;
};

const TocList: React.FC<ListProps> = ({ nodes, activeId, onSelect, isRoot }) => (
  <ol className={"toc-list" + (isRoot ? " toc-list--root" : " toc-list--sub")}>
    {nodes.map((node) => {
      const isActive = node.id === activeId;
      return (
        <li
          key={node.id + node.text}
          className={"toc-item" + (node.depth === 0 ? " toc-item--top" : " toc-item--sub")}
          style={{ "--toc-depth": node.depth } as React.CSSProperties}
        >
          <a
            href={"#" + node.id}
            className={"toc-link" + (isActive ? " is-active" : "")}
            aria-current={isActive ? "location" : undefined}
            data-toc-id={node.id}
            onClick={(e) => {
              e.preventDefault();
              onSelect(node);
            }}
          >
            <span className="toc-dot-wrap" aria-hidden="true">
              <span className="toc-dot"></span>
            </span>
            <span className="toc-text">{node.text}</span>
          </a>
          {node.children.length > 0 && (
            <TocList nodes={node.children} activeId={activeId} onSelect={onSelect} />
          )}
        </li>
      );
    })}
  </ol>
);

type NavProps = {
  headings: Heading[];
  activeId: string;
  onSelect: (h: Heading) => void;
  /** true のとき、読んでいる項目が枡の外に出たら目次側をスクロールして追う */
  followActive: boolean;
  /** 表示中かどうか。display:none の間は位置を測れないので、見えた時点で置き直す */
  visible: boolean;
  /** true のとき、画面の残り高さ（下に続くサイドバーの箱の分を引いた高さ）に枡を収める */
  fitViewport?: boolean;
  className?: string;
};

/**
 * 目次本体。thumb（塗りつぶしの丸）の位置と、目次自身のスクロールを面倒みる。
 */
const TocNav: React.FC<NavProps> = ({ headings, activeId, onSelect, followActive, visible, fitViewport, className = "" }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const userInteractUntil = useRef(0);
  const programmaticScroll = useRef(false);
  const prevActive = useRef("");

  const tree = buildTree(headings);

  const markUserInteraction = useCallback(() => {
    userInteractUntil.current = Date.now() + USER_INTERACT_GRACE;
  }, []);

  const place = useCallback((snap: boolean) => {
    const nav = navRef.current;
    const thumb = thumbRef.current;
    if (!nav || !thumb) return;

    const link = activeId
      ? Array.from(nav.querySelectorAll<HTMLAnchorElement>(".toc-link")).find((a) => a.dataset.tocId === activeId)
      : undefined;
    const wrap = link ? link.querySelector<HTMLElement>(".toc-dot-wrap") : null;

    if (!link || !wrap || !wrap.offsetWidth) {
      thumb.style.opacity = "0";
      return;
    }

    const isSub = link.closest(".toc-item--sub") !== null;
    const size = isSub ? 6 : 8;
    const navRect = nav.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();

    thumb.style.width = size + "px";
    thumb.style.height = size + "px";
    thumb.style.top = wrapRect.top - navRect.top + nav.scrollTop + (wrapRect.height - size) / 2 + "px";
    thumb.style.left = wrapRect.left - navRect.left + nav.scrollLeft + (wrapRect.width - size) / 2 + "px";
    thumb.style.opacity = "1";

    if (snap) {
      thumb.classList.remove("is-snap");
      void thumb.offsetWidth; // クラスを付け直してアニメーションをやり直す
      thumb.classList.add("is-snap");
    }

    // 読んでいる項目が枡の外なら、目次だけをスクロールして見える位置へ
    if (!followActive) return;
    if (nav.scrollHeight <= nav.clientHeight + 1) return;
    if (Date.now() < userInteractUntil.current) return;

    const linkRect = link.getBoundingClientRect();
    const margin = 20;
    let delta = 0;
    if (linkRect.top < navRect.top + margin) {
      delta = linkRect.top - navRect.top - margin;
    } else if (linkRect.bottom > navRect.bottom - margin) {
      delta = linkRect.bottom - navRect.bottom + margin;
    }
    if (!delta) return;

    programmaticScroll.current = true;
    nav.scrollTop += delta;
    programmaticScroll.current = false;
  }, [activeId, followActive]);

  useEffect(() => {
    if (!visible) return;
    const changed = activeId !== prevActive.current;
    prevActive.current = activeId;
    place(changed);
  }, [activeId, place, visible]);

  // フォント読み込みや折り返しの変化で位置がずれるので、枡の大きさが変わったら置き直す
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onResize = () => place(false);
    window.addEventListener("resize", onResize, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    observer?.observe(nav);
    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [place]);

  // サイドバーでは枡の高さを画面に合わせる。広告が最上部にあり、目次の下に検索が
  // 続くので、目次が伸び放題だと検索ボックスが sticky の外へ押し出される。
  // 目次の下に続く箱の高さを引いた残りに収め、低い画面でも潰れきらないよう 120px を下限にする
  useEffect(() => {
    const nav = navRef.current;
    if (!fitViewport || !nav) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const block = nav.closest(".toc--sidebar");
      const sidebar = block ? block.closest(".sidebar-inner") : null;
      let reserve = 16; // 画面下端との余白
      if (block && sidebar) {
        let after = false;
        Array.from(sidebar.children).forEach((child) => {
          if (child === block) {
            after = true;
            return;
          }
          if (after) reserve += child.getBoundingClientRect().height + 16;
        });
      }
      const available = Math.floor(window.innerHeight - nav.getBoundingClientRect().top - 20 - reserve);
      nav.style.maxHeight = Math.max(120, available) + "px";
    };
    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    request();
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      nav.style.maxHeight = "";
    };
  }, [fitViewport]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      if (!programmaticScroll.current) markUserInteraction();
    };
    nav.addEventListener("wheel", markUserInteraction, { passive: true });
    nav.addEventListener("touchstart", markUserInteraction, { passive: true });
    nav.addEventListener("pointerdown", markUserInteraction);
    nav.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      nav.removeEventListener("wheel", markUserInteraction);
      nav.removeEventListener("touchstart", markUserInteraction);
      nav.removeEventListener("pointerdown", markUserInteraction);
      nav.removeEventListener("scroll", onScroll);
    };
  }, [markUserInteraction]);

  return (
    <div className={"toc-nav " + className} ref={navRef}>
      <span className="toc-thumb" ref={thumbRef} aria-hidden="true"></span>
      <TocList nodes={tree} activeId={activeId} onSelect={onSelect} isRoot />
    </div>
  );
};

const ReadingTime: React.FC<{ minutes: number; className?: string }> = ({ minutes, className = "" }) =>
  minutes > 0 ? (
    <span className={"toc-time " + className}>
      <i className="ri-time-line" aria-hidden="true"></i>約{minutes}分
    </span>
  ) : null;

const Toc: React.FC<Prop> = ({ variant = "sidebar" }) => {
  const { headings, minutes, activeId, setActiveId } = useTocState();
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const mobileRef = useRef<HTMLElement>(null);

  const select = useCallback(
    (h: Heading) => {
      setActiveId(h.id);
      scrollToHeading(h.el);
      // ハッシュを残して共有できる URL にする。履歴は増やさない
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + h.id);
      }
      if (variant === "mobile") setOpen(false);
    },
    [setActiveId, variant]
  );

  // スマホ: 本文に入るまでボタンを出さない。本文を抜けて先頭に戻ったら閉じる
  useEffect(() => {
    if (variant !== "mobile") return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const body = document.querySelector(".detail-body");
      const show = body ? body.getBoundingClientRect().top < 0 : false;
      setRevealed(show);
      if (!show) setOpen(false);
    };
    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    request();
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [variant]);

  // スマホ: パネルの外を押す・Esc で閉じる
  useEffect(() => {
    if (variant !== "mobile" || !open) return;
    const onClick = (e: MouseEvent) => {
      if (mobileRef.current && e.target instanceof Node && !mobileRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [variant, open]);

  if (!headings.length) return null;

  if (variant === "mobile") {
    return (
      <nav
        ref={mobileRef}
        className={"toc toc--mobile" + (revealed ? " is-revealed" : "") + (open ? " is-open" : "")}
        aria-label="目次"
      >
        <button
          type="button"
          className="toc-toggle"
          aria-expanded={open}
          aria-controls="toc-mobile-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <i className={open ? "ri-close-line" : "ri-list-unordered"} aria-hidden="true"></i>
          <span>目次</span>
        </button>
        <div className="toc-panel" id="toc-mobile-panel" hidden={!open}>
          <div className="toc-panel-meta">
            <a
              href="#"
              className="toc-top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setOpen(false);
              }}
            >
              <i className="ri-arrow-up-s-line" aria-hidden="true"></i>ページ先頭へ
            </a>
            <ReadingTime minutes={minutes} />
          </div>
          <TocNav headings={headings} activeId={activeId} onSelect={select} followActive={false} visible={open} className="toc-nav--panel" />
        </div>
        <style jsx>{tocStyle}</style>
      </nav>
    );
  }

  return (
    <nav className="toc toc--sidebar mb-4" aria-label="目次">
      <p className="toc-title">
        <i className="ri-list-unordered" aria-hidden="true"></i>
        <span>目次</span>
        <ReadingTime minutes={minutes} className="ml-1" />
      </p>
      <TocNav headings={headings} activeId={activeId} onSelect={select} followActive visible fitViewport />
      <style jsx>{tocStyle}</style>
    </nav>
  );
};

/*
 * 色は本文の見出し装飾（h3 の下線 #FFA500）に合わせてオレンジ系。
 * ドットの背景は枡の背景と同色にして、縦線を隠す。
 * CSS Modules ではないので `:global(.dark)` で next-themes の html.dark に当てる。
 *
 * サイドバー用とスマホ用の 2 か所から同じスタイルを使うので外に出している。
 * ただの文字列を <style jsx> に渡すと styled-jsx がコンパイル時にスコープ付けできず、
 * `:global()` がそのまま CSS に残って無効なセレクタとして丸ごと捨てられる
 * （ダークモードで白い枡に白い文字が出た）。css タグで書くこと。
 */
const tocStyle = css`
  .toc {
    --toc-bg: #ffffff;
    --toc-border: #e5e7eb;
    --toc-line: #fcd9a0;
    --toc-accent: #f59e0b;
    --toc-text: #546e7a;
    --toc-text-sub: #78909c;
    --toc-text-active: #111827;
    --toc-active-bg: #fff4e0;
    --toc-muted: #6b7280;
    color: var(--toc-text);
  }
  :global(.dark) .toc {
    --toc-bg: #000000;
    --toc-border: #374151;
    --toc-line: #92400e;
    --toc-accent: #f59e0b;
    --toc-text: #cbd5e1;
    --toc-text-sub: #94a3b8;
    --toc-text-active: #f8fafc;
    --toc-active-bg: rgba(245, 158, 11, 0.16);
    --toc-muted: #94a3b8;
  }

  .toc--sidebar {
    box-sizing: border-box;
    padding: 18px 16px 20px;
    background: var(--toc-bg);
    border: 1px solid var(--toc-border);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .toc-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 14px;
    font-weight: 700;
    font-size: 16px;
    line-height: 1.4;
    color: var(--toc-text-active);
  }
  .toc-title i {
    color: var(--toc-accent);
    font-size: 20px;
    line-height: 1;
  }

  .toc :global(.toc-time) {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-weight: 500;
    font-size: 12px;
    line-height: 1;
    color: var(--toc-muted);
    white-space: nowrap;
  }
  .toc :global(.toc-time i) {
    font-size: 13px;
    color: var(--toc-muted);
  }

  /* ---- 目次本体 ---- */
  .toc :global(.toc-nav) {
    position: relative;
    max-height: 45vh; /* JS が画面の残り高さで上書きする。これはその前の仮の値 */
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    overflow-anchor: none;
    margin-right: -8px;
    padding-right: 8px;
    scrollbar-width: thin;
    scrollbar-color: #b0bec5 transparent;
  }
  .toc :global(.toc-nav::-webkit-scrollbar) {
    width: 6px;
  }
  .toc :global(.toc-nav::-webkit-scrollbar-thumb) {
    background: #b0bec5;
    border-radius: 3px;
  }
  :global(.dark) .toc :global(.toc-nav) {
    scrollbar-color: #475569 transparent;
  }
  :global(.dark) .toc :global(.toc-nav::-webkit-scrollbar-thumb) {
    background: #475569;
  }

  .toc :global(.toc-list) {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .toc :global(.toc-list--root) {
    position: relative;
    padding-left: 32px;
  }
  /* ドットを貫く縦線 */
  .toc :global(.toc-list--root::before) {
    content: "";
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 6px;
    width: 1px;
    background: var(--toc-line);
    pointer-events: none;
  }
  .toc :global(.toc-list--sub) {
    margin: 6px 0 0;
    padding: 0 0 2px 12px;
  }

  .toc :global(.toc-item) {
    position: relative;
    margin: 0;
    padding: 0;
    border: 0;
  }
  .toc :global(.toc-item--top + .toc-item--top) {
    margin-top: 14px;
  }
  .toc :global(.toc-item--sub + .toc-item--sub) {
    margin-top: 3px;
  }

  .toc :global(.toc-link) {
    position: relative;
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    width: fit-content;
    max-width: 100%;
    margin-left: -8px;
    padding: 4px 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.55;
    color: var(--toc-text);
    text-decoration: none;
    border-radius: 6px;
    transition: color 0.2s ease, background-color 0.2s ease;
  }
  .toc :global(.toc-item--sub .toc-link) {
    padding-top: 3px;
    padding-bottom: 3px;
    font-size: 13px;
    color: var(--toc-text-sub);
  }
  .toc :global(.toc-link:hover) {
    color: var(--toc-text-active);
    text-decoration: none;
  }
  .toc :global(.toc-link:focus-visible) {
    outline: 2px solid var(--toc-accent);
    outline-offset: 2px;
  }
  .toc :global(.toc-link.is-active) {
    color: var(--toc-text-active);
    background: var(--toc-active-bg);
  }
  .toc :global(.toc-item--sub .toc-link.is-active) {
    background: transparent;
  }
  .toc :global(.toc-item--top > .toc-link.is-active .toc-text) {
    text-shadow: 0.35px 0 0 currentColor, -0.35px 0 0 currentColor;
  }
  .toc :global(.toc-text) {
    display: block;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  /* ドット。深さに応じて左へ寄せ、全部が同じ縦線の上に乗るようにする */
  .toc :global(.toc-dot-wrap) {
    position: absolute;
    top: 50%;
    left: calc(-25px - var(--toc-depth, 0) * 12px);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    margin-top: -8px;
    background: var(--toc-bg);
    border-radius: 50%;
  }
  .toc :global(.toc-dot) {
    display: block;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background: var(--toc-bg);
    border: 2px solid var(--toc-accent);
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
  .toc :global(.toc-item--sub .toc-dot) {
    width: 9px;
    height: 9px;
  }
  .toc :global(.toc-link:hover .toc-dot) {
    transform: scale(1.08);
  }

  /* 読んでいる位置を示す塗りつぶしの丸。JS が top / left を置く */
  .toc :global(.toc-thumb) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    width: 8px;
    height: 8px;
    background: var(--toc-accent);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    transition: top 0.4s cubic-bezier(0.22, 1, 0.36, 1), left 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      width 0.25s ease, height 0.25s ease, opacity 0.2s ease;
  }
  .toc :global(.toc-thumb.is-snap) {
    animation: toc-thumb-snap 0.35s ease;
  }
  @keyframes toc-thumb-snap {
    0% { transform: scale(1); }
    50% { transform: scale(1.6); }
    100% { transform: scale(1); }
  }

  /* ---- スマホ: 右下のボタンとパネル ---- */
  .toc--mobile {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 60;
  }
  .toc-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 10px 16px;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
    color: var(--toc-text-active);
    background: var(--toc-bg);
    border: 1px solid var(--toc-border);
    border-radius: 999px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
    cursor: pointer;
    appearance: none;
    transform: translateY(12px);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s linear 0.3s;
  }
  .toc-toggle i {
    font-size: 18px;
    color: var(--toc-accent);
  }
  .toc--mobile.is-revealed .toc-toggle {
    transform: translateY(0);
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }
  .toc-toggle:focus-visible {
    outline: 2px solid var(--toc-accent);
    outline-offset: 3px;
  }

  .toc-panel {
    position: fixed;
    right: 16px;
    bottom: 68px;
    left: 16px;
    box-sizing: border-box;
    max-height: calc(100vh - 68px - 24px);
    max-height: calc(100dvh - 68px - 24px);
    padding: 16px 18px 18px;
    background: var(--toc-bg);
    border: 1px solid var(--toc-border);
    border-radius: 0.5rem;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    animation: toc-panel-in 0.25s ease;
  }
  .toc-panel[hidden] {
    display: none;
  }
  @keyframes toc-panel-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media only screen and (min-width: 480px) {
    .toc-panel {
      left: auto;
      width: 360px;
    }
  }
  .toc-panel-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .toc-top {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--toc-muted);
    text-decoration: none;
  }
  .toc-top:hover {
    color: var(--toc-text-active);
    text-decoration: underline;
  }
  .toc :global(.toc-nav--panel) {
    max-height: calc(100vh - 68px - 24px - 80px);
    max-height: calc(100dvh - 68px - 24px - 80px);
    scrollbar-width: none;
  }
  .toc :global(.toc-nav--panel::-webkit-scrollbar) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .toc :global(.toc-thumb),
    .toc :global(.toc-link),
    .toc :global(.toc-dot),
    .toc-toggle,
    .toc-panel {
      transition: none;
      animation: none;
    }
  }
`;

export default Toc;
