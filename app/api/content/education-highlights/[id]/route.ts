import { type NextRequest, NextResponse } from "next/server";
import { deleteEducationHighlight, initDatabase } from "@/lib/database";

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        ensureDbInitialized();

        const success = deleteEducationHighlight(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Education highlight not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/education-highlights/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete education highlight",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
