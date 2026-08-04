import { type NextRequest, NextResponse } from "next/server"
import { createSessionToken, verifySessionToken, SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/auth"

function isSecureRequest(request: NextRequest): boolean {
    return request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:"
}

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()

        // Get admin password from environment variable
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminPassword) {
            console.error("ADMIN_PASSWORD environment variable is not set")
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        if (password === adminPassword) {
            const token = await createSessionToken()
            if (!token) {
                return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
            }
            const response = NextResponse.json({ success: true })
            response.cookies.set(SESSION_COOKIE, token, {
                httpOnly: true,
                sameSite: "lax",
                secure: isSecureRequest(request),
                path: "/",
                maxAge: SESSION_TTL_MS / 1000,
            })
            return response
        } else {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 })
        }
    } catch (error) {
        console.error("Admin auth error:", error)
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const authenticated = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
    return NextResponse.json({ authenticated })
}

export async function DELETE(request: NextRequest) {
    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isSecureRequest(request),
        path: "/",
        maxAge: 0,
    })
    return response
}
