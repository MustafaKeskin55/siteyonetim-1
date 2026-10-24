const Database = require('better-sqlite3');
const db = new Database('data/siteyonetim.db');

console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name));
try {
  console.log('Sites:', db.prepare("SELECT * FROM sites").all());
} catch (e) { console.error('Sites error:', e.message); }

try {
  console.log('Users:', db.prepare("SELECT id, name, email_or_phone, role, site_id, apartment_no FROM users").all());
} catch (e) { console.error('Users error:', e.message); }

try {
  console.log('Channels:', db.prepare("SELECT * FROM community_channels").all());
} catch (e) { console.error('Channels error:', e.message); }

try {
  console.log('Payments:', db.prepare("SELECT * FROM payments").all());
} catch (e) { console.error('Payments error:', e.message); }

try {
  console.log('Announcements:', db.prepare("SELECT * FROM announcements").all());
} catch (e) { console.error('Announcements error:', e.message); }
