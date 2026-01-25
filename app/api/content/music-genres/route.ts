import { type NextRequest, NextResponse } from "next/server";
import { getAllMusicGenres, createMusicGenre, initDatabase } from "@/lib/database";

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

        const genres = getAllMusicGenres();
        return NextResponse.json(genres);
    } catch (error) {
        console.error("Error in GET /api/content/music-genres:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch music genres",
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
        const id = createMusicGenre(data);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/content/music-genres:", error);
        return NextResponse.json(
            {
                error: "Failed to create music genre",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
