import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, access } from "fs/promises"
import path from "path"
import { constants } from "fs"

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get("file") as unknown as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 })
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads")

        try {
            await access(uploadsDir, constants.F_OK)
        } catch {
            // Directory doesn't exist, create it
            await mkdir(uploadsDir, { recursive: true })
            console.log("Created uploads directory:", uploadsDir)
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = path.extname(file.name).toLowerCase()
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
        if (!allowedExtensions.includes(extension)) {
            return NextResponse.json({ error: "Invalid file extension. Only images are allowed." }, { status: 400 })
        }
        const filename = `${timestamp}-${randomString}${extension}`
        const filepath = path.join(uploadsDir, filename)

        // Write file
        await writeFile(filepath, buffer)
        console.log("File saved to:", filepath)

        // Return the public URL
        const publicUrl = `/uploads/${filename}`

        return NextResponse.json({
            message: "File uploaded successfully",
            url: publicUrl,
            filename: filename,
        })
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }
}
