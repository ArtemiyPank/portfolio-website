import { type NextRequest, NextResponse } from "next/server"
import { getArticleById, updateArticle, deleteArticle, initDatabase } from "@/lib/database"
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth"

// Initialize database on first request
let dbInitialized = false
function ensureDbInitialized() {
  if (!dbInitialized) {
    initDatabase()
    dbInitialized = true
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDbInitialized()
    const { id } = await params
    const article = getArticleById(id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Drafts are visible only with an admin session
    if (!article.published) {
      const isAdmin = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
      if (!isAdmin) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDbInitialized()
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content !== undefined) updateData.content = body.content
    if (body.cover_image_url !== undefined) updateData.cover_image_url = body.cover_image_url
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : []
    if (body.published !== undefined) updateData.published = Boolean(body.published)

    const success = updateArticle(id, updateData)

    if (!success) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(getArticleById(id))
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDbInitialized()
    const { id } = await params
    const success = deleteArticle(id)

    if (!success) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
