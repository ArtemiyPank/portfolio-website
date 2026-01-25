const { initDatabase } = require("./database-init.js")

console.log("Initializing SQLite database...")
try {
  initDatabase()
  console.log("✅ Database initialized successfully!")
  console.log("📁 Database file created: portfolio.db")
} catch (error) {
  console.error("❌ Error initializing database:", error)
  process.exit(1)
}
