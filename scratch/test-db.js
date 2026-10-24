const Database = require('better-sqlite3');
const path = require('path');

try {
  const dbPath = path.resolve('data/siteyonetim.db');
  console.log('dbPath:', dbPath);
  const sqlite = new Database(dbPath);
  const q = 'select "id", "name", "email_or_phone", "password_hash", "role", "status", "site_id", "apartment_no", "must_change_password" from "users" where ("users"."email_or_phone" = ? or "users"."email_or_phone" = ?) limit ?';
  const res = sqlite.prepare(q).all('mustafakeksinn@gmail.com', 'mustafakeksinn@gmail.com', 1);
  console.log('QueryResult:', res);
} catch (e) {
  console.error('Error:', e);
}
