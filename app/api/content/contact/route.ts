import { type NextRequest, NextResponse } from "next/server";
import { getContactContent, updateContactContent, initDatabase } from "@/lib/database";

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

        const contactContent = getContactContent();

        if (!contactContent) {
            // Return null instead of 404 to allow frontend to use defaults
            return NextResponse.json(null);
        }

        return NextResponse.json(contactContent);
    } catch (error) {
        console.error("Error in GET /api/content/contact:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch contact content",
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
        const success = updateContactContent(data);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to update contact content" },
                { status: 400 }
            );
        }

        const updated = getContactContent();
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error in PUT /api/content/contact:", error);
        return NextResponse.json(
            {
                error: "Failed to update contact content",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
