import Database from "better-sqlite3"
import path from "path"
import { readFileSync, existsSync, mkdirSync } from "fs"

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'portfolio.db');

// Ensure data directory exists
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
}

// Initialize database connection
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

// Content Management Types
export type PersonalInfo = {
    id: string
    full_name: string
    tagline: string
    email: string
    telegram: string
    github_url: string | null
    linkedin_url: string | null
    instagram_url: string | null
    twitter_url: string | null
    location: string | null
    created_at: string
    updated_at: string
}

export type AboutContent = {
    id: string
    page_title: string
    page_subtitle: string | null
    biography: string
    created_at: string
    updated_at: string
}

export type TechCategory = {
    id: string
    name: string
    icon_name: string
    display_order: number
    skills: TechSkill[]
    created_at: string
    updated_at: string
}

export type TechSkill = {
    id: string
    category_id: string
    skill_name: string
    display_order: number
    created_at: string
}

export type ContactContent = {
    id: string
    page_title: string
    page_subtitle: string | null
    form_title: string
    form_description: string | null
    direct_contact_title: string
    follow_me_title: string
    follow_me_description: string | null
    footer_text: string | null
    created_at: string
    updated_at: string
}

export type EducationContent = {
    id: string
    page_title: string
    intro_text: string
    section_title: string
    created_at: string
    updated_at: string
}

export type EducationEntry = {
    id: string
    institution: string
    credentials: string
    period: string
    location: string
    display_order: number
    highlights: EducationHighlight[]
    created_at: string
    updated_at: string
}

export type EducationHighlight = {
    id: string
    education_id: string
    highlight_text: string
    display_order: number
    created_at: string
}

export type MusicContent = {
    id: string
    page_title: string
    page_subtitle: string
    journey_section_title: string
    favorites_section_title: string
    created_at: string
    updated_at: string
}

export type MusicalJourney = {
    id: string
    instrument: string
    icon_name: string
    years: string
    level: string
    description: string
    display_order: number
    achievements: MusicalAchievement[]
    created_at: string
    updated_at: string
}

export type MusicalAchievement = {
    id: string
    journey_id: string
    achievement_text: string
    display_order: number
    created_at: string
}

export type MusicGenre = {
    id: string
    genre_name: string
    icon_name: string
    display_order: number
    artists: FavoriteArtist[]
    created_at: string
    updated_at: string
}

export type FavoriteArtist = {
    id: string
    genre_id: string
    artist_name: string
    display_order: number
    created_at: string
}

function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Initialize database
export function initDatabase() {
    const schemaPath = path.join(process.cwd(), "scripts", "init-database.sql")
    const initSql = readFileSync(schemaPath, "utf8")
    db.exec(initSql)

    // Run content management migration
    const migrationPath = path.join(process.cwd(), "scripts", "migrate-content-management.sql")
    if (existsSync(migrationPath)) {
        const migrationSql = readFileSync(migrationPath, "utf8")
        db.exec(migrationSql)
    }
}

// Project operations
export function getAllProjects(): Project[] {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC")
    const rows = stmt.all() as any[]
    return rows.map((row) => ({
        ...row,
        tags: JSON.parse(row.tags || "[]"),
        featured: Boolean(row.featured),
    }))
}

export function getProjectById(id: string): Project | null {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?")
    const row = stmt.get(id) as any
    if (!row) return null
    return {
        ...row,
        tags: JSON.parse(row.tags || "[]"),
        featured: Boolean(row.featured),
    }
}

export function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): string {
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
}

export function updateProject(id: string, project: Partial<Omit<Project, "id" | "created_at" | "updated_at">>): boolean {
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
}

