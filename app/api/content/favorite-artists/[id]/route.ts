import { type NextRequest, NextResponse } from "next/server";
import { deleteFavoriteArtist, initDatabase } from "@/lib/database";

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

        const success = deleteFavoriteArtist(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Favorite artist not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/favorite-artists/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete favorite artist",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
