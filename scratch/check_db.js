const Database = require('better-sqlite3');
const db = new Database('data/collector.sqlite');
const rows = db.prepare('SELECT * FROM harvest_jobs').all();
console.log(JSON.stringify(rows, null, 2));
db.close();
