import { type NextRequest, NextResponse } from "next/server"
import { getAllArticles, createArticle, initDatabase } from "@/lib/database"
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth"

// Initialize database on first request
let dbInitialized = false
function ensureDbInitialized() {
  if (!dbInitialized) {
    initDatabase()
    dbInitialized = true
  }
}

export async function GET(request: NextRequest) {
  try {
    ensureDbInitialized()
    // Drafts are visible only with an admin session
    const isAdmin = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
    const articles = getAllArticles(isAdmin)
    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDbInitialized()
    const body = await request.json()

    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const id = createArticle({
      title: body.title,
      excerpt: body.excerpt ?? null,
      content: body.content,
      cover_image_url: body.cover_image_url ?? null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      published: Boolean(body.published),
    })

    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
