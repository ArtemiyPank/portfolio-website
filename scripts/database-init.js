const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'portfolio.db');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  // Read SQL schema from file
  const schemaPath = path.join(process.cwd(), 'scripts', 'init-database.sql');
  const initSql = fs.readFileSync(schemaPath, 'utf8');

  db.exec(initSql);

  // Create content management tables
  const contentTablesPath = path.join(process.cwd(), 'scripts', 'create-content-tables.sql');
  if (fs.existsSync(contentTablesPath)) {
    const contentTablesSql = fs.readFileSync(contentTablesPath, 'utf8');
    db.exec(contentTablesSql);
    console.log('✅ Content management tables created');
  }

  // Seed initial data
  const seedScriptPath = path.join(process.cwd(), 'scripts', 'seed-initial-data.js');
  if (fs.existsSync(seedScriptPath)) {
    try {
      const { seedData } = require(seedScriptPath);
      seedData(db);
    } catch (error) {
      console.error('⚠️  Warning: Failed to seed initial data:', error.message);
      console.log('ℹ️  You can manually seed data later using: node scripts/seed-initial-data.js');
    }
  }
}

module.exports = { initDatabase, db };
