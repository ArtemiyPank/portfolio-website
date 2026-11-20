import { type NextRequest, NextResponse } from "next/server";
import { getEducationContent, updateEducationContent, initDatabase } from "@/lib/database";

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
        ensureDbInitialized();

        const educationContent = getEducationContent();

        if (!educationContent) {
            // Return null instead of 404 to allow frontend to use defaults
            return NextResponse.json(null);
        }

        return NextResponse.json(educationContent);
    } catch (error) {
        console.error("Error in GET /api/content/education:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch education content",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        ensureDbInitialized();

        const data = await request.json();
        const success = updateEducationContent(data);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to update education content" },
                { status: 400 }
            );
        }

        const updated = getEducationContent();
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error in PUT /api/content/education:", error);
        return NextResponse.json(
            {
                error: "Failed to update education content",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
