import { type NextRequest, NextResponse } from "next/server";
import { updateMusicGenre, deleteMusicGenre, initDatabase } from "@/lib/database";

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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        ensureDbInitialized();

        const data = await request.json();
        const success = updateMusicGenre((await params).id, data);

        if (!success) {
            return NextResponse.json(
                { error: "Music genre not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in PUT /api/content/music-genres/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to update music genre",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        ensureDbInitialized();

        const success = deleteMusicGenre((await params).id);

        if (!success) {
            return NextResponse.json(
                { error: "Music genre not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/music-genres/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete music genre",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
