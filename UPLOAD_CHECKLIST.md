# Azure Alerting Reporter - Data Upload Checklist

## 1. Alert Configuration Data (CSV)
Required file: `data.csv`
Location: `/client/public/data.csv`

- [ ] File contains the following columns:
  - Name (Alert name)
  - Condition (Alert condition)
  - Severity (Sev0-Sev4)
  - Target scope (Resource scope)
  - Target resource type (Azure resource type)
  - Signal type (Alert signal type)
  - Status (Enabled/Disabled)

- [ ] Data validation:
  - [ ] All severity values are one of: Sev0, Sev1, Sev2, Sev3, Sev4
  - [ ] All status values are either "Enabled" or "Disabled"
  - [ ] No empty cells in required fields

## 2. Resource Overview Data (JSON)
Required file: `all_resources_data.json`
Location: `/client/public/all_resources_data.json`

- [ ] Contains metrics for all resource types:
  - [ ] Virtual machines
  - [ ] Service Bus
  - [ ] Key Vault
  - [ ] Storage
  - [ ] Cosmos DB
  - [ ] Redis Cache
  - [ ] Log Analytics

- [ ] Each resource type includes:
  - [ ] Total instances count
  - [ ] Monitoring metrics

## 3. Application Insights Data (JSON)
Required file: `application_insights_data.json`
Location: `/client/public/application_insights_data.json`

- [ ] Contains required fields:
  - [ ] Total instances count
  - [ ] Instance details (name, resource group, location, subscription)
  - [ ] Alert configurations
  - [ ] Severity breakdown
  - [ ] Common alert types
  - [ ] Regional distribution

## 4. Resource Analysis Data (JSON)
Required file: `resource_analysis.json`
Location: `/client/public/resource_analysis.json`

- [ ] Contains required sections:
  - [ ] Resource severity breakdown
  - [ ] Total resources count

## Data Consistency Checks

- [ ] Alert counts match across all files
- [ ] Resource counts are consistent
- [ ] Severity levels match between CSV and JSON files
- [ ] Resource types are consistent across all files
- [ ] All dates and timestamps are in UTC
- [ ] No duplicate alert names in CSV
- [ ] All referenced resources exist in resource data

## File Format Requirements

### CSV Format
- [ ] UTF-8 encoding
- [ ] Standard CSV format (comma-separated)
- [ ] First row contains headers
- [ ] No empty rows
- [ ] No extra commas in fields

### JSON Format
- [ ] Valid JSON syntax
- [ ] UTF-8 encoding
- [ ] Properly nested structure
- [ ] All required fields present
- [ ] Numbers not wrapped in quotes
- [ ] Boolean values as true/false
- [ ] Arrays in correct format

## Before Upload

- [ ] Backup existing files
- [ ] Validate JSON files with a JSON validator
- [ ] Check CSV formatting
- [ ] Verify all required fields are present
- [ ] Test data load in development environment
- [ ] Verify metrics calculations
- [ ] Check for sensitive information
- [ ] Verify resource name consistency

## After Upload

- [ ] Verify data appears correctly in UI
- [ ] Check all dashboards load
- [ ] Verify alert counts match
- [ ] Confirm severity distributions
- [ ] Test filtering functionality
- [ ] Verify resource grouping
- [ ] Check metric calculations
- [ ] Validate report generation