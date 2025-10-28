const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const ALERT_FILES_DIR = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Alerts_all');
const APPINSIGHTS_FILES_DIR = path.join(__dirname, '..', 'client', 'public', 'data', 'Portal-Monitor-Applications_all');

// Helper to read and parse CSV files
function parseCSV(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return Papa.parse(fileContent, { header: true }).data;
}

// Read all alert CSVs and merge them
function getAllAlerts() {
    const alertFiles = fs.readdirSync(ALERT_FILES_DIR)
        .filter(file => file.endsWith('.csv'))
        .map(file => path.join(ALERT_FILES_DIR, file));

    let allAlerts = [];
    alertFiles.forEach(file => {
        const alerts = parseCSV(file);
        allAlerts = allAlerts.concat(alerts);
    });
    return allAlerts;
}

// Read all App Insights CSVs and merge them
function getAllAppInsights() {
    const appInsightsFiles = fs.readdirSync(APPINSIGHTS_FILES_DIR)
        .filter(file => file.endsWith('.csv'))
        .map(file => path.join(APPINSIGHTS_FILES_DIR, file));

    let allInstances = [];
    appInsightsFiles.forEach(file => {
        const instances = parseCSV(file);
        allInstances = allInstances.concat(instances);
    });
    return allInstances;
}

// Analyze alerts
function analyzeAlerts(alerts) {
    // Group by alert name and compute frequencies
    const alertFrequencies = alerts.reduce((acc, alert) => {
        const name = alert.Name || '';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    // Get top 10 alert families
    const top10Alerts = Object.entries(alertFrequencies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => {
            const severity = alerts.find(a => a.Name === name)?.Severity || 'Unknown';
            return {
                name,
                count,
                percentage: ((count / alerts.length) * 100).toFixed(2),
                severity
            };
        });

    // Group by severity
    const severityDistribution = alerts.reduce((acc, alert) => {
        const severity = alert.Severity || 'Unknown';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});

    return {
        totalAlerts: alerts.length,
        uniqueAlertNames: Object.keys(alertFrequencies).length,
        top10Alerts,
        severityDistribution,
        averageAlertsPerName: (alerts.length / Object.keys(alertFrequencies).length).toFixed(2)
    };
}

// Analyze App Insights instances
function analyzeAppInsights(instances) {
    // Remove duplicates based on NAME
    const uniqueInstances = Array.from(new Map(
        instances.map(item => [item.NAME, item])
    ).values());

    // Group by subscription
    const bySubscription = uniqueInstances.reduce((acc, instance) => {
        const sub = instance.SUBSCRIPTION || 'Unknown';
        acc[sub] = (acc[sub] || 0) + 1;
        return acc;
    }, {});

    // Group by location
    const byLocation = uniqueInstances.reduce((acc, instance) => {
        const loc = instance.LOCATION || 'Unknown';
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
    }, {});

    // Group by resource group
    const byResourceGroup = uniqueInstances.reduce((acc, instance) => {
        const rg = instance.RESOURCE_GROUP || instance['RESOURCE GROUP'] || 'Unknown';
        acc[rg] = (acc[rg] || 0) + 1;
        return acc;
    }, {});

    return {
        totalInstances: uniqueInstances.length,
        bySubscription,
        byLocation,
        byResourceGroup
    };
}

// Generate reports
function generateReports() {
    // Analyze alerts
    console.log('Reading alert files...');
    const alerts = getAllAlerts();
    const alertAnalysis = analyzeAlerts(alerts);

    // Analyze App Insights
    console.log('Reading App Insights files...');
    const appInsights = getAllAppInsights();
    const appInsightsAnalysis = analyzeAppInsights(appInsights);

    // Generate alert analysis markdown
    const alertMarkdown = `# Alert Analysis Report
Generated: ${new Date().toISOString()}

## Overview
- Total Alerts Analyzed: ${alertAnalysis.totalAlerts}
- Unique Alert Names: ${alertAnalysis.uniqueAlertNames}
- Average Alerts per Name: ${alertAnalysis.averageAlertsPerName}

## Top 10 Alert Families
| Alert Name | Count | % of Total | Severity |
|------------|--------|------------|-----------|
${alertAnalysis.top10Alerts.map(alert => 
    `| ${alert.name} | ${alert.count} | ${alert.percentage}% | ${alert.severity} |`
).join('\n')}

## Severity Distribution
| Severity | Count |
|----------|-------|
${Object.entries(alertAnalysis.severityDistribution)
    .map(([severity, count]) => `| ${severity} | ${count} |`)
    .join('\n')}
`;

    // Generate App Insights analysis markdown
    const appInsightsMarkdown = `# Application Insights Inventory Analysis
Generated: ${new Date().toISOString()}

## Overview
Total Unique Instances: ${appInsightsAnalysis.totalInstances}

## Distribution by Subscription
| Subscription | Instance Count |
|--------------|----------------|
${Object.entries(appInsightsAnalysis.bySubscription)
    .sort(([, a], [, b]) => b - a)
    .map(([sub, count]) => `| ${sub} | ${count} |`)
    .join('\n')}

## Distribution by Location
| Location | Instance Count |
|----------|----------------|
${Object.entries(appInsightsAnalysis.byLocation)
    .sort(([, a], [, b]) => b - a)
    .map(([loc, count]) => `| ${loc} | ${count} |`)
    .join('\n')}

## Top Resource Groups
| Resource Group | Instance Count |
|----------------|----------------|
${Object.entries(appInsightsAnalysis.byResourceGroup)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([rg, count]) => `| ${rg} | ${count} |`)
    .join('\n')}
`;

    // Write reports
    fs.writeFileSync(
        path.join(__dirname, 'alert-analysis.md'),
        alertMarkdown
    );
    fs.writeFileSync(
        path.join(__dirname, 'appinsights-analysis.md'),
        appInsightsMarkdown
    );

    // Write CSV data
    const top10AlertsCsv = Papa.unparse(alertAnalysis.top10Alerts);
    fs.writeFileSync(
        path.join(__dirname, 'top10-alerts.csv'),
        top10AlertsCsv
    );

    const appInsightsSummaryCsv = Papa.unparse([
        ...Object.entries(appInsightsAnalysis.bySubscription)
            .map(([name, count]) => ({ type: 'Subscription', name, count })),
        ...Object.entries(appInsightsAnalysis.byLocation)
            .map(([name, count]) => ({ type: 'Location', name, count }))
    ]);
    fs.writeFileSync(
        path.join(__dirname, 'appinsights-summary.csv'),
        appInsightsSummaryCsv
    );

    console.log('Reports generated successfully!');
}

generateReports();