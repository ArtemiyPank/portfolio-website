const Database = require("better-sqlite3")
const path = require("path")

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "portfolio.db")
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")




// Project operations
const projectsDb = {
  getAll: () => {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC")
    const rows = stmt.all()
    return rows.map((row) => ({
      ...row,
      tags: JSON.parse(row.tags || "[]"),
      featured: Boolean(row.featured),
    }))
  },

  getById: (id) => {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?")
    const row = stmt.get(id)
    if (!row) return null
    return {
      ...row,
      tags: JSON.parse(row.tags || "[]"),
      featured: Boolean(row.featured),
    }
  },

  create: (project) => {
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

  update: (id, project) => {
    const updates = []
    const values = []

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

  delete: (id) => {
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
  },
}

// Tag operations
const tagsDb = {
  getAll: () => {
    const stmt = db.prepare("SELECT * FROM tags ORDER BY name")
    return stmt.all()
  },

  create: (tag) => {
    const id = generateId()
    const stmt = db.prepare("INSERT INTO tags (id, name, color) VALUES (?, ?, ?)")
    stmt.run(id, tag.name, tag.color)
    return id
  },
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

module.exports = { projectsDb, tagsDb, db }
