import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;
  
  // Define paths that require authentication
  const protectedPaths = [
    '/dashboard',
    '/projects',
    '/settings',
  ];
  
  // Check if the path is protected (starts with any protected path)
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If it's not a protected path, allow the request
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Get the authentication token from cookies
  const authToken = request.cookies.get('authToken')?.value;
  
  // If there's no token and the path is protected, redirect to the login page
  if (!authToken) {
    const url = new URL('/auth/login', request.url);
    // Add the current path as a redirect parameter
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and authentication routes
    '/((?!api|_next/static|_next/image|favicon.ico|auth/).*)',
  ],
};
