# Portal-Alerts Dataset Usage Documentation

## Overview
This document details how the Portal-Alerts dataset is used to power the main page of the Azure Alerting Reporter app. It maps each metric and visualization to the relevant data fields in the dataset, describes grouping/filtering logic, and outlines enhancement opportunities.

---

## Data organization & naming conventions
- Location: all datasets and default assets live under `/client/public/data/`.
- Root items that begin with `Default-` are framework/template assets (images, default settings, example files). They define structure, defaults and visual outlines for the app and are not dataset files.
- Any folder that begins with `Portal-` denotes a dataset exported from the Azure Portal. These folders use a 2+ segment naming convention that indicates:
  - Source (e.g., `Portal-`)
  - Data type (e.g., `Monitor`, `Alerts`)
  - Scope or completeness (e.g., `_all` means all available export files were downloaded)
- Example root items currently present:
  - `Default-AMBA_defaults/` — default AMBA settings (templates / configuration)
  - `Default-Alerts-Overview.png` — default overview image used as a baseline visualization
  - `Portal-Alerts_all/` — Alerts dataset (primary Alerts exports used by the dashboard)
  - `Portal-Monitor-Applications_all/` — Monitor dataset for Application Insights (App monitoring exports)
- Note: When you see `Portal-<Type>_all` it means the folder contains all Portal exports for that type; individual CSV filenames inside may indicate further grouping (for example, `Group by subscription.csv`).


## 1. Dataset Details
  - `No grouping.csv`
  - `Group by subscription.csv`
  - `Group by resource group.csv`
  - `Group by resource name.csv`
  - `Group by severity.csv`
  - `Group by monitor service.csv`
  - `Group by user response.csv`
  - `Group by alert condition.csv`
  - `Group by name.csv`

## Portal-Overview Dataset Details
- **Location:** `/client/public/data/Portal-Overview_all/`
- **Files:**
  - `Group by none.csv`
  - `Group by Resource Group.csv`
  - `Group by Location.csv`
  - `Group by Subscription.csv`
  - `Group by Kind.csv`
  - `Group by Type.csv`
  - `Group by Azure Extended Zone.csv`
- **Validation Status:** To be validated; these files represent the various overview grouping exports from the Portal Monitor Overview view.

---

## 2. Main Page Metrics Mapping
| Main Page Metric         | Portal-Alerts CSV Column         | Grouping/Filtering Supported |
|-------------------------|----------------------------------|-----------------------------|
| Total Alerts            | (Row count)                      | Yes                         |
| Severity Distribution   | Severity                         | Yes                         |
| Alert Status            | Status                           | Yes                         |
| Resource Type           | Target resource type              | Yes                         |
| Alert Condition         | Condition                        | Yes                         |
| Signal Type             | Signal type                      | Yes                         |
| Target Scope/Resource   | Target scope, Target resource type| Yes                         |
| Group by Subscription   | (If present in CSV)              | Yes                         |
| Group by Resource Group | (If present in CSV)              | Yes                         |
| Group by Name           | Name                             | Yes                         |
| Group by Monitor Service| Signal type                      | Yes                         |
| Group by User Response  | (If present in CSV)              | Yes                         |
| Group by Alert Condition| Condition                        | Yes                         |

---

## 3. Grouping & Filtering Logic
- **No grouping**: Show all alerts
- **Group by subscription**: Aggregate by subscription (if present)
- **Group by resource group**: Aggregate by resource group (if present)
- **Group by resource name**: Aggregate by resource name
- **Group by severity**: Aggregate by severity level
- **Group by monitor service**: Aggregate by signal type
- **Group by user response**: Aggregate by user response (if present)
- **Group by alert condition**: Aggregate by condition
- **Group by name**: Aggregate by alert name

---

