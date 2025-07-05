import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    // Handle uploads path
    if (request.nextUrl.pathname.startsWith("/uploads/")) {
        // Rewrite to API route that serves the files
        const pathname = request.nextUrl.pathname.replace("/uploads/", "")
        return NextResponse.rewrite(new URL(`/api/uploads/${pathname}`, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/uploads/:path*"],
}
