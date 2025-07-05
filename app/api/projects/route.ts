import {type NextRequest, NextResponse} from "next/server"
import {projectsDb, initDatabase} from "@/lib/database"

// Initialize database on first request
let dbInitialized = false

function ensureDbInitialized() {
    if (!dbInitialized) {
        try {
            initDatabase()
            dbInitialized = true
            console.log("Database initialized successfully")
        } catch (error) {
            console.error("Failed to initialize database:", error)
            throw error
        }
    }
}

export async function GET() {
    try {
        console.log("GET /api/projects - Starting request")
        ensureDbInitialized()

        console.log("Fetching projects from database...")
        const projects = projectsDb.getAll()
        console.log(`Found ${projects.length} projects`)

        return NextResponse.json(projects)
    } catch (error) {
        console.error("Error in GET /api/projects:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch projects",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500},
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log("POST /api/projects - Starting request")
        ensureDbInitialized()
        const body = await request.json()

        const projectData = {
            title: body.title,
            description: body.description || null,
            short_description: body.short_description || null,
            image_url: body.image_url || null,
            github_url: body.github_url || null,
            demo_url: body.demo_url || null,
            tags: Array.isArray(body.tags) ? body.tags : [],
            featured: Boolean(body.featured),
        }

        const id = projectsDb.create(projectData)
        const newProject = projectsDb.getById(id)

        return NextResponse.json(newProject, {status: 201})
    } catch (error) {
        console.error("Error in POST /api/projects:", error)
        return NextResponse.json(
            {
                error: "Failed to create project",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            {status: 500},
        )
    }
}
