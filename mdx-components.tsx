//import { SyntaxHighlight } from 'lib/components/original/parts/SyntaxHighlight';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

// 見出しに inline code や太字・リンクが含まれると children が配列や要素になる。
// そのまま toLowerCase() を呼ぶとビルドが落ちるので、再帰的にテキストだけ取り出す。
// 素のテキスト見出しでは従来と同じ文字列になるため、既存記事の id は変わらない。
const toText = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toText).join('');
  const props = (node as { props?: { children?: ReactNode } }).props;
  return props ? toText(props.children) : '';
};

const toId = (children: ReactNode): string =>
  toText(children).toLowerCase().replace(/\s+/g, '-');

export function useMDXComponents(_: MDXComponents): MDXComponents {

  const CustomH1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h1 id={toId(children)}>{children}</h1>
  );
  const CustomH2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 id={toId(children)}>{children}</h2>
  );
  const CustomH3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 id={toId(children)}>{children}</h3>
  );
  const CustomH4: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 id={toId(children)}>{children}</h4>
  );
  const CustomH5: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h5 id={toId(children)}>{children}</h5>
  );
  const CustomH6: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h6 id={toId(children)}>{children}</h6>
  );

  return {
    //    code: ({ children }) => <SyntaxHighlight>{children}</SyntaxHighlight>,
    h1: CustomH1,
    h2: CustomH2,
    h3: CustomH3,
    h4: CustomH4,
    h5: CustomH5,
    h6: CustomH6
  };
};
