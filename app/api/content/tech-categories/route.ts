import { type NextRequest, NextResponse } from "next/server";
import { getAllTechCategories, createTechCategory, initDatabase } from "@/lib/database";

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

        const categories = getAllTechCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error in GET /api/content/tech-categories:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch tech categories",
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
        const id = createTechCategory(data);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/content/tech-categories:", error);
        return NextResponse.json(
            {
                error: "Failed to create tech category",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
