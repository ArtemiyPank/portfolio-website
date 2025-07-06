const path = require("path")
const fs = require("fs")

// Создаем lib/database.js для Node.js
const dbCode = `
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  // Read SQL schema from file
  const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
  const initSql = fs.readFileSync(schemaPath, 'utf8');
  
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
  console.log("📄 Schema loaded from: scripts/schema.sql")
} catch (error) {
  console.error("❌ Error initializing database:", error)
  process.exit(1)
}
