import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/before_posts/add-zod-to-myblog')) {
    return NextResponse.rewrite(new URL('/blog/posts/add-zod-to-nextjs-project', request.url))
  }
}
