import { NextResponse } from "next/server"
import { getAllTags, initDatabase } from "@/lib/database"

// Initialize database on first request
let dbInitialized = false
function ensureDbInitialized() {
  if (!dbInitialized) {
    initDatabase()
    dbInitialized = true
  }
}

export async function GET() {
  try {
    ensureDbInitialized()
    const tags = getAllTags()
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
