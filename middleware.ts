import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if(session && path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if(!session && path === '/admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (session && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};