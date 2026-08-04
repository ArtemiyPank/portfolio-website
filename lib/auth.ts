// Session tokens are HMAC-signed expiry timestamps. Uses Web Crypto so the
// same code runs in both the Node runtime (API routes) and Edge (middleware).

export const SESSION_COOKIE = "admin_session"
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getSecret(): string | null {
    return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || null
}

async function hmac(value: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    )
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}

export async function createSessionToken(): Promise<string | null> {
    const secret = getSecret()
    if (!secret) return null
    const expiresAt = Date.now() + SESSION_TTL_MS
    return `${expiresAt}.${await hmac(String(expiresAt), secret)}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
    const secret = getSecret()
    if (!secret || !token) return false

    const [expiresAt, signature] = token.split(".")
    if (!expiresAt || !signature) return false
    if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false

    const expected = await hmac(expiresAt, secret)
    if (signature.length !== expected.length) return false
    let diff = 0
    for (let i = 0; i < expected.length; i++) {
        diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
    }
    return diff === 0
}
