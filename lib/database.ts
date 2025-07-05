import Database from "better-sqlite3"
import path from "path"

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "portfolio.db")
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

// Initialize database with schema
export function initDatabase() {
    const initSql = `
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  tags TEXT DEFAULT '[]',
  featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample tags
INSERT OR IGNORE INTO tags (name, color) VALUES 
  ('React', '#61DAFB'),
  ('Next.js', '#000000'),
  ('TypeScript', '#3178C6'),
  ('Tailwind CSS', '#06B6D4'),
  ('Node.js', '#339933'),
  ('Python', '#3776AB'),
  ('C#', '#239120'),
  ('Docker', '#2496ED');

-- Insert sample projects
INSERT OR IGNORE INTO projects (title, description, short_description, image_url, github_url, demo_url, tags, featured) VALUES 
  (
    'E-Commerce Dashboard',
    'A comprehensive admin dashboard for managing an e-commerce platform with real-time analytics, inventory management, and order processing.',
    'Modern admin dashboard with analytics and inventory management',
    '/placeholder.svg?height=400&width=600',
    'https://github.com/username/ecommerce-dashboard',
    'https://ecommerce-dashboard-demo.vercel.app',
    '["React", "Next.js", "TypeScript", "Tailwind CSS"]',
    1
  ),
  (
    'Task Management App',
    'A collaborative task management application with real-time updates, team collaboration features, and project tracking.',
    'Collaborative task manager with real-time updates',
    '/placeholder.svg?height=400&width=600',
    'https://github.com/username/task-manager',
    'https://task-manager-demo.vercel.app',
    '["React", "Node.js", "TypeScript"]',
    1
  ),
  (
    'Weather Forecast API',
    'RESTful API service that aggregates weather data from multiple sources and provides accurate forecasting with caching and rate limiting.',
    'RESTful weather API with data aggregation',
    '/placeholder.svg?height=400&width=600',
    'https://github.com/username/weather-api',
    NULL,
    '["Python", "Docker", "Node.js"]',
    0
  );
`

    db.exec(initSql)
}

// Project operations
export const projectsDb = {
    getAll: (): Project[] => {
        try {
            console.log("Executing getAll query...")
            const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC")
            const rows = stmt.all() as any[]
            console.log(`Raw rows from database: ${rows.length}`)

            const projects = rows.map((row) => {
                try {
                    return {
                        ...row,
                        tags: JSON.parse(row.tags || "[]"),
                        featured: Boolean(row.featured),
                    }
                } catch (parseError) {
                    console.error("Error parsing project row:", row, parseError)
                    return {
                        ...row,
                        tags: [],
                        featured: Boolean(row.featured),
                    }
                }
            })

            console.log(`Processed projects: ${projects.length}`)
            return projects
        } catch (error) {
            console.error("Error in projectsDb.getAll:", error)
            throw error
        }
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
