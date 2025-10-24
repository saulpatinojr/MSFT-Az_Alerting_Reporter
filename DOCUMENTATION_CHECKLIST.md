# Azure Monitor Analytics Dashboard - Documentation Checklist

## Project Overview
This document tracks all data sources, files, and resources used in building the Azure Monitor Analytics Dashboard.

---

## 📊 Data Files Provided

### 1. **Azure Monitor Alerts Rules** (Primary Dataset)
- **File**: `Azure-Monitor-Alerts-Rules.csv`
- **Format**: CSV
- **Resource Type**: All Azure Resources
- **Rows**: 1,000 alert rules
- **Data Found**:
  - Alert Name
  - Condition
  - Severity (Sev0-Sev4)
  - Target scope
  - Target resource type
  - Signal type
  - Status
- **Used For**: 
  - Main dashboard overview
  - Severity analysis
  - Correlation analysis
  - Resource type distribution
  - Signal type breakdown

---

### 2. **Application Insights**
- **Files**: 
  - `insight-01.png` (Screenshot)
  - `insight-02.png` (Screenshot)
- **Format**: PNG Images
- **Resource Type**: Application Insights (Analytics)
- **Data Found**:
  - Application Insights instance names
  - Resource groups
  - Locations
  - Subscriptions
  - Examples: UCP-STG-Backend-WebApp-AppInsights, dev-d360-alchemy-eus-func-ai
- **Used For**:
  - Application Insights detail page
  - Instance listing
  - Resource categorization

---

### 3. **Virtual Machines**
- **Files**:
  - `VM-not-01.png` (Not Monitored VMs - Page 1)
  - `VM-not-02.png` (Not Monitored VMs - Page 2)
  - `VM-not-03.png` (Not Monitored VMs - Page 3)
  - `VM-not-04.png` (Not Monitored VMs - Page 4)
  - `VM-not-05.png` (Not Monitored VMs - Page 5)
  - `VM-enable-01.png` (Monitored VMs - Page 1)
  - `VM-enable-02.png` (Monitored VMs - Page 2)
- **Format**: PNG Images (Screenshots from Azure Portal)
- **Resource Type**: Virtual Machines (Compute)
- **Data Found**:
  - VM names
  - Monitor coverage status (Enabled/Not enabled/Cannot enable)
  - Workspace configuration
  - Data collection rules
  - Examples: stg-dscds3-smsg-01-eus, Linux-Dev, PRAZSQLDB01EUS
- **Used For**:
  - Virtual Machine monitoring status
  - VM detail page
  - Compute resource tracking

---

### 4. **Service Bus**
- **Files**:
  - `sb1.csv`
  - `sb2.csv`
- **Format**: CSV
- **Resource Type**: Service Bus Namespace (Integration)
- **Rows**: 
  - sb1.csv: 223 rows
  - sb2.csv: 272 rows
- **Data Found**:
  - **sb1.csv**: Subscription, Name, Segment, Incoming Requests, Successful Requests, Server Errors, User Errors, Throttled Requests
  - **sb2.csv**: Subscription, Name, Segment, Incoming Messages, Outgoing Messages, Messages in Queue/Topic, Scheduled messages
- **Used For**:
  - Service Bus metrics and performance
  - Integration resource monitoring
  - Message queue analysis

---

### 5. **Key Vault**
- **Files**:
  - `kv1.csv`
  - `kv2.csv`
- **Format**: CSV
- **Resource Type**: Key Vault (Security)
- **Rows**:
  - kv1.csv: 805 rows
  - kv2.csv: 74 rows
- **Data Found**:
  - **kv1.csv**: Subscription, Name, Segment, Requests, Request timeline, Request failures, Average latency, Saturation
  - **kv2.csv**: Subscription, Name, Total Service API Hits, Successes, Authentication Errors, Throttling, Other Failures
- **Used For**:
  - Key Vault security monitoring
  - API request analysis
  - Authentication and access tracking

---

### 6. **Storage Accounts**
- **Files**:
  - `storage1.csv`
  - `storage2.csv`
  - `storage3.csv`
  - `storage4.csv`
- **Format**: CSV
- **Resource Type**: Storage Account (Storage)
- **Rows**:
  - storage1.csv: 200 rows
  - storage2.csv: 82 rows
  - storage3.csv: 82 rows
  - storage4.csv: 257 rows
- **Data Found**:
  - **storage1.csv & storage2.csv**: Account capacity, Blob capacity, File capacity, Queue capacity, Table capacity
  - **storage3.csv**: Transactions, E2E Latency, Server Latency, Various error types
  - **storage4.csv**: Request Units, Documents, Data Usage, Index Usage, Provisioned throughput
- **Used For**:
  - Storage capacity monitoring
  - Performance metrics
  - Transaction analysis

---

### 7. **Azure Cosmos DB**
- **Files**:
  - `storagecosmo01.csv`
  - `storagecosmo02.csv`
  - `storagecosmo03.csv`
- **Format**: CSV
- **Resource Type**: Azure Cosmos DB Account (Databases)
- **Rows**:
  - storagecosmo01.csv: 13 rows
  - storagecosmo02.csv: 103 rows
  - storagecosmo03.csv: 13 rows
- **Data Found**:
  - **storagecosmo01.csv**: Total Requests, HTTP response codes (200, 201, 304, 400, 403, 412, 429, 449)
  - **storagecosmo02.csv**: Database/Collection details, Documents, Data Usage, Index Usage
  - **storagecosmo03.csv**: Request types (query, ChangeFeed, Read, Replace, Create, Update, Upsert, Delete)
