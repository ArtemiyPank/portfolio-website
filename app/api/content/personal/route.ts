import { type NextRequest, NextResponse } from "next/server";
import { getPersonalInfo, updatePersonalInfo, initDatabase } from "@/lib/database";

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

        const personalInfo = getPersonalInfo();

        if (!personalInfo) {
            return NextResponse.json(
                { error: "Personal info not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(personalInfo);
    } catch (error) {
        console.error("Error in GET /api/content/personal:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch personal info",
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
        const success = updatePersonalInfo(data);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to update personal info" },
                { status: 400 }
            );
        }

        const updated = getPersonalInfo();
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error in PUT /api/content/personal:", error);
        return NextResponse.json(
            {
                error: "Failed to update personal info",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
