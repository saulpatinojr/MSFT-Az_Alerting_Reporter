import axios from 'axios';
import type { DashboardInsights } from './types';
import Papa from 'papaparse';
const alertsCsvUrl = '/data/Portal-Alerts_all/Azure-Monitor-Alerts.csv';

// Define types for the responses
interface ResourceType {
  id: string;
  name: string;
  category: string;
  alertsCount: number;
}

interface ResourceAnalysis {
  id: string;
  metrics: {
    [key: string]: number;
  };
}

// Export the service as a default object
const dataService = {
  async fetchResourceTypes(): Promise<ResourceType[]> {
    const response = await axios.get('/all_resources_data.json');
    return response.data;
  },

  async fetchApplicationInsights(): Promise<any> {
    // Try to load all Azurecomponents CSV files from the Portal-Monitor-Applications_all dataset.
    const folder = '/data/Portal-Monitor-Applications_all/';
    const candidateFiles = [
      'Azurecomponents.csv',
      'Azurecomponents (1).csv',
      'Azurecomponents (2).csv',
      'Azurecomponents (3).csv',
      'Azurecomponents (4).csv',
      'Azurecomponents (5).csv',
      'Azurecomponents (6).csv'
    ];

    const allRows: any[] = [];

    for (const f of candidateFiles) {
      try {
        const resp = await fetch(folder + f);
        if (!resp.ok) continue; // file not present
        const text = await resp.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }) as any;
        if (Array.isArray(parsed.data)) {
          allRows.push(...parsed.data);
        }
      } catch (err) {
        // ignore errors for missing or unparsable files
        continue;
      }
    }

    // Build instances list and basic aggregated metrics
    const instances = allRows.map((r: any) => ({
      name: r['Name'] || r['Resource name'] || r['componentName'] || r['component'] || r['Component'] || '',
      resource_group: r['Resource group'] || r['Resource Group'] || r['resourceGroup'] || '',
      location: r['Location'] || r['location'] || '',
      subscription: r['Subscription'] || r['subscription'] || ''
    }));

    // Unique lists
    const regions = Array.from(new Set(instances.map((i: any) => i.location).filter(Boolean)));
    const subscriptions = Array.from(new Set(instances.map((i: any) => i.subscription).filter(Boolean)));

    // Aggregate numeric metrics if present in CSV rows
    let total_requests = 0;
    let failed_requests = 0;
    let response_time_sum = 0;
    let response_time_count = 0;
    let availability_sum = 0;
    let availability_count = 0;
    let page_views = 0;
    let active_users = 0;

    for (const r of allRows) {
      const tr = Number(r['total_requests'] || r['Total Requests'] || r['TotalRequests'] || r['totalRequests'] || 0);
      const fr = Number(r['failed_requests'] || r['Failed Requests'] || r['failedRequests'] || 0);
      const rt = Number(r['avg_response_time_ms'] || r['Avg Response Time (ms)'] || r['avgResponseTimeMs'] || 0);
      const av = Number(r['availability_percent'] || r['Availability'] || r['availability_percent'] || 0);
      const pv = Number(r['page_views'] || r['Page Views'] || 0);
      const au = Number(r['active_users'] || r['Active Users'] || 0);

      if (!isNaN(tr)) total_requests += tr;
      if (!isNaN(fr)) failed_requests += fr;
      if (!isNaN(rt) && rt > 0) { response_time_sum += rt; response_time_count++; }
      if (!isNaN(av) && av > 0) { availability_sum += av; availability_count++; }
      if (!isNaN(pv)) page_views += pv;
      if (!isNaN(au)) active_users += au;
    }

    const avg_response_time_ms = response_time_count ? response_time_sum / response_time_count : 0;
    const availability_percent = availability_count ? availability_sum / availability_count : 0;

    return {
      resource_type: 'Application Insights',
      total_instances: instances.length,
      instances,
      metrics: {
        total_requests,
        failed_requests,
        avg_response_time_ms,
        availability_percent,
        active_users,
        page_views
      },
      alerts_configured: 0,
      severity_breakdown: {},
      common_alert_types: [],
      regions,
      subscriptions
    };
  },

  async fetchResourceAnalysis(): Promise<ResourceAnalysis[]> {
    const response = await axios.get('/resource_analysis.json');
    return response.data;
  },






  
  async fetchDashboardInsights(): Promise<DashboardInsights> {
    // Load and parse Portal-Alerts CSV
    const response = await fetch(alertsCsvUrl);
    const csvText = await response.text();
    const { data: alerts } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    // Aggregate metrics
    const totalAlerts = alerts.length;
    const severityDistribution: { [key: string]: number } = {};
    const resourceTypeDistribution: { [key: string]: number } = {};
    const signalTypeDistribution: { [key: string]: number } = {};
    const environmentDistribution: { [key: string]: number } = {};
    const alertNames = new Set<string>();
    const alertNameCounts: { [key: string]: number } = {};
    const alertConditions = new Set<string>();
    const alertConditionStats: {
      [condition: string]: {
        count: number;
        severityCounts: { [severity: string]: number };
        signalTypeCounts: { [signal: string]: number };
      };
    } = {};
    const lowPriorityRules: {
      [name: string]: {
        count: number;
        severityCounts: { [severity: string]: number };
        resourceGroupCounts: { [group: string]: number };
      };
    } = {};
    const lowPriorityResourceGroups: { [group: string]: number } = {};
    let lastAlertTime = '';
    let lastLowPriorityFire = '';
    let lowPriorityTotal = 0;

    alerts.forEach((a: any) => {
      // Severity
      const sev = a['Severity'];
      severityDistribution[sev] = (severityDistribution[sev] || 0) + 1;
      // Resource Type
      const rtype = a['Target resource type'];
      resourceTypeDistribution[rtype] = (resourceTypeDistribution[rtype] || 0) + 1;
      // Signal Type
      const sigtype = a['Signal type'];
      signalTypeDistribution[sigtype] = (signalTypeDistribution[sigtype] || 0) + 1;
      // Environment (resource group as proxy)
      const env = a['Target resource group'] || 'Unknown';
      environmentDistribution[env] = (environmentDistribution[env] || 0) + 1;
      // Alert Name
      const name = a['Name'] || 'Unnamed Alert';
      alertNames.add(name);
      alertNameCounts[name] = (alertNameCounts[name] || 0) + 1;
      // Alert condition metadata
      const condition = (a['Alert condition'] || 'Unknown condition').trim();
      if (condition) {
        alertConditions.add(condition);
        if (!alertConditionStats[condition]) {
          alertConditionStats[condition] = {
            count: 0,
            severityCounts: {},
            signalTypeCounts: {}
          };
        }
        alertConditionStats[condition].count += 1;
        alertConditionStats[condition].severityCounts[sev] = (alertConditionStats[condition].severityCounts[sev] || 0) + 1;
        alertConditionStats[condition].signalTypeCounts[sigtype] = (alertConditionStats[condition].signalTypeCounts[sigtype] || 0) + 1;
      }
      // Low priority analysis (Sev3/Sev4)
      if (sev === 'Sev3' || sev === 'Sev4') {
        lowPriorityTotal += 1;
        if (!lowPriorityRules[name]) {
          lowPriorityRules[name] = {
            count: 0,
            severityCounts: {},
            resourceGroupCounts: {}
          };
        }
        lowPriorityRules[name].count += 1;
        lowPriorityRules[name].severityCounts[sev] = (lowPriorityRules[name].severityCounts[sev] || 0) + 1;
        lowPriorityRules[name].resourceGroupCounts[env] = (lowPriorityRules[name].resourceGroupCounts[env] || 0) + 1;
        lowPriorityResourceGroups[env] = (lowPriorityResourceGroups[env] || 0) + 1;
        const fireTime = a['Fire time'];
        if (fireTime && (!lastLowPriorityFire || fireTime > lastLowPriorityFire)) {
          lastLowPriorityFire = fireTime;
        }
      }
      // Last Alert Time
      if (!lastAlertTime || a['Fire time'] > lastAlertTime) lastAlertTime = a['Fire time'];
    });

    // Most common severity
    const mostCommonSeverity = Object.entries(severityDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Signal type distribution array
    const signalTypes = Object.entries(signalTypeDistribution).map(([type, count]) => ({
      type,
      count,
      percentage: (count / totalAlerts) * 100
    }));

    // Environment distribution array
    const environmentDistArr = Object.entries(environmentDistribution).map(([environment, total_alerts]) => ({
      environment,
      total_alerts
    }));

    // Key insights
    const keyInsights = [
      `${totalAlerts} total alerts configured across your Azure resources`,
      `Most common severity: ${mostCommonSeverity}`,
      `Most monitored resource type: ${Object.entries(resourceTypeDistribution).sort(([,a],[,b])=>b-a)[0]?.[0] || 'N/A'}`,
      `Unique alert names: ${alertNames.size}`,
      `Latest alert fired at: ${lastAlertTime}`
    ];

    // Alert metrics
    const alert_metrics = {
      total_alerts: totalAlerts,
      sev0: severityDistribution['Sev0'] || 0,
      sev1: severityDistribution['Sev1'] || 0,
      sev2: severityDistribution['Sev2'] || 0,
      sev3: severityDistribution['Sev3'] || 0,
      sev4: severityDistribution['Sev4'] || 0
    };

    // Build a resource_health_summary by categorizing target resource types/names
    const categories: { [key: string]: { name: string; resources: { [key: string]: number } } } = {
      compute: { name: 'Compute & Workloads', resources: {} },
      networking: { name: 'Networking & Connectivity', resources: {} },
      storage: { name: 'Storage & Data', resources: {} },
      databases: { name: 'Databases & Caching', resources: {} },
      analytics: { name: 'Analytics & Monitoring', resources: {} },
      security: { name: 'Security & Compliance', resources: {} },
      integration: { name: 'Integration & Messaging', resources: {} },
      configuration: { name: 'Configuration & Management', resources: {} },
      other: { name: 'Other', resources: {} }
    };

    function detectCategory(resourceType: string, resourceName: string) {
      const key = `${(resourceType || '')} ${(resourceName || '')}`.toLowerCase();
      if (/virtual|vm|virtualmachine|kubernetes|aks|container|app service|appservice|webapp/.test(key)) return 'compute';
      if (/network|gateway|load balancer|loadbalancer|application gateway|vnet|expressroute|cdn/.test(key)) return 'networking';
      if (/storage|blob|file share|file share|data lake|disk|files/.test(key)) return 'storage';
      if (/sql|cosmos|database|cosmos db|postgres|mysql|redis|caching/.test(key)) return 'databases';
      if (/insights|log analytics|application insights|monitor|analytics|log analytics workspace|loganalytics/.test(key)) return 'analytics';
      if (/key vault|keyvault|vault|security|policy|sentinel|defender/.test(key)) return 'security';
      if (/service bus|event hub|eventhub|queue|servicebus|integration|logic app|service fabric/.test(key)) return 'integration';
      if (/configuration|app configuration|automation|runbook|policy/.test(key)) return 'configuration';
      return 'other';
    }

    function pickResourceName(a: any) {
      return a['Target resource'] || a['Target resource name'] || a['Target Resource'] || a['Resource'] || a['Resource name'] || a['Resource Name'] || 'Unknown resource';
    }

    // Normalize resource name for display: try to map known resource type strings to friendly names
    function normalizeResourceName(resourceType: string, resourceName: string) {
      const rt = (resourceType || '').toLowerCase();
      const rn = (resourceName || '').toLowerCase();
      // Common Azure resource type mappings
      if (/insights|application insights|microsoft.insights\/components/.test(rt) || /app insights/.test(rn)) return 'Application Insights';
      if (/virtualmachines|microsoft.compute\/virtualmachines|virtual machine|vm/.test(rt) || /virtual machine/.test(rn)) return 'Virtual Machine';
      if (/webapps|appservice|microsoft.web\/sites|app service/.test(rt) || /app service|web app/.test(rn)) return 'App Service';
      if (/storageaccounts|microsoft.storage\/storageaccounts|blob|storage account/.test(rt) || /storage account/.test(rn)) return 'Storage Account';
      if (/microsoft.servicebus|service bus|servicebus|queue/.test(rt) || /service bus/.test(rn)) return 'Service Bus Namespace';
      if (/cosmosdb|microsoft.documentdb|cosmos/.test(rt) || /cosmos/.test(rn)) return 'Cosmos DB';
      if (/keyvault|microsoft.keyvault/.test(rt) || /key vault/.test(rn)) return 'Key Vault';
      if (/loganalytics|log analytics workspace|microsoft.operationalinsights/.test(rt) || /log analytics/.test(rn)) return 'Log Analytics Workspace';
      if (/sqlservers|microsoft.sql/.test(rt) || /sql server|sql database/.test(rn)) return 'SQL Database';
      if (/eventhub|event hubs|microsoft.eventhub/.test(rt) || /event hub/.test(rn)) return 'Event Hub';
      if (/loadbalancer|load balancer/.test(rt) || /load balancer/.test(rn)) return 'Load Balancer';
      if (/applicationgateway|application gateway/.test(rt) || /application gateway/.test(rn)) return 'Application Gateway';
      if (/vnet|virtual network/.test(rt) || /vnet/.test(rn)) return 'Virtual Network';
      // Fallback to original resource name (trimmed)
      return resourceName || resourceType || 'Unknown resource';
    }

    alerts.forEach((a: any) => {
      const rtype = a['Target resource type'] || a['Target Resource Type'] || '';
      const rname = pickResourceName(a);
      const pretty = normalizeResourceName(String(rtype || ''), String(rname || ''));
      const cat = detectCategory(String(rtype || ''), String(rname || ''));
      // ensure bucket exists
      const bucket = categories[cat] || { name: cat, resources: {} };
      bucket.resources[pretty] = (bucket.resources[pretty] || 0) + 1;
      categories[cat] = bucket;
    });

    // Export categories as simple resource->count maps (ResourceTypes expects category -> { resourceName: count })
    const categoriesResources: { [key: string]: { [key: string]: number } } = {};
    Object.entries(categories).forEach(([k, v]) => {
      categoriesResources[k] = v.resources || {};
    });

    const resource_health_summary = { categories: categoriesResources };

      // Top alert families (top 10)
      const topAlertFamilies = Object.entries(alertNameCounts)
        .sort(([,a],[,b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count, percentage: totalAlerts > 0 ? (count / totalAlerts) * 100 : 0 }));

    const configuration_summary = {
      unique_conditions: alertConditions.size,
      top_conditions: Object.entries(alertConditionStats)
        .sort(([,a],[,b]) => b.count - a.count)
        .slice(0, 10)
        .map(([condition, stats]) => {
          const dominantSeverity = Object.entries(stats.severityCounts).sort(([,aCount],[,bCount]) => bCount - aCount)[0]?.[0] || 'Unknown';
          const dominantSignal = Object.entries(stats.signalTypeCounts).sort(([,aCount],[,bCount]) => bCount - aCount)[0]?.[0] || 'Unknown';
          return {
            condition,
            count: stats.count,
            severity: dominantSeverity,
            signal_type: dominantSignal
          };
        })
    };

    const alert_fatigue_summary = {
      low_priority_total: lowPriorityTotal,
      low_priority_percentage: totalAlerts ? (lowPriorityTotal / totalAlerts) * 100 : 0,
      most_recent_low_priority: lastLowPriorityFire || undefined,
      noisy_rules: Object.entries(lowPriorityRules)
        .sort(([,a],[,b]) => b.count - a.count)
        .slice(0, 5)
        .map(([name, stats]) => {
          const dominantSeverity = Object.entries(stats.severityCounts).sort(([,aCount],[,bCount]) => bCount - aCount)[0]?.[0] || 'Sev3';
          const topResourceGroup = Object.entries(stats.resourceGroupCounts).sort(([,aCount],[,bCount]) => bCount - aCount)[0]?.[0] || 'Unknown';
          return {
            name,
            count: stats.count,
            severity: dominantSeverity,
            resource_group: topResourceGroup
          };
        }),
      noisiest_resource_groups: Object.entries(lowPriorityResourceGroups)
        .sort(([,a],[,b]) => b - a)
        .slice(0, 5)
        .map(([resource_group, count]) => ({ resource_group, count }))
    };

    return {
      total_alerts: totalAlerts,
      unique_alert_names: alertNames.size,
      most_common_severity: mostCommonSeverity,
      severity_distribution: severityDistribution,
      resource_type_distribution: resourceTypeDistribution,
      signal_type_distribution: signalTypes,
      key_insights: keyInsights,
      alert_metrics,
      environment_distribution: environmentDistArr,
        resource_health_summary,
        top_alert_families: topAlertFamilies,
        raw_alerts_sample: alerts.slice(0, 20),
        configuration_summary,
        alert_fatigue_summary
    };
  }
};

export default dataService;
