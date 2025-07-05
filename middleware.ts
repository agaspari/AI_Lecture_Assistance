import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// exact public routes
const PUBLIC_PATHS = ['/', '/login', '/register']
// any path under these prefixes is also public
const PUBLIC_PREFIXES = ['/api/', '/register/']

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // 1. skip Next.js internals & static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        /\.(css|js|png|jpg|svg|ico)$/.test(pathname)
    ) {
        return NextResponse.next()
    }

    // 2. allow public routes
    if (
        PUBLIC_PATHS.includes(pathname) ||
        PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))
    ) {
        return NextResponse.next()
    }

    // 3. for everything else, grab the NextAuth token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
        // no session → redirect to login, preserving the original path
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 4. valid session → allow
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}