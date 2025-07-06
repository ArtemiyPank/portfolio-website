import { type NextRequest, NextResponse } from "next/server"

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
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 })
        }
    } catch (error) {
        console.error("Admin auth error:", error)
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }
}