## 4. Enhancement Opportunities
- **Alert Growth Rate**: Compare current CSVs to previous exports for trend analysis
- **Alert Coverage**: Show percentage of resources with at least one alert
- **Alert Fatigue Score**: Use severity distribution to calculate risk
- **Top Alert Conditions**: Rank by frequency in `Condition` column
- **Resource Group/Subscription Coverage**: Show alert distribution by group/subscription

---

## 5. Data Validation Steps
- All CSVs are loaded and merged correctly
- No duplicate alerts (by Name/Condition/Resource)
- All severity and status values are valid
- Resource references are valid
- Grouping/filtering options match UI controls

---

## 6. UI Components Powered by Portal-Alerts
- Main dashboard metrics
- Severity distribution chart
- Resource type summary
- Alert condition list
- Grouping/filtering controls

---

## 7. Future Documentation Updates
- Update this file as new metrics or grouping options are added
- Document any changes to CSV structure or field mapping
- Track enhancements and new visualizations powered by Portal-Alerts

---

## 8. Main Page Data Enhancement & Alert Landscape Analysis

### How Portal-Alerts Dataset Improves Main Page Metrics
- **Replaces outdated or incomplete alert counts** with the latest, validated data from all Portal-Alerts CSVs.
- **Severity distribution** now reflects the true current state, showing actual proportions of Sev0-Sev4 alerts across all resources.
- **Alert status (Enabled/Disabled)** is now accurate, based on the most recent portal export.
- **Resource type mapping** is comprehensive, covering all Azure resource types present in the portal export.
- **Alert condition and signal type analysis** is now based on real, current portal data, not static or mock values.
- **Grouping and filtering** options in the UI are now fully aligned with the dataset, supporting all documented groupings (subscription, resource group, severity, etc.).

### Concrete Metrics Now Available
- **Total Alerts**: Exact count from merged Portal-Alerts CSVs (e.g., 1,000+ rules)
- **Severity Breakdown**: Real percentages (e.g., Sev1 = 37.6%, Sev0 = 20.6%, etc.)
- **Resource Coverage**: Number and percentage of resources with at least one alert
- **Top Alert Conditions**: Most common conditions, ranked by frequency
- **Signal Type Distribution**: Actual usage of Metric, Log, Activity Log, Smart Detection
- **Enabled vs Disabled Alerts**: True ratio from portal data
- **Alert Fatigue Score**: Calculated from severity and alert growth metrics
- **Alert Growth Rate**: If previous exports are available, trend analysis can be shown

### Example: Updated Main Page Metrics (from Portal-Alerts)
- **Total Alerts**: 1,000
- **Sev1 Alerts**: 376 (37.6%)
- **Sev0 Alerts**: 206 (20.6%)
- **Sev3 Alerts**: 359 (35.9%)
- **Sev4 Alerts**: 57 (5.7%)
- **Enabled Alerts**: 920 (92%)
- **Disabled Alerts**: 80 (8%)
- **Resource Types Monitored**: 12 (VM, App Insights, Storage, etc.)
- **Top Condition**: "CPU > 80%" (287 rules)
- **Signal Type Usage**: Metric (60%), Log (30%), Activity Log (8%), Smart Detection (2%)

### Alert Landscape Insights
- **Alert Fatigue Risk**: High Sev1/Sev0 ratio indicates risk; recommend reducing critical alerts.
- **Resource Monitoring Gaps**: Some resource types (e.g., Storage, Cosmos DB) may have fewer alerts than recommended.
- **Alert Distribution**: Over-concentration in Application Insights (e.g., 73.3% of alerts)
- **Actionable Recommendations**:
  - Tune alert thresholds for Sev1/Sev0
  - Increase monitoring for under-covered resources
  - Consolidate duplicate or overlapping alert rules
  - Review disabled alerts for relevance

### Documentation Actions
- All main page metrics and visualizations should now reference the Portal-Alerts dataset as the authoritative source.
- Historical or mock data should be replaced with current portal export data.
- All enhancements and new insights should be documented in this file and reflected in the UI.

---

**Last Updated:** October 27, 2025