- **Used For**:
  - Cosmos DB performance tracking
  - Document and collection metrics
  - Request type analysis

---

### 8. **Azure Cache for Redis**
- **Files**:
  - `redis01.csv`
  - `redis02.csv`
  - `redis03.csv`
  - `redis04.csv`
- **Format**: CSV
- **Resource Type**: Azure Cache for Redis (Databases/Caching)
- **Rows**: 6 rows each
- **Data Found**:
  - **redis01.csv**: Used Memory, Server Load, CPU, Connected Clients, Cache Misses, Errors
  - **redis02.csv**: Total Operations, Operations Per Second, Gets, Sets
  - **redis03.csv**: Cache Read, Cache Write, Cache Hits, Cache Misses
  - **redis04.csv**: Total Errors, Authentication failures, Token expired errors, Failover errors, Import/Export errors
- **Used For**:
  - Redis cache performance
  - Memory and CPU monitoring
  - Error tracking and authentication issues

---

### 9. **Log Analytics Workspaces**
- **File**: `loganalytics.csv`
- **Format**: CSV
- **Resource Type**: Log Analytics Workspace (Analytics)
- **Rows**: 101 rows
- **Data Found**:
  - Workspace name
  - Resource Group
  - Location
  - Retention (days)
  - Daily Cap (GB)
  - License type
  - Subscription
- **Used For**:
  - Log Analytics workspace inventory
  - Retention policy tracking
  - Capacity planning

---

### 10. **Networking Resources**
- **File**: `networking.png`
- **Format**: PNG Image (Screenshot)
- **Resource Type**: Multiple Network Resources (Networking)
- **Data Found**:
  - Front doors (8)
  - Application gateways (12)
  - Bastions (24)
  - ER and VPN connections (10)
  - ExpressRoute circuits (2)
  - Load balancers (1)
  - NAT Gateways (7)
  - Network virtual appliances (6)
  - Virtual hubs (2)
  - Virtual network gateways (15)
  - VPN gateway (2)
  - Alert counts and severity levels
- **Used For**:
  - Network resource health overview
  - Networking detail page
  - Resource type categorization

---

### 11. **Branding Assets**
- **File**: `cbts_logo_reversed_cmyk.svg`
- **Format**: SVG
- **Resource Type**: Logo/Branding
- **Data Found**: CBTS company logo
- **Used For**:
  - Dashboard header branding
  - Application identity

---

### 12. **Reference Images**
- **File**: `Insighthub.png`
- **Format**: PNG Image
- **Resource Type**: Reference/Guide
- **Data Found**:
  - Azure Insights Hub structure
  - Resource type categories (Compute, Networking, Storage, Databases, Analytics, Security, Monitor, Integration, Workloads, Other)
  - Example resource types and monitoring capabilities
- **Used For**:
  - Resource categorization reference
  - Dashboard structure planning
  - Feature requirements

---

## 📁 Generated Data Files

### Dashboard Analytics
1. **insights.json** - Aggregated insights from main CSV
2. **resource_analysis.json** - Resource type categorization
3. **application_insights_data.json** - Application Insights structured data
4. **file_analysis.json** - CSV file structure analysis

---

## 🎯 Resource Type Mapping

| Category | Resources | Data Sources |
|----------|-----------|--------------|
| **Compute** | Virtual Machines | VM-*.png, Azure-Monitor-Alerts-Rules.csv |
| **Networking** | Application Gateway, Load Balancer, Virtual Network | networking.png, Azure-Monitor-Alerts-Rules.csv |
| **Storage** | Storage Accounts | storage1-4.csv, Azure-Monitor-Alerts-Rules.csv |
| **Databases** | SQL Database, Cosmos DB, Redis | storagecosmo*.csv, redis*.csv, Azure-Monitor-Alerts-Rules.csv |
| **Analytics** | Application Insights, Log Analytics | insight-*.png, loganalytics.csv, Azure-Monitor-Alerts-Rules.csv |
| **Security** | Key Vault | kv1.csv, kv2.csv, Azure-Monitor-Alerts-Rules.csv |
| **Integration** | Service Bus, Event Hubs | sb1.csv, sb2.csv, Azure-Monitor-Alerts-Rules.csv |
| **App Services** | App Service, App Service Plan | Azure-Monitor-Alerts-Rules.csv |
| **Configuration** | App Configuration | Azure-Monitor-Alerts-Rules.csv |

---

## ✅ Implementation Status

### Completed
- [x] Main dashboard with overview metrics
- [x] Severity analysis section
- [x] Correlation analysis
- [x] Resource type categorization
- [x] Application Insights detail page with upload capability
- [x] CBTS branding integration
- [x] Fullscreen mode
- [x] 1080p optimization

### In Progress
- [ ] Virtual Machines detail page
- [ ] Service Bus detail page
- [ ] Key Vault detail page
- [ ] Storage Accounts detail page
- [ ] Cosmos DB detail page
- [ ] Redis Cache detail page
- [ ] Log Analytics detail page
- [ ] Networking detail page

### Pending
- [ ] File upload processing for all resource types
- [ ] Data visualization for uploaded CSV files
- [ ] Export functionality
- [ ] Advanced filtering and search

---

## 📝 Notes

- All CSV files contain subscription-level data
- Screenshots provide visual reference for Azure Portal structure
- Resource naming follows Azure conventions
- Data spans multiple subscriptions and resource groups
- Some resources show monitoring status (enabled/not enabled)

---

**Last Updated**: October 24, 2025  
**Dashboard Version**: 2a7881e0  
**Total Files Processed**: 29 files (17 CSV, 11 PNG, 1 SVG)

