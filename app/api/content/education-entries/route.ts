import { type NextRequest, NextResponse } from "next/server";
import { getAllEducationEntries, createEducationEntry, initDatabase } from "@/lib/database";

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

        const entries = getAllEducationEntries();
        return NextResponse.json(entries);
    } catch (error) {
        console.error("Error in GET /api/content/education-entries:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch education entries",
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
        const id = createEducationEntry(data);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/content/education-entries:", error);
        return NextResponse.json(
            {
                error: "Failed to create education entry",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
