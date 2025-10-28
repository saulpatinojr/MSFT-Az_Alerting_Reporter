export interface DashboardInsights {
  total_alerts: number;
  unique_alert_names: number;
  most_common_severity: string;
  severity_distribution: {
    [key: string]: number;
  };
  resource_type_distribution: {
    [key: string]: number;
  };
  signal_type_distribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  key_insights: string[];
  alert_metrics: {
    total_alerts: number;
    sev0: number;
    sev1: number;
    sev2: number;
    sev3: number;
    sev4: number;
  };
  environment_distribution: Array<{
    environment: string;
    total_alerts: number;
  }>;
  resource_health_summary: {
    categories: {
      compute?: { [key: string]: number };
      networking?: { [key: string]: number };
      storage?: { [key: string]: number };
      databases?: { [key: string]: number };
      analytics?: { [key: string]: number };
      security?: { [key: string]: number };
      integration?: { [key: string]: number };
      configuration?: { [key: string]: number };
    };
  };
  top_alert_families?: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  // optional raw sample of parsed alert rows for debugging
  raw_alerts_sample?: any[];
  alert_fatigue_summary?: {
    low_priority_total: number;
    low_priority_percentage: number;
    most_recent_low_priority?: string;
    noisy_rules: Array<{
      name: string;
      count: number;
      severity: string;
      resource_group: string;
    }>;
    noisiest_resource_groups: Array<{
      resource_group: string;
      count: number;
    }>;
  };
  configuration_summary?: {
    unique_conditions: number;
    top_conditions: Array<{
      condition: string;
      count: number;
      severity: string;
      signal_type: string;
    }>;
  };
}

export interface ResourceAnalysis {
  id: string;
  metrics: {
    [key: string]: number;
  };
}
