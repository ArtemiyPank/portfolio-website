import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth"

// Write access to these API namespaces requires an admin session.
// /api/auth/* and /api/contact/* stay public.
const PROTECTED_API_PREFIXES = ["/api/content", "/api/projects", "/api/tags", "/api/upload"]
const READ_ONLY_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Handle uploads path
    if (pathname.startsWith("/uploads/")) {
        // Rewrite to API route that serves the files
        const rest = pathname.replace("/uploads/", "")
        return NextResponse.rewrite(new URL(`/api/uploads/${rest}`, request.url))
    }

    const isProtected = PROTECTED_API_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
    if (isProtected && !READ_ONLY_METHODS.has(request.method)) {
        const authenticated = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/uploads/:path*", "/api/:path*"],
}
