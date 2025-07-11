import Database from "better-sqlite3"
import path from "path"
import { readFileSync } from "fs"

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

export type Project = {
    id: string
    title: string
    description: string | null
    short_description: string | null
    image_url: string | null
    github_url: string | null
    demo_url: string | null
    tags: string[]
    featured: boolean
    created_at: string
    updated_at: string
}

export type Tag = {
    id: string
    name: string
    color: string
    created_at: string
}

// Initialize a database
export function initDatabase() {
    // Read SQL schema from a file
    const schemaPath = path.join(process.cwd(), "scripts", "init-database.sql")
    const initSql = readFileSync(schemaPath, "utf8")

    db.exec(initSql)
}

// Project operations
export const projectsDb = {
    getAll: (): Project[] => {
        const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC")
        const rows = stmt.all() as any[]
        return rows.map((row) => ({
            ...row,
            tags: JSON.parse(row.tags || "[]"),
            featured: Boolean(row.featured),
        }))
    },

    getById: (id: string): Project | null => {
        const stmt = db.prepare("SELECT * FROM projects WHERE id = ?")
        const row = stmt.get(id) as any
        if (!row) return null
        return {
            ...row,
            tags: JSON.parse(row.tags || "[]"),
            featured: Boolean(row.featured),
        }
    },

    create: (project: Omit<Project, "id" | "created_at" | "updated_at">): string => {
        const id = generateId()
        const stmt = db.prepare(`
            INSERT INTO projects (id, title, description, short_description, image_url, github_url, demo_url, tags, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        stmt.run(
            id,
            project.title,
            project.description,
            project.short_description,
            project.image_url,
            project.github_url,
            project.demo_url,
            JSON.stringify(project.tags),
            project.featured ? 1 : 0,
        )
        return id
    },

    update: (id: string, project: Partial<Omit<Project, "id" | "created_at" | "updated_at">>): boolean => {
        const updates: string[] = []
        const values: any[] = []

        Object.entries(project).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === "tags") {
                    updates.push(`${key} = ?`)
                    values.push(JSON.stringify(value))
                } else if (key === "featured") {
                    updates.push(`${key} = ?`)
                    values.push(value ? 1 : 0)
                } else {
                    updates.push(`${key} = ?`)
                    values.push(value)
                }
            }
        })

        if (updates.length === 0) return false

        updates.push("updated_at = CURRENT_TIMESTAMP")
        values.push(id)

        const stmt = db.prepare(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?`)
        const result = stmt.run(...values)
        return result.changes > 0
    },

    delete: (id: string): boolean => {
        const stmt = db.prepare("DELETE FROM projects WHERE id = ?")
        const result = stmt.run(id)
        return result.changes > 0
    },
}

// Tag operations
export const tagsDb = {
    getAll: (): Tag[] => {
        const stmt = db.prepare("SELECT * FROM tags ORDER BY name")
        return stmt.all() as Tag[]
    },

    create: (tag: Omit<Tag, "id" | "created_at">): string => {
        const id = generateId()
        const stmt = db.prepare("INSERT INTO tags (id, name, color) VALUES (?, ?, ?)")
        stmt.run(id, tag.name, tag.color)
        return id
    },
}

function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export default db
