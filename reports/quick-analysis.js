const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const ALERT_FILES_DIR = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Alerts_all');
const APPINSIGHTS_FILES_DIR = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Monitor-Applications_all');

// Read and count alerts
const alertFiles = fs.readdirSync(ALERT_FILES_DIR).filter(f => f.endsWith('.csv'));
console.log('Alert files found:', alertFiles);

let totalAlerts = 0;
const alertNames = new Map();
const severities = new Map();

for (const file of alertFiles) {
    const content = fs.readFileSync(path.join(ALERT_FILES_DIR, file), 'utf8');
    const records = csv.parse(content, { columns: true, skip_empty_lines: true });
    
    totalAlerts += records.length;
    records.forEach(record => {
        const name = record.Name || 'Unknown';
        alertNames.set(name, (alertNames.get(name) || 0) + 1);
        
        const severity = record.Severity || 'Unknown';
        severities.set(severity, (severities.get(severity) || 0) + 1);
    });
}

// Get top 10 alerts
const top10 = Array.from(alertNames.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

console.log('\nAlert Analysis:');
console.log('Total alerts:', totalAlerts);
console.log('Unique alert names:', alertNames.size);
console.log('\nTop 10 Alert Names:');
top10.forEach(([name, count]) => {
    console.log(`${name}: ${count} (${((count/totalAlerts)*100).toFixed(1)}%)`);
});

console.log('\nSeverity Distribution:');
for (const [sev, count] of severities.entries()) {
    console.log(`${sev}: ${count} (${((count/totalAlerts)*100).toFixed(1)}%)`);
}

// Read and count App Insights instances
const aiFiles = fs.readdirSync(APPINSIGHTS_FILES_DIR).filter(f => f.endsWith('.csv'));
console.log('\nApp Insights files found:', aiFiles);

const instances = new Map();
const locations = new Map();
const subscriptions = new Map();
const resourceGroups = new Map();

for (const file of aiFiles) {
    const content = fs.readFileSync(path.join(APPINSIGHTS_FILES_DIR, file), 'utf8');
    const records = csv.parse(content, { columns: true, skip_empty_lines: true });
    
    records.forEach(record => {
        const name = record.NAME;
        if (!name) return;
        
        instances.set(name, true);
        
        const location = record.LOCATION || 'Unknown';
        locations.set(location, (locations.get(location) || 0) + 1);
        
        const sub = record.SUBSCRIPTION || 'Unknown';
        subscriptions.set(sub, (subscriptions.get(sub) || 0) + 1);
        
        const rg = record['RESOURCE GROUP'] || record.RESOURCE_GROUP || 'Unknown';
        resourceGroups.set(rg, (resourceGroups.get(rg) || 0) + 1);
    });
}

console.log('\nApp Insights Analysis:');
console.log('Total unique instances:', instances.size);

console.log('\nSubscription Distribution:');
Array.from(subscriptions.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([sub, count]) => {
        console.log(`${sub}: ${count}`);
    });

console.log('\nLocation Distribution:');
Array.from(locations.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([loc, count]) => {
        console.log(`${loc}: ${count}`);
    });

console.log('\nTop Resource Groups:');
Array.from(resourceGroups.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([rg, count]) => {
        console.log(`${rg}: ${count}`);
    });