const { initDatabase } = require("../lib/database.ts")

console.log("Initializing SQLite database...")
try {
  initDatabase()
  console.log("Database initialized successfully!")
} catch (error) {
  console.error("Error initializing database:", error)
  process.exit(1)
}
