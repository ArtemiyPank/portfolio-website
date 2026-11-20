import { type NextRequest, NextResponse } from "next/server";
import { getAboutContent, updateAboutContent, initDatabase } from "@/lib/database";

let dbInitialized = false;

function ensureDbInitialized() {
    if (!dbInitialized) {
        try {
            initDatabase();
            dbInitialized = true;
        } catch (error) {
            console.error("Failed to initialize database:", error);
            throw error;
        }
    }
}

export async function GET() {
    try {
        ensureDbInitialized();

        const aboutContent = getAboutContent();

        if (!aboutContent) {
            // Return null instead of 404 to allow frontend to use defaults
            return NextResponse.json(null);
        }

        return NextResponse.json(aboutContent);
    } catch (error) {
        console.error("Error in GET /api/content/about:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch about content",
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
        const success = updateAboutContent(data);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to update about content" },
                { status: 400 }
            );
        }

        const updated = getAboutContent();
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error in PUT /api/content/about:", error);
        return NextResponse.json(
            {
                error: "Failed to update about content",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
