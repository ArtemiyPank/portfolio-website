import { type NextRequest, NextResponse } from "next/server";
import { getAllMusicalJourney, createMusicalJourney, initDatabase } from "@/lib/database";

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

        const journeyEntries = getAllMusicalJourney();
        return NextResponse.json(journeyEntries);
    } catch (error) {
        console.error("Error in GET /api/content/musical-journey:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch musical journey",
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
        const id = createMusicalJourney(data);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/content/musical-journey:", error);
        return NextResponse.json(
            {
                error: "Failed to create musical journey entry",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
