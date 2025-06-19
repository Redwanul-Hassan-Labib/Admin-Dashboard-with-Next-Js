import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/customer(.*)', '/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  // Skip all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Handle protected routes for unauthenticated users
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const userRole = sessionClaims?.role;

  // Role-based routing for protected routes
  if (pathname.startsWith('/customer')) {
    if (userRole !== 'customer') {
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
    return NextResponse.next();
  }

  // Default allow for other authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:[^/]+$)).*)', '/(api|trpc)(.*)'],
};
