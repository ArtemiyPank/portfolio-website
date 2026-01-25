import { type NextRequest, NextResponse } from "next/server";
import { getAllProjects, getProjectById, createProject, initDatabase } from "@/lib/database";

// Initialize database on first request
let dbInitialized = false;

function ensureDbInitialized() {
    if (!dbInitialized) {
        try {
            initDatabase();
            dbInitialized = true;
            console.log("Database initialized successfully");
        } catch (error) {
            console.error("Failed to initialize database:", error);
            throw error;
        }
    }
}

export async function GET() {
    try {
        console.log("GET /api/projects - Starting request");
        ensureDbInitialized();

        console.log("Fetching projects from database...");
        const projects = getAllProjects();
        console.log(`Found ${projects.length} projects`);

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error in GET /api/projects:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch projects",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        ensureDbInitialized();

        const data = await request.json();
        const id = createProject(data);
        const newProject = getProjectById(id);

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/projects:", error);
        return NextResponse.json(
            {
                error: "Failed to create project",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