export function deleteProject(id: string): boolean {
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

// Tag operations
export function getAllTags(): Tag[] {
    const stmt = db.prepare("SELECT * FROM tags ORDER BY name")
    return stmt.all() as Tag[]
}

export function createTag(tag: Omit<Tag, "id" | "created_at">): string {
    const id = generateId()
    const stmt = db.prepare("INSERT INTO tags (id, name, color) VALUES (?, ?, ?)")
    stmt.run(id, tag.name, tag.color)
    return id
}

// ============================================================================
// PERSONAL INFO OPERATIONS
// ============================================================================
export function getPersonalInfo(): PersonalInfo | null {
    const stmt = db.prepare("SELECT * FROM personal_info WHERE id = 'main'")
    return stmt.get() as PersonalInfo | null
}

export function updatePersonalInfo(data: Partial<Omit<PersonalInfo, "id" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push('main')

    const stmt = db.prepare(`UPDATE personal_info SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

// ============================================================================
// ABOUT CONTENT OPERATIONS
// ============================================================================
export function getAboutContent(): AboutContent | null {
    const stmt = db.prepare("SELECT * FROM about_content WHERE id = 'main'")
    return stmt.get() as AboutContent | null
}

export function updateAboutContent(data: Partial<Omit<AboutContent, "id" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push('main')

    const stmt = db.prepare(`UPDATE about_content SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

// ============================================================================
// TECH CATEGORIES & SKILLS OPERATIONS
// ============================================================================
export function getAllTechCategories(): TechCategory[] {
    const categoriesStmt = db.prepare("SELECT * FROM tech_categories ORDER BY display_order ASC")
    const categories = categoriesStmt.all() as Omit<TechCategory, 'skills'>[]

    return categories.map(category => {
        const skillsStmt = db.prepare("SELECT * FROM tech_skills WHERE category_id = ? ORDER BY display_order ASC")
        const skills = skillsStmt.all(category.id) as TechSkill[]
        return {
            ...category,
            skills
        }
    })
}

export function createTechCategory(data: Omit<TechCategory, "id" | "skills" | "created_at" | "updated_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM tech_categories")
    const result = maxOrderStmt.get() as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO tech_categories (id, name, icon_name, display_order)
        VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, data.name, data.icon_name, displayOrder)
    return id
}

export function updateTechCategory(id: string, data: Partial<Omit<TechCategory, "id" | "skills" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push(id)

    const stmt = db.prepare(`UPDATE tech_categories SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function deleteTechCategory(id: string): boolean {
    const stmt = db.prepare("DELETE FROM tech_categories WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

export function createTechSkill(skill: Omit<TechSkill, "id" | "created_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM tech_skills WHERE category_id = ?")
    const result = maxOrderStmt.get(skill.category_id) as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO tech_skills (id, category_id, skill_name, display_order)
        VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, skill.category_id, skill.skill_name, displayOrder)
    return id
}

export function updateTechSkill(id: string, data: Partial<Omit<TechSkill, "id" | "created_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false
    values.push(id)

    const stmt = db.prepare(`UPDATE tech_skills SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function deleteTechSkill(id: string): boolean {
    const stmt = db.prepare("DELETE FROM tech_skills WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

// ============================================================================
// CONTACT CONTENT OPERATIONS
// ============================================================================
export function getContactContent(): ContactContent | null {
    const stmt = db.prepare("SELECT * FROM contact_content WHERE id = 'main'")
    return stmt.get() as ContactContent | null
}

export function updateContactContent(data: Partial<Omit<ContactContent, "id" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push('main')

    const stmt = db.prepare(`UPDATE contact_content SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

// ============================================================================
// EDUCATION OPERATIONS
// ============================================================================
export function getEducationContent(): EducationContent | null {
    const stmt = db.prepare("SELECT * FROM education_content WHERE id = 'main'")
    return stmt.get() as EducationContent | null
}

export function updateEducationContent(data: Partial<Omit<EducationContent, "id" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push('main')

    const stmt = db.prepare(`UPDATE education_content SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function getAllEducationEntries(): EducationEntry[] {
    const entriesStmt = db.prepare("SELECT * FROM education_entries ORDER BY display_order ASC")
    const entries = entriesStmt.all() as Omit<EducationEntry, 'highlights'>[]

    return entries.map(entry => {
        const highlightsStmt = db.prepare("SELECT * FROM education_highlights WHERE education_id = ? ORDER BY display_order ASC")
        const highlights = highlightsStmt.all(entry.id) as EducationHighlight[]
        return {
            ...entry,
            highlights
        }
    })
}

export function createEducationEntry(entry: Omit<EducationEntry, "id" | "highlights" | "created_at" | "updated_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM education_entries")
    const result = maxOrderStmt.get() as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO education_entries (id, institution, credentials, period, location, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(id, entry.institution, entry.credentials, entry.period, entry.location, displayOrder)
    return id
}

export function updateEducationEntry(id: string, data: Partial<Omit<EducationEntry, "id" | "highlights" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push(id)

    const stmt = db.prepare(`UPDATE education_entries SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function deleteEducationEntry(id: string): boolean {
    const stmt = db.prepare("DELETE FROM education_entries WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

export function createEducationHighlight(highlight: Omit<EducationHighlight, "id" | "created_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM education_highlights WHERE education_id = ?")
    const result = maxOrderStmt.get(highlight.education_id) as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO education_highlights (id, education_id, highlight_text, display_order)
        VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, highlight.education_id, highlight.highlight_text, displayOrder)
    return id
}

export function deleteEducationHighlight(id: string): boolean {
    const stmt = db.prepare("DELETE FROM education_highlights WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

// ============================================================================
// MUSIC OPERATIONS
// ============================================================================
export function getMusicContent(): MusicContent | null {
    const stmt = db.prepare("SELECT * FROM music_content WHERE id = 'main'")
    return stmt.get() as MusicContent | null
}

export function updateMusicContent(data: Partial<Omit<MusicContent, "id" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push('main')

    const stmt = db.prepare(`UPDATE music_content SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function getAllMusicalJourney(): MusicalJourney[] {
    const journeyStmt = db.prepare("SELECT * FROM musical_journey ORDER BY display_order ASC")
    const journeys = journeyStmt.all() as Omit<MusicalJourney, 'achievements'>[]

    return journeys.map(journey => {
        const achievementsStmt = db.prepare("SELECT * FROM musical_achievements WHERE journey_id = ? ORDER BY display_order ASC")
        const achievements = achievementsStmt.all(journey.id) as MusicalAchievement[]
        return {
            ...journey,
            achievements
        }
    })
}

export function createMusicalJourney(journey: Omit<MusicalJourney, "id" | "achievements" | "created_at" | "updated_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM musical_journey")
    const result = maxOrderStmt.get() as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO musical_journey (id, instrument, icon_name, years, level, description, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    stmt.run(id, journey.instrument, journey.icon_name, journey.years, journey.level, journey.description, displayOrder)
    return id
}

export function updateMusicalJourney(id: string, data: Partial<Omit<MusicalJourney, "id" | "achievements" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push(id)

    const stmt = db.prepare(`UPDATE musical_journey SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function deleteMusicalJourney(id: string): boolean {
    const stmt = db.prepare("DELETE FROM musical_journey WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

export function createMusicalAchievement(achievement: Omit<MusicalAchievement, "id" | "created_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM musical_achievements WHERE journey_id = ?")
    const result = maxOrderStmt.get(achievement.journey_id) as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO musical_achievements (id, journey_id, achievement_text, display_order)
        VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, achievement.journey_id, achievement.achievement_text, displayOrder)
    return id
}

export function deleteMusicalAchievement(id: string): boolean {
    const stmt = db.prepare("DELETE FROM musical_achievements WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

export function getAllMusicGenres(): MusicGenre[] {
    const genresStmt = db.prepare("SELECT * FROM music_genres ORDER BY display_order ASC")
    const genres = genresStmt.all() as Omit<MusicGenre, 'artists'>[]

    return genres.map(genre => {
        const artistsStmt = db.prepare("SELECT * FROM favorite_artists WHERE genre_id = ? ORDER BY display_order ASC")
        const artists = artistsStmt.all(genre.id) as FavoriteArtist[]
        return {
            ...genre,
            artists
        }
    })
}

export function createMusicGenre(genre: Omit<MusicGenre, "id" | "artists" | "created_at" | "updated_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM music_genres")
    const result = maxOrderStmt.get() as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO music_genres (id, genre_name, icon_name, display_order)
        VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, genre.genre_name, genre.icon_name, displayOrder)
    return id
}

export function updateMusicGenre(id: string, data: Partial<Omit<MusicGenre, "id" | "artists" | "created_at" | "updated_at">>): boolean {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`)
            values.push(value)
        }
    })

    if (updates.length === 0) return false

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push(id)

    const stmt = db.prepare(`UPDATE music_genres SET ${updates.join(", ")} WHERE id = ?`)
    const result = stmt.run(...values)
    return result.changes > 0
}

export function deleteMusicGenre(id: string): boolean {
    const stmt = db.prepare("DELETE FROM music_genres WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

export function createFavoriteArtist(artist: Omit<FavoriteArtist, "id" | "created_at">): string {
    const id = generateId()
    const maxOrderStmt = db.prepare("SELECT MAX(display_order) as max_order FROM favorite_artists WHERE genre_id = ?")
    const result = maxOrderStmt.get(artist.genre_id) as { max_order: number | null }
    const displayOrder = (result.max_order ?? -1) + 1

    const stmt = db.prepare(`
        INSERT INTO favorite_artists (id, genre_id, artist_name, display_order)
        VALUES (?, ?, ?, ?)
    `)
    stmt.run(id, artist.genre_id, artist.artist_name, displayOrder)
    return id
}

export function deleteFavoriteArtist(id: string): boolean {
    const stmt = db.prepare("DELETE FROM favorite_artists WHERE id = ?")
    const result = stmt.run(id)
    return result.changes > 0
}

export default db
