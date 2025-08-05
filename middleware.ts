import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
  // Get locale from cookie or default to 'en'
  const locale = request.cookies.get('locale')?.value || 'en';
  
  // Add locale to headers so it can be accessed by the app
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  
  return response;
}

export const config = {
  // Match all paths except static assets and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
