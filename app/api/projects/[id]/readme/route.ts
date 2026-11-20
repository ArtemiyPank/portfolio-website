import { type NextRequest, NextResponse } from "next/server"
import { getProjectById, initDatabase, type Project } from "@/lib/database"

// Initialize a database on the first request
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
        const project: Project | null = getProjectById(id)

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        if (!project.github_url) {
            return NextResponse.json({ error: "No GitHub URL available" }, { status: 404 })
        }

        // Extract owner and repo from GitHub URL
        const githubUrlMatch = project.github_url.match(/github\.com\/([^/]+)\/([^/]+)/)
        if (!githubUrlMatch) {
            return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
        }

        const [, owner, repo] = githubUrlMatch
        const cleanRepo = repo.replace(/\.git$/, "") // Remove .git suffix if present

        // Fetch README from GitHub API
        const githubApiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/readme`

        const response = await fetch(githubApiUrl, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Portfolio-Website",
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: "README not found in repository" }, { status: 404 })
            }
            throw new Error(`GitHub API error: ${response.status}`)
        }

        const data = await response.json()

        // Decode base64 content
        const readmeContent = Buffer.from(data.content, "base64").toString("utf-8")

        return NextResponse.json({
            content: readmeContent,
            name: data.name,
            path: data.path,
            sha: data.sha,
            size: data.size,
            url: data.html_url,
        })
    } catch (error) {
        console.error("Error fetching README:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch README",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}
