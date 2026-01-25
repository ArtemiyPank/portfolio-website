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
}

module.exports = { initDatabase, db };
