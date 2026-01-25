import { type NextRequest, NextResponse } from "next/server";
import { getMusicContent, updateMusicContent, initDatabase } from "@/lib/database";

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

        const musicContent = getMusicContent();

        if (!musicContent) {
            return NextResponse.json(
                { error: "Music content not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(musicContent);
    } catch (error) {
        console.error("Error in GET /api/content/music:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch music content",
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
        const success = updateMusicContent(data);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to update music content" },
                { status: 400 }
            );
        }

        const updated = getMusicContent();
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error in PUT /api/content/music:", error);
        return NextResponse.json(
            {
                error: "Failed to update music content",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
