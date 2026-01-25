import { type NextRequest, NextResponse } from "next/server";
import { updateTechSkill, deleteTechSkill, initDatabase } from "@/lib/database";

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
        const success = updateTechSkill(params.id, data);

        if (!success) {
            return NextResponse.json(
                { error: "Tech skill not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in PUT /api/content/tech-skills/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to update tech skill",
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

        const success = deleteTechSkill(params.id);

        if (!success) {
            return NextResponse.json(
                { error: "Tech skill not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/content/tech-skills/[id]:", error);
        return NextResponse.json(
            {
                error: "Failed to delete tech skill",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
