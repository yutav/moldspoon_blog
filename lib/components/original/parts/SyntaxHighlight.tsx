'use client';

import { useRef, useLayoutEffect, ReactNode } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/dark.css';

export const SyntaxHighlight = (
  { children }: { children: ReactNode },
) => {
  const codeRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, []);

  return (
    <code ref={codeRef}>
      {children}
    </code>
  );
};