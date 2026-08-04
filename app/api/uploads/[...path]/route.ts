import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    try {
        const filePath = (await params).path.join("/")
        const uploadsDir = path.join(process.cwd(), "public", "uploads")
        const fullPath = path.resolve(uploadsDir, filePath)

        // Reject paths that escape the uploads directory
        if (fullPath !== uploadsDir && !fullPath.startsWith(uploadsDir + path.sep)) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        // Check if file exists
        if (!existsSync(fullPath)) {
            return new NextResponse("File not found", { status: 404 })
        }

        // Read the file
        const fileBuffer = await readFile(fullPath)

        // Determine content type based on file extension
        const ext = path.extname(filePath).toLowerCase()
        let contentType = "application/octet-stream"

        switch (ext) {
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg"
                break
            case ".png":
                contentType = "image/png"
                break
            case ".gif":
                contentType = "image/gif"
                break
            case ".webp":
                contentType = "image/webp"
                break
        }

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        })
    } catch (error) {
        console.error("Error serving file:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
