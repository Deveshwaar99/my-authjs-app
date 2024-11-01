import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register'] // List of routes that do not require authentication
const API_AUTH_PREFIX = '/api/auth' // Prefix for API routes that require authentication
export const DEFAULT_LOGIN_REDIRECT = '/settings' // Default redirect URL for authenticated users

export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
