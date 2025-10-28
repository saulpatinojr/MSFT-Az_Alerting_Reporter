const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');
const file = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Monitor-Applications_all', 'Azurecomponents.csv');
const content = fs.readFileSync(file, 'utf8');
const records = csv.parse(content, { columns: true, skip_empty_lines: true });
console.log('First record keys:', Object.keys(records[0]));
console.log('First record sample:', records[0]);
console.log('Header raw:', content.split('\n')[0]);
