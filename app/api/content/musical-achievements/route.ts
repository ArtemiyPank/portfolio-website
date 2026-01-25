import { type NextRequest, NextResponse } from "next/server";
import { createMusicalAchievement, initDatabase } from "@/lib/database";

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
        const id = createMusicalAchievement(data);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/content/musical-achievements:", error);
        return NextResponse.json(
            {
                error: "Failed to create musical achievement",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
