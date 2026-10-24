const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const sqlFile = path.resolve('scratch/remote-d1.sql');
const dbFile = path.resolve('data/siteyonetim.db');

console.log('Loading SQL dump from:', sqlFile);
let sql = fs.readFileSync(sqlFile, 'utf8');

const db = new Database(dbFile);

// Drop existing tables to ensure clean slate
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('Dropping existing tables:', tables.map(t => t.name));

db.pragma('foreign_keys = OFF');
for (const t of tables) {
  try {
    db.exec(`DROP TABLE IF EXISTS "${t.name}"`);
  } catch (err) {
    console.warn(`Could not drop ${t.name}:`, err.message);
  }
}

// Execute remote dump
db.exec(sql);
db.pragma('foreign_keys = ON');

// Check if status column exists in users table, add if missing
try {
  db.exec("ALTER TABLE users ADD COLUMN status text NOT NULL DEFAULT 'APPROVED'");
} catch (e) {
  // already exists
}

console.log('Sync complete!');
const users = db.prepare('SELECT id, name, email_or_phone, role FROM users').all();
console.log('Users in database:', users);
db.close();
