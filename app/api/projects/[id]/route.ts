import { type NextRequest, NextResponse } from "next/server"
import { getProjectById, updateProject, deleteProject, initDatabase } from "@/lib/database"

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
    const project = getProjectById(id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDbInitialized()
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.short_description !== undefined) updateData.short_description = body.short_description
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.github_url !== undefined) updateData.github_url = body.github_url
    if (body.demo_url !== undefined) updateData.demo_url = body.demo_url
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : []
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured)

    const success = updateProject(id, updateData)

    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const updatedProject = getProjectById(id)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDbInitialized()
    const { id } = await params
    const success = deleteProject(id)

    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
