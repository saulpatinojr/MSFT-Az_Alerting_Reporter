const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const APPINSIGHTS_FILES_DIR = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Monitor-Applications_all');

const aiFiles = fs.readdirSync(APPINSIGHTS_FILES_DIR).filter(f => f.endsWith('.csv'));
console.log('AI files:', aiFiles);
for (const file of aiFiles) {
    const content = fs.readFileSync(path.join(APPINSIGHTS_FILES_DIR, file), 'utf8');
    const lines = content.split('\n');
    console.log('\nFile:', file, 'lines:', lines.length);
    console.log('Header raw:', lines[0]);
    const records = csv.parse(content, { columns: true, skip_empty_lines: true });
    console.log('Parsed records:', records.length);
    if (records.length > 0) console.log('First keys:', Object.keys(records[0]));
}
