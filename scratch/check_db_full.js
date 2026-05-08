const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const db = new DatabaseSync(path.resolve('data/collector.sqlite'));

console.log('--- LEADS ---');
const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5').all();
console.log(JSON.stringify(leads, null, 2));

console.log('--- JOBS ---');
const jobs = db.prepare('SELECT * FROM harvest_jobs ORDER BY created_at DESC LIMIT 5').all();
console.log(JSON.stringify(jobs, null, 2));
