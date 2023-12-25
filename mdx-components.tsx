//import { SyntaxHighlight } from 'lib/components/original/parts/SyntaxHighlight';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(_: MDXComponents): MDXComponents {
  const CustomH1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h1 id={(children as string).toLowerCase().replace(/\s+/g, '-')}>{children}</h1>
  );
  const CustomH2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 id={(children as string).toLowerCase().replace(/\s+/g, '-')}>{children}</h2>
  );
  const CustomH3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 id={(children as string).toLowerCase().replace(/\s+/g, '-')}>{children}</h3>
  );
  const CustomH4: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 id={(children as string).toLowerCase().replace(/\s+/g, '-')}>{children}</h4>
  );
  const CustomH5: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h5 id={(children as string).toLowerCase().replace(/\s+/g, '-')}>{children}</h5>
  );
  const CustomH6: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h6 id={(children as string).toLowerCase().replace(/\s+/g, '-')}>{children}</h6>
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