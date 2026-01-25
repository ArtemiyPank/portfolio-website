import { type NextRequest, NextResponse } from "next/server";
import { updateEducationEntry, deleteEducationEntry, initDatabase } from "@/lib/database";

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
        const success = updateEducationEntry(params.id, data);

        if (!success) {
            return NextResponse.json(
                { error: "Education entry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in PUT /api/content/education-entries/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to update education entry",
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

        const success = deleteEducationEntry(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Education entry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/education-entries/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete education entry",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
