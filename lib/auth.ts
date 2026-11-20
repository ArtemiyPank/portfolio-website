// Session tokens are HMAC-signed expiry timestamps. Uses Web Crypto so the
// same code runs in both the Node runtime (API routes) and Edge (middleware).

export const SESSION_COOKIE = "admin_session"
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

// The admin password is mixed into the signing key so that changing it
// invalidates every previously issued session token.
function getSecret(): string | null {
    const secret = process.env.SESSION_SECRET || ""
    const password = process.env.ADMIN_PASSWORD || ""
    if (!secret && !password) return null
    return `${secret}:${password}`
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

    return timingSafeEqual(signature, await hmac(expiresAt, secret))
}

// Compare the HMACs rather than the strings themselves so the comparison
// time reveals nothing about where the values diverge.
export async function verifyPassword(supplied: string, actual: string): Promise<boolean> {
    return timingSafeEqual(await hmac(supplied, "password-compare"), await hmac(actual, "password-compare"))
}

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return diff === 0
}
