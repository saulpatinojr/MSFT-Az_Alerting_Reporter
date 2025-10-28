export interface AlertStats {
  totalAlerts: number;
  severityDistribution: {
    sev1: number;
    sev3: number;
    sev4: number;
  };
  signalTypeDistribution: {
    logSearch: number;
    metrics: number;
    resourceHealth: number;
  };
  trendsOverTime: {
    daily: Array<{
      date: string;
      count: number;
      severity: {
        sev1: number;
        sev3: number;
        sev4: number;
      };
    }>;
  };
}

export interface AlertPattern {
  criticalAlerts: {
    labIntegration: {
      percentage: number;
      types: string[];
      avgResolutionTime: number;
      failurePatterns: {
        timeOfDay: { [key: string]: number };
        dayOfWeek: { [key: string]: number };
      };
    };
    dataProcessing: {
      percentage: number;
      types: string[];
      avgProcessingErrors: number;
    };
    backupOperations: {
      percentage: number;
      types: string[];
      successRate: number;
    };
  };
  infrastructureAlerts: {
    serviceHealth: {
      percentage: number;
      types: string[];
      avgResponseTime: number;
    };
    databaseOperations: {
      percentage: number;
      types: string[];
      performanceMetrics: {
        avgCPU: number;
        avgMemory: number;
        avgLatency: number;
      };
    };
  };
}

export interface ResourceMetrics {
  [key: string]: {
    totalAlerts: number;
    severityBreakdown: {
      sev1?: number;
      sev3?: number;
      sev4?: number;
    };
    primaryUsage: string;
    availability: number;
    performance: {
      avgResponseTime: number;
      errorRate: number;
      saturation: number;
    };
  };
}

export interface AlertFatigue {
  duplicateAlertRate: number;
  timeWindowAnalysis: {
    [key: string]: {
      averageDuplicates: number;
      topOffender: string;
      suppressionEffectiveness: number;
    };
  };
  resourceNoiseLevel: {
    high: string[];
    medium: string[];
    low: string[];
  };
  noiseReduction: {
    potentialReduction: number;
    recommendedActions: string[];
  };
}

export interface IntegrationHealth {
  labSystems: {
    [key: string]: {
      errorRate: number;
      primaryIssue: string;
      avgResolutionTime: string;
      throughput: {
        daily: number;
        weekly: number;
        monthly: number;
      };
      availability: number;
      costImpact: number;
    };
  };
  environmentDistribution: {
    [key: string]: number;
  };
  systemHealth: {
    uptime: number;
    performance: {
      p50: number;
      p90: number;
      p99: number;
    };
  };
}

export interface MonitoringMaturity {
  overall: number;
  breakdown: {
    coverage: number;
    severity_alignment: number;
    signal_type_appropriateness: number;
    alert_fatigue_management: number;
  };
  recommendations: string[];
  comparisonMetrics: {
    industryAverage: number;
    bestPractice: number;
    improvement: number;
  };
  timeline: {
    date: string;
    score: number;
    changes: string[];
  }[];
}

export interface AlertAnalysis {
  stats: AlertStats;
  patterns: AlertPattern;
  resourceMetrics: ResourceMetrics;
  alertFatigue: AlertFatigue;
  integrationHealth: IntegrationHealth;
  maturity: MonitoringMaturity;
  metadata: {
    lastUpdated: string;
    dataVersion: string;
    analysisVersion: string;
  };
}