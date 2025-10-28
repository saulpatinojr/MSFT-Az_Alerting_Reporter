import { useState, useEffect } from "react";
import dataService from "@/services/dataService";
import { DashboardInsights, ResourceAnalysis } from "@/services/types";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Database, Maximize2, Minimize2 } from "lucide-react";
import ResourceTypes from "@/components/ResourceTypes";
import ImageLightbox from "@/components/ImageLightbox";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { AlertTriangle, Server, GitBranch, Settings, Globe, Star, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// The old interfaces are replaced by the ones in services/types.ts
// The component is updated to use the new data service and loading/error states.

export default function Home() {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [location] = useLocation();

  // Define the new dashboard links
  const newDashboards = [
    { name: "Alert Fatigue Risk", icon: AlertTriangle, path: "/dashboard/alert-fatigue" },
    { name: "Resource Health Status", icon: Server, path: "/dashboard/resource-health" },
    { name: "Alert Correlation", icon: GitBranch, path: "/dashboard/alert-correlation" },
    { name: "Configuration Analysis", icon: Settings, path: "/dashboard/configuration-analysis" },
    { name: "Environment Distribution", icon: Globe, path: "/dashboard/environment-distribution" },
    { name: "Monitoring Maturity & ROI", icon: Star, path: "/dashboard/monitoring-maturity" },
    { name: "Integration Health", icon: Activity, path: "/dashboard/integration-health" },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    
    // Set a timeout for data loading
    timeout = setTimeout(() => {
      if (insightsLoading) {
        setInsightsError("Data loading timeout (5s). Please check network connection.");
        setInsightsLoading(false);
      }
    }, 5000);

    dataService.fetchDashboardInsights()
      .then((data) => {
        setInsights(data);
        setInsightsLoading(false);
        if (timeout) clearTimeout(timeout);
      })
      .catch((err) => {
        console.error("Failed to load dashboard insights:", err);
        setInsightsError("Failed to load dashboard data. Please refresh.");
        setInsightsLoading(false);
        if (timeout) clearTimeout(timeout);
      });

    // The old resourceData fetch is removed here, as it will be replaced by a React Query hook
    // in the ResourceTypes component later.

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (insightsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-center text-sm text-muted-foreground">{insightsError}</p>
            <Button onClick={() => window.location.reload()} className="w-full mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (insightsLoading || !insights) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="/cbts-logo.svg" alt="CBTS Logo" className="h-10 w-auto" />
              <div className="border-l border-border pl-4">
                <h1 className="text-2xl font-bold tracking-tight">Azure Monitor Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">Executive view of your monitoring configuration and alert strategy</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="flex items-center gap-2"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-linear-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Monitoring Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.total_alerts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Active alert rules configured</p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Alert Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.unique_alert_names.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique alert conditions</p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Priority Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.most_common_severity}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {insights.severity_distribution[insights.most_common_severity]} critical alerts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Primary Focus</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Compute top resource type safely to avoid NaN */}
              {(() => {
                const entries = Object.entries(insights.resource_type_distribution || {});
                const top = entries.sort(([,a],[,b]) => (b as number) - (a as number))[0] || ['Application Insights', 0];
                const topName = top[0];
                const topCount = Number(top[1] || 0);
                const percent = insights.total_alerts > 0 ? ((topCount / insights.total_alerts) * 100) : 0;
                return (
                  <>
                    <div className="text-lg font-bold">{topName}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {topCount} alerts ({percent.toFixed(1)}%)
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle>Executive Summary - Key Findings</CardTitle>
            </div>
            <CardDescription>Critical insights and business implications from your monitoring configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.key_insights.map((insight: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
                  <span className="text-primary font-bold text-lg shrink-0">{idx + 1}.</span>
                  <span className="text-sm text-foreground">{insight}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-primary/20">
                <h4 className="font-semibold text-sm mb-3">What This Means for Your Business:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="mb-2"><strong>Operational focus:</strong> The majority of alerting activity centers on {(() => {
                      const entries = Object.entries(insights.resource_type_distribution || {});
                      const top = entries.sort(([,a],[,b]) => (b as number) - (a as number))[0] || ['Application Insights', 0];
                      return top[0];
                    })()}. This aligns monitoring with customer-facing services and helps prioritize operator attention.</p>
                    <p className="mb-2"><strong>Risk posture:</strong> {insights.alert_metrics.sev1 + insights.alert_metrics.sev0} high-priority alerts indicate active risk detection — consider tuning thresholds to reduce noise and prevent alert fatigue.</p>
                    <p><strong>Coverage gaps:</strong> Use the Resource Type and Environment distributions to find under-monitored resource groups and subscriptions; consider adding baseline alerts for those resources.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold">Recommended next actions</h5>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Review top 10 alert rules for duplication and consolidate where possible.</li>
                      <li>Prioritize tuning thresholds for Sev0/Sev1 alerts to reduce false positives.</li>
                      <li>Define ownership for top resource types (e.g., App Insights) to speed triage and remediation.</li>
                      <li>Implement suppression or aggregation for noisy signals and use adaptive thresholds where applicable.</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold">Top 10 Alert Families</h5>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {insights.top_alert_families && insights.top_alert_families.length ? (
                        <ol className="list-decimal pl-5 space-y-1 max-h-40 overflow-auto">
                          {insights.top_alert_families.map((f, i) => (
                            <li key={f.name} title={f.name} className="truncate">
                              <span className="font-medium">{f.name}</span>
                              <span className="text-muted-foreground ml-2">— {f.count} alerts ({f.percentage.toFixed(1)}%)</span>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p>No alert family data available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Correlation Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alert Configuration Analysis</CardTitle>
            <CardDescription>How your alert rules are organized and configured for effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              // Compute clearer, actionable metrics from insights
              const severityEntries = Object.entries(insights.severity_distribution || {});
              const topSeverityEntry = severityEntries.sort(([,a],[,b]) => (b as number) - (a as number))[0] || ['Sev1', 0];
              const topSeverityName = topSeverityEntry[0];
              const topSeverityCount = Number(topSeverityEntry[1] || 0);
              const topSeverityPct = insights.total_alerts > 0 ? (topSeverityCount / insights.total_alerts) * 100 : 0;

              const resourceEntries = Object.entries(insights.resource_type_distribution || {});
              const topResourceEntry = resourceEntries.sort(([,a],[,b]) => (b as number) - (a as number))[0] || ['Unknown', 0];
              const topResourceName = topResourceEntry[0];
              const topResourceCount = Number(topResourceEntry[1] || 0);
              const topResourcePct = insights.total_alerts > 0 ? (topResourceCount / insights.total_alerts) * 100 : 0;

              const topSignal = (insights.signal_type_distribution && insights.signal_type_distribution[0]) || { type: 'Unknown', count: 0, percentage: 0 };

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">Top Severity</h4>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button aria-label="Top Severity info" className="p-1">
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="max-w-xs">Most frequent alert severity across your rules. Percentage = (count of this severity / total alerts). Review top rules with this severity for tuning.</div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-2xl font-bold text-orange-500">{topSeverityName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{topSeverityCount} alerts ({topSeverityPct.toFixed(1)}%)</p>
                      <p className="text-xs text-muted-foreground mt-2">This shows the most frequent alert severity; review top rules under {topSeverityName} for tuning opportunities.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">Resource Concentration</h4>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button aria-label="Resource Concentration info" className="p-1">
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="max-w-xs">Resource type accounting for the largest share of alerts. Percentage = (alerts for resource type / total alerts). Consider ownership and threshold tuning for this resource.</div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-500">{topResourceName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{topResourceCount} alerts ({topResourcePct.toFixed(1)}%)</p>
                      <p className="text-xs text-muted-foreground mt-2">High concentration indicates this resource type (e.g., App Insights) carries the bulk of alerts — verify whether thresholds or templates are causing over-alerting.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">Top Signal Type</h4>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button aria-label="Top Signal Type info" className="p-1">
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="max-w-xs">The signal source (metrics, logs, activity) generating most alerts. Use this to refine detection methods and reduce noise.</div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-500">{topSignal.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">{topSignal.count} alerts ({topSignal.percentage.toFixed(1)}%)</p>
                      <p className="text-xs text-muted-foreground mt-2">Signal type distribution helps decide whether metric, log, or activity signals are generating most noise. Use this to refine alert logic.</p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-semibold text-sm mb-2">What This Tells Us:</h4>
              <p className="text-sm text-muted-foreground">Your alert configuration shows intentional design. The strong negative correlation between severity and signal type indicates that critical alerts use specific monitoring methods, while less critical alerts use different approaches. This is a sign of mature monitoring practices where different alert types are matched to appropriate detection methods.</p>
            </div>
          </CardContent>
        </Card>

	        {/* Visualizations Tabs */}
	        <Tabs defaultValue="overview" className="space-y-6">
	          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	            <TabsTrigger value="overview">Overview</TabsTrigger>
	            <TabsTrigger value="resources">Resource Types</TabsTrigger>
	            <TabsTrigger value="advanced-analysis">Advanced Analysis</TabsTrigger>
	            <TabsTrigger value="severity">Severity Analysis</TabsTrigger>
	            <TabsTrigger value="correlations">Correlation</TabsTrigger>
	            <TabsTrigger value="distributions">Distribution</TabsTrigger>
	            <TabsTrigger value="environment">Environment</TabsTrigger>
	          </TabsList>

	          <TabsContent value="overview" className="space-y-6">
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Alert Distribution by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageLightbox src="/visualizations/severity_distribution.png" alt="Severity Distribution" className="w-full rounded-lg" />
                  </CardContent>
                </Card>
	              <Card>
	                <CardHeader>
	                  <CardTitle className="text-base">Signal Type Distribution</CardTitle>
	                </CardHeader>
	                <CardContent>
                    <div className="space-y-4">
                      {insights.signal_type_distribution.map((signal: { type: string; count: number; percentage: number }) => (
                        <div key={signal.type}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">{signal.type}</p>
                            <Badge variant="secondary">
                              {signal.count} alerts ({signal.percentage.toFixed(1)}%)
                            </Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500"
                              style={{ width: `${signal.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                        <h4 className="font-semibold text-sm mb-2">Signal Type Distribution:</h4>
                        <p className="text-sm text-muted-foreground">
                          Metrics and logs make up the majority of alert signals, indicating a balanced approach to monitoring both real-time performance and historical patterns.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
	            </div>
	          </TabsContent>

	          <TabsContent value="resources" className="space-y-6">
	            <ResourceTypes />
	          </TabsContent>

            <TabsContent value="advanced-analysis" className="space-y-6">
              {/* Replace link-only cards with inline summaries so cards remain useful even without separate pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Alert Fatigue Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {insights.alert_fatigue_summary ? (
                      <>
                        <p className="text-2xl font-bold">
                          {insights.alert_fatigue_summary.low_priority_total.toLocaleString()} low-priority alerts
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Low-severity noise accounts for {insights.alert_fatigue_summary.low_priority_percentage.toFixed(1)}% of total alert firings.
                        </p>
                        {insights.alert_fatigue_summary.noisy_rules.length > 0 && (
                          <div className="mt-3 space-y-2 text-sm">
                            {insights.alert_fatigue_summary.noisy_rules.slice(0, 3).map(rule => (
                              <div key={rule.name} className="p-2 rounded-md bg-muted/40 border border-border/60">
                                <div className="font-medium">{rule.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {rule.severity} • {rule.count} alerts • {rule.resource_group}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {insights.alert_fatigue_summary.noisiest_resource_groups.length > 0 && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            Concentrated in{' '}
                            {insights.alert_fatigue_summary.noisiest_resource_groups.slice(0, 2).map((rg, idx) => (
                              <span key={rg.resource_group}>
                                {rg.resource_group} ({rg.count})
                                {idx === 0 && insights.alert_fatigue_summary.noisiest_resource_groups.length > 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{(insights.alert_metrics.sev3 + insights.alert_metrics.sev4).toLocaleString()} low-priority alerts</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Noise candidates: many low-severity alerts can indicate alert fatigue risk. Review top noisy rules below.
                        </p>
                        {insights.top_alert_families && insights.top_alert_families.length > 0 && (
                          <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                            {insights.top_alert_families.slice(0,3).map(f => (
                              <li key={f.name} title={f.name}>{f.name} — {f.count} alerts</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Resource Health Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{(Object.values((insights as any).resource_health_summary?.categories || {}) as any[]).reduce((sum: number, c: any) => {
                      // `c` is a map of resourceName -> count
                      const vals = Object.values(c || {}).map((n: any) => Number(n) || 0);
                      return sum + vals.reduce((s:number,v:number) => s + v, 0);
                    }, 0)} monitored items</p>
                    <p className="text-xs text-muted-foreground mt-1">Breakdown across categories below.</p>
                    <div className="mt-3 text-sm grid grid-cols-2 gap-2">
                      {(Object.entries((insights as any).resource_health_summary?.categories || {}) as [string, any][]).slice(0,4).map(([k, v]) => {
                        const totalForCategory = Object.values(v || {}).reduce((s:number,x:any) => s + (Number(x) || 0), 0);
                        const displayNames: { [key: string]: string } = {
                          compute: 'Compute & Workloads',
                          networking: 'Networking & Connectivity',
                          storage: 'Storage & Data',
                          databases: 'Databases & Caching',
                          analytics: 'Analytics & Monitoring',
                          security: 'Security & Compliance',
                          integration: 'Integration & Messaging',
                          configuration: 'Configuration & Management',
                          other: 'Other'
                        };
                        const title = displayNames[k] || k;
                        return (
                          <div key={k} className="p-2 bg-muted rounded">
                            <div className="text-sm font-medium">{title}</div>
                            <div className="text-xs text-muted-foreground">{totalForCategory} alerts</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Alert Correlation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Statistical relationships between alert attributes — visualized below.</p>
                    <ImageLightbox src="/visualizations/correlation_matrix.png" alt="Correlation Matrix" className="w-full rounded-lg" />
                  </CardContent>
                </Card>

                <Card className="group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Configuration Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {(insights.configuration_summary?.unique_conditions ?? insights.unique_alert_names).toLocaleString()} unique alert conditions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Highest-volume configurations with their prevailing severity and signal type.
                    </p>
                    {insights.configuration_summary?.top_conditions?.length ? (
                      <div className="mt-3 space-y-2 text-sm max-h-40 overflow-auto pr-1">
                        {insights.configuration_summary.top_conditions.map(condition => (
                          <div key={condition.condition} className="p-2 bg-muted/40 rounded-md border border-border/60">
                            <div className="flex items-start justify-between gap-3">
                              <span className="font-medium leading-snug">{condition.condition}</span>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{condition.count} alerts</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {condition.severity} • {condition.signal_type}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ol className="mt-3 text-sm list-decimal pl-5 max-h-36 overflow-auto">
                        {(insights.top_alert_families || []).map(f => (
                          <li key={f.name}>{f.name} — {f.count} alerts</li>
                        ))}
                      </ol>
                    )}
                  </CardContent>
                </Card>

                <Card className="group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Environment Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageLightbox src="/visualizations/environment_distribution.png" alt="Environment Distribution" className="w-full rounded-lg" />
                    <p className="text-xs text-muted-foreground mt-2">Alert counts by environment (resource group as proxy).</p>
                  </CardContent>
                </Card>

                <Card className="group">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Monitoring Maturity & ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">High-level summary of monitoring coverage and opportunities to reduce mean time to detect and resolve incidents.</p>
                    <p className="mt-3 text-sm">Top action: tune thresholds for Sev0/Sev1 rules and consolidate duplicate alert conditions.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

	          <TabsContent value="severity" className="space-y-6">
              <Card className="border-orange-500/20 bg-orange-500/5">
	              <CardHeader>
	                <CardTitle>Alert Severity Breakdown</CardTitle>
	                <CardDescription>How your 1,000 alert rules are distributed by priority level</CardDescription>
	              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
	                  {/* Re-implementing the severity distribution logic using the new insights structure */}
	                  {Object.entries({
	                    Sev0: insights.alert_metrics.sev0,
	                    Sev1: insights.alert_metrics.sev1,
	                    Sev2: insights.alert_metrics.sev2,
	                    Sev3: insights.alert_metrics.sev3,
	                    Sev4: insights.alert_metrics.sev4,
	                  })
	                    .sort(([, countA], [, countB]) => countB - countA)
	                    .map(([severity, count]) => {
	                      const percentage = (count / insights.alert_metrics.total_alerts) * 100;
	                      const severityLabels: { [key: string]: string } = {
	                        Sev0: "Emergency - Immediate action required",
	                        Sev1: "Critical - Urgent attention needed",
	                        Sev2: "Error - Important issue detected",
	                        Sev3: "Warning - Monitor closely",
	                        Sev4: "Informational - For awareness",
	                      };
	                      const colors: { [key: string]: string } = {
	                        Sev0: "bg-red-500",
	                        Sev1: "bg-orange-500",
	                        Sev2: "bg-yellow-500",
	                        Sev3: "bg-blue-500",
	                        Sev4: "bg-green-500",
	                      };
	                      return (
	                        <div key={severity}>
	                          <div className="flex items-center justify-between mb-2">
	                            <div>
	                              <p className="font-medium text-sm">{severityLabels[severity]}</p>
	                              <p className="text-xs text-muted-foreground">{severity}</p>
	                            </div>
	                            <Badge variant="secondary">{count} alerts ({percentage.toFixed(1)}%)</Badge>
	                          </div>
	                          <div className="h-2 bg-muted rounded-full overflow-hidden">
	                            <div
	                              className={colors[severity] || "bg-gray-500"}
	                              style={{ width: `${percentage}%` }}
	                            />
	                          </div>
	                        </div>
	                      );
	                    })}
                    </div>
                    <div>
                      <ImageLightbox src="/visualizations/severity_signal_stacked.png" alt="Severity by Signal" className="w-full rounded-lg mb-4" />
                      <ImageLightbox src="/visualizations/severity_by_environment.png" alt="Severity by Environment" className="w-full rounded-lg" />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
	                  <h4 className="font-semibold text-sm mb-2">Severity Level Guide:</h4>
	                  <ul className="space-y-1.5 text-sm text-muted-foreground">
	                    <li aria-label="Severity 0: Emergency"><strong>Sev0 (Emergency):</strong> System down or critical service failure - requires immediate response</li>
	                    <li aria-label="Severity 1: Critical"><strong>Sev1 (Critical):</strong> Major functionality impaired - needs urgent investigation</li>
	                    <li aria-label="Severity 2: Error"><strong>Sev2 (Error):</strong> Significant issue detected - should be addressed soon</li>
	                    <li aria-label="Severity 3: Warning"><strong>Sev3 (Warning):</strong> Potential issue identified - monitor for escalation</li>
	                    <li aria-label="Severity 4: Informational"><strong>Sev4 (Informational):</strong> Status update - for awareness and trending</li>
	                  </ul>
	                </div>
	              </CardContent>
	            </Card>
	          </TabsContent>

	          <TabsContent value="correlations" className="space-y-6">
	            <Card>
	              <CardHeader>
	                <CardTitle>Statistical Relationships</CardTitle>
	                <CardDescription>How different alert attributes relate to each other</CardDescription>
	              </CardHeader>
                  <CardContent>
                  <ImageLightbox src="/visualizations/correlation_matrix.png" alt="Correlation Matrix" className="w-full rounded-lg" />
                  </CardContent>
	            </Card>
	          </TabsContent>

	          <TabsContent value="distributions" className="space-y-6">
	            <Card>
	              <CardHeader>
	                <CardTitle>Resource Type Distribution</CardTitle>
	                <CardDescription>Which Azure services are most heavily monitored</CardDescription>
	              </CardHeader>
                  <CardContent>
                  <ImageLightbox src="/visualizations/resource_type_distribution.png" alt="Resource Distribution" className="w-full rounded-lg" />
                  </CardContent>
	            </Card>
	          </TabsContent>

            <TabsContent value="environment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Environment Breakdown</CardTitle>
                  <CardDescription>Alert distribution across development, staging, and production (resource group proxy)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="space-y-3 max-h-[42vh] overflow-auto pr-2">
                        {(insights.environment_distribution || []).map((env: { environment: string; total_alerts: number }) => {
                          const total = insights.alert_metrics.total_alerts || 1;
                          const percentage = total > 0 ? (env.total_alerts / total) * 100 : 0;
                          return (
                            <div key={env.environment} className="py-2 border-b border-border last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-sm truncate" title={env.environment}>{env.environment}</p>
                                <Badge variant="secondary">{env.total_alerts} alerts ({percentage.toFixed(1)}%)</Badge>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                      <div className="p-3 bg-muted rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total alerts</p>
                            <p className="text-2xl font-bold">{insights.alert_metrics.total_alerts.toLocaleString()}</p>
                          </div>
                          <div className="text-sm text-muted-foreground text-right">
                            <p className="mb-1">Top environment</p>
                            <p className="font-medium">{(insights.environment_distribution[0] && insights.environment_distribution[0].environment) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 bg-muted rounded">
                        <ImageLightbox src="/visualizations/environment_distribution.png" alt="Environment Distribution" className="w-full rounded" />
                      </div>

                      <div className="p-3 bg-muted rounded text-sm text-muted-foreground">
                        <p className="font-semibold mb-2">Notes</p>
                        <p>The environment list is shown by resource group (portal CSV uses resource group as a proxy). Use the top groups to identify where alerting is concentrated and assign ownership.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
	        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Azure Monitor Analytics Dashboard • Executive monitoring insights and configuration analysis</p>
        </div>
      </footer>
    </div>
  );
}
