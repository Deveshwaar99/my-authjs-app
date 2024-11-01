import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

// List of routes that do not require authentication
const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register']

// Prefix for API routes that require authentication
const API_AUTH_PREFIX = '/api/auth'

// Default redirect URL for authenticated users
export const DEFAULT_LOGIN_REDIRECT = '/settings'

export default auth(req => {
  const { nextUrl, auth: userAuth } = req
  const isLoggedIn = !!userAuth

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
  // console.log({ isApiAuthRoute, isAuthRoute, isPublicRoute, isLoggedIn })
  if (isApiAuthRoute) return

  if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl))
  }

  return
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
