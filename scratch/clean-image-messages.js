const Database = require('better-sqlite3');
const db = new Database('data/siteyonetim.db');
const result = db.prepare("UPDATE community_messages SET content = '' WHERE (content = 'Paylaşım' OR content LIKE '%[Ek Paylaşıldı]%') AND image_url IS NOT NULL").run();
console.log('Updated rows:', result.changes);
