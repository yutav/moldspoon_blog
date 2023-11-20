'use client';

import { useRef, useEffect, ReactNode } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';

export const SyntaxHighlight = (
  { children }: { children: ReactNode },
) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
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