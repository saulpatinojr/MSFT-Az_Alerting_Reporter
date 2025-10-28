const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');
const file = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Monitor-Applications_all', 'Azurecomponents.csv');
const content = fs.readFileSync(file, 'utf8');
const records = csv.parse(content, { columns: true, skip_empty_lines: true });
const r0 = records[0];
console.log('Entries:');
Object.keys(r0).forEach(k => {
    console.log('Key:', JSON.stringify(k));
    console.log('Chars:', Array.from(k).map(c => c.charCodeAt(0)).join(','));
    console.log('Value:', r0[k]);
});
