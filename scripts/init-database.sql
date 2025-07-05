const path = require("path")
const fs = require("fs")

// Создаем lib/database.js для Node.js
const dbCode = `
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  const initSql = \`
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
\`;

  db.exec(initSql);
}

module.exports = { initDatabase, db };
`

// Создаем директорию lib если её нет
if (!fs.existsSync("lib")) {
  fs.mkdirSync("lib")
}

// Записываем файл database.js
fs.writeFileSync("lib/database.js", dbCode)

// Инициализируем базу данных
const { initDatabase } = require("../lib/database.js")

console.log("Initializing SQLite database...")
try {
  initDatabase()
  console.log("✅ Database initialized successfully!")
  console.log("📁 Database file created: portfolio.db")
} catch (error) {
  console.error("❌ Error initializing database:", error)
  process.exit(1)
}
