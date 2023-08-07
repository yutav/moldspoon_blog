import { SyntaxHighlight } from 'lib/components/original/parts/SyntaxHightlight';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: ({ children }) => <SyntaxHighlight>{children}</SyntaxHighlight>,
    ...components,
  };
};