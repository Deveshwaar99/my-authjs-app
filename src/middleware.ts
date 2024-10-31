import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

// List of routes that do not require authentication
const PUBLIC_ROUTES = ['/']

// List of routes related to authentication, such as login and registration
const AUTH_ROUTES = ['/auth/login', '/auth/register']

// Prefix for API routes that require authentication
const API_AUTH_PREFIX = '/api/auth'

// Default redirect URL for authenticated users
export const DEFAULT_LOGIN_REDIRECT = '/settings'

export default auth(req => {
  const { nextUrl, auth: userAuth } = req
  const isLoggedIn = !!userAuth

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
  console.log({ isApiAuthRoute, isAuthRoute, isPublicRoute, isLoggedIn })
  if (isApiAuthRoute) return

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl))
  }

  return
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
