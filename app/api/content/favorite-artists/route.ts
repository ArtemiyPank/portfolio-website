import { type NextRequest, NextResponse } from "next/server";
import { createFavoriteArtist, initDatabase } from "@/lib/database";

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

export async function POST(request: NextRequest) {
    try {
        ensureDbInitialized();

        const data = await request.json();
        const id = createFavoriteArtist(data);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/content/favorite-artists:", error);
        return NextResponse.json(
            {
                error: "Failed to create favorite artist",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
