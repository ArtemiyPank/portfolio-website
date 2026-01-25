import { type NextRequest, NextResponse } from "next/server";
import { deleteMusicalAchievement, initDatabase } from "@/lib/database";

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

        const success = deleteMusicalAchievement(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Musical achievement not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/musical-achievements/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete musical achievement",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
