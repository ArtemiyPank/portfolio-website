import { type NextRequest, NextResponse } from "next/server";
import { updateTechCategory, deleteTechCategory, initDatabase } from "@/lib/database";

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
    { params }: { params: { id: string } }
) {
    try {
        ensureDbInitialized();

        const data = await request.json();
        const success = updateTechCategory(params.id, data);

        if (!success) {
            return NextResponse.json(
                { error: "Tech category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in PUT /api/content/tech-categories/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to update tech category",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        ensureDbInitialized();

        const success = deleteTechCategory(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Tech category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/tech-categories/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete tech category",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
