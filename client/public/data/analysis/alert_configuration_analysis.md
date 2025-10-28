# Alert Configuration Analysis Report

## Visualization Configurations
```json
{
  "severityDistribution": {
    "type": "donut",
    "config": {
      "series": [72.6, 26.5, 0.9],
      "labels": ["Sev1", "Sev3", "Sev4"],
      "colors": ["#dc3545", "#ffc107", "#17a2b8"]
    }
  },
  "alertTrends": {
    "type": "line",
    "config": {
      "xaxis": {
        "type": "datetime"
      },
      "yaxis": {
        "title": "Alert Count"
      },
      "series": [
        {
          "name": "Total Alerts",
          "data": [[1698364800000, 3256], [1698451200000, 4698]]
        }
      ]
    }
  },
  "labIntegrationHealth": {
    "type": "heatmap",
    "config": {
      "series": [
        {
          "name": "CRL",
          "data": [
            { "x": "Error Rate", "y": 46.6 },
            { "x": "Availability", "y": 99.2 },
            { "x": "Cost Impact", "y": 12500 }
          ]
        }
      ]
    }
  },
  "resourceMetrics": {
    "type": "bar",
    "config": {
      "series": [
        {
          "name": "Total Alerts",
          "data": [5842, 1872]
        }
      ],
      "xaxis": {
        "categories": ["App Insights", "Service Plans"]
      }
    }
  }
}
```

## Summary Statistics
```json
{
  "totalAlerts": 7954,
  "severityDistribution": {
    "sev1": 72.6,
    "sev3": 26.5,
    "sev4": 0.9
  },
  "signalTypeDistribution": {
    "logSearch": 68.4,
    "metrics": 30.7,
    "resourceHealth": 0.9
  }
}
```

## Alert Pattern Analysis
```json
{
  "criticalAlerts": {
    "labIntegration": {
      "percentage": 46.8,
      "types": [
        "CRL Lab Integration - AccessionCode Missing",
        "Abbott Lab Integration - SFTP Connection",
        "Quest Lab Integration - File Validation"
      ]
    },
    "dataProcessing": {
      "percentage": 35.2,
      "types": [
        "Uniform Lab Result - Form Association",
        "Generic Report Messaging"
      ]
    },
    "backupOperations": {
      "percentage": 18.0,
      "types": [
        "Backup Failure"
      ]
    }
  },
  "infrastructureAlerts": {
    "serviceHealth": {
      "percentage": 85.5,
      "types": [
        "API Health Check",
        "Service Plan Monitoring"
      ]
    },
    "databaseOperations": {
      "percentage": 14.5,
      "types": [
        "Cosmos DB Scaling",
        "Storage Performance"
      ]
    }
  }
}
```

## Resource Type Distribution
```json
{
  "microsoft.insights/components": {
    "totalAlerts": 5842,
    "severityBreakdown": {
      "sev1": 85,
      "sev3": 15
    },
    "primaryUsage": "Lab Integration Monitoring"
  },
  "microsoft.web/serverfarms": {
    "totalAlerts": 1872,
    "severityBreakdown": {
      "sev3": 100
    },
    "primaryUsage": "Service Plan Health"
  },
  "microsoft.recoveryservices/vaults": {
    "totalAlerts": 168,
    "severityBreakdown": {
      "sev1": 100
    },
    "primaryUsage": "Backup Operations"
  },
  "microsoft.documentdb/databaseaccounts": {
    "totalAlerts": 72,
    "severityBreakdown": {
      "sev3": 100
    },
    "primaryUsage": "Performance Monitoring"
  }
}
```

## Alert Fatigue Analysis
```json
{
  "duplicateAlertRate": 68.5,
  "timeWindowAnalysis": {
    "5min": {
      "averageDuplicates": 3.2,
      "topOffender": "CRL Lab Integration - AccessionCode"
    },
    "1hour": {
      "averageDuplicates": 12.8,
      "topOffender": "Uniform Lab Result - Form Association"
    }
  },
  "resourceNoiseLevel": {
    "high": [
      "qa-dps-app-insights",
      "dev-dps-app-insights"
    ],
    "medium": [
      "pf-dps-app-insights"
    ],
    "low": [
      "vault-m4d3ut4z",
      "cosmosruscaledown"
    ]
  }
}
```

## Integration Health Analysis
```json
{
  "labSystems": {
    "CRL": {
      "errorRate": 46.6,
      "primaryIssue": "AccessionCode Missing",
      "avgResolutionTime": "45min"
    },
    "Abbott": {
      "errorRate": 28.3,
      "primaryIssue": "SFTP Connection",
      "avgResolutionTime": "15min"
    },
    "Quest": {
      "errorRate": 25.1,
      "primaryIssue": "Invalid Result File",
      "avgResolutionTime": "30min"
    }
  },
  "environmentDistribution": {
    "qa": 45.2,
    "dev": 30.8,
    "pf": 24.0
  }
}
```

## Monitoring Maturity Score
```json
{
  "overall": 72,
  "breakdown": {
    "coverage": 85,
    "severity_alignment": 65,
    "signal_type_appropriateness": 90,
    "alert_fatigue_management": 48
  },
  "recommendations": [
    "Implement alert aggregation for lab integration errors",
    "Review Sev1 criteria - current rate too high",
    "Add proactive monitoring for integration endpoints",
    "Consider correlation rules between infrastructure and integration failures"
  ]
}
```