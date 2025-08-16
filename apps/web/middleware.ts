import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  const requiresAuth = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!requiresAuth) return res;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  if (profile?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};