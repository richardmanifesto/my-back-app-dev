import { NextResponse }      from 'next/server'
import type { NextRequest }  from 'next/server'
import {SessionHandler}      from "@root/src/classes/SessionHandler"
import {SignJWT, jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  const sessionToken   = SessionHandler.sessionTokenGet( request.headers.get("cookie"))
  const sessionHandler = SessionHandler.create()

  if (request.nextUrl.pathname == '/user/logout') {
    const response = NextResponse.redirect(new URL('/user/login', request.url))
    response.cookies.set("session", "")
    return response
  }

  try {
    await sessionHandler.tokenVerify(sessionToken)
  }
  catch (e) {
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 403 })
    }
    else {
      return NextResponse.redirect(new URL('/user/login', request.url))
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/api/me/update',
    '/api/me/activity/for-date/[date]',
    '/user/logout'
  ],
}