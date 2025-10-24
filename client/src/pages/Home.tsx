import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, Activity, Database, Maximize2, Minimize2 } from "lucide-react";
import ResourceTypes from "@/components/ResourceTypes";

interface InsightsData {
  total_alerts: number;
  unique_alert_names: number;
  severity_distribution: Record<string, number>;
  most_common_severity: string;
  resource_type_distribution: Record<string, number>;
  signal_type_distribution: Record<string, number>;
  environment_distribution: Record<string, number>;
  correlations: {
    severity_resource: number;
    severity_signal: number;
    resource_signal: number;
  };
  key_insights: string[];
}

interface ResourceAnalysis {
  categories: {
    [category: string]: {
      [resource: string]: number;
    };
  };
  resource_severity: {
    [resource: string]: {
      [severity: string]: number;
    };
  };
}

export default function Home() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [resourceData, setResourceData] = useState<ResourceAnalysis | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch("/visualizations/insights.json")
      .then((res) => res.json())
      .then((data) => setInsights(data))
      .catch((err) => console.error("Failed to load insights:", err));

    fetch("/resource_analysis.json")
      .then((res) => res.json())
      .then((data) => setResourceData(data))
      .catch((err) => console.error("Failed to load resource data:", err));
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

  if (!insights) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
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
                <p className="text-sm text-muted-foreground">Comprehensive analysis of alert rules and correlations</p>
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
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.total_alerts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Active alert rules</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Unique Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.unique_alert_names.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Distinct alert names</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Most Common Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.most_common_severity}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {insights.severity_distribution[insights.most_common_severity]} alerts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Top Resource Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">Application Insights</div>
              <p className="text-xs text-muted-foreground mt-1">
                {insights.resource_type_distribution["Application Insights"]} alerts (
                {((insights.resource_type_distribution["Application Insights"] / insights.total_alerts) * 100).toFixed(
                  1
                )}
                %)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle>Key Insights</CardTitle>
            </div>
            <CardDescription>Major trends and correlations discovered in the data</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.key_insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Correlation Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Correlation Analysis</CardTitle>
            <CardDescription>Statistical relationships between variables (encoded as numerical values)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">Severity ↔ Resource Type</div>
                <div className="text-2xl font-bold">{insights.correlations.severity_resource.toFixed(3)}</div>
                <Badge variant="outline" className="mt-2">
                  Weak Positive
                </Badge>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">Severity ↔ Signal Type</div>
                <div className="text-2xl font-bold">{insights.correlations.severity_signal.toFixed(3)}</div>
                <Badge variant="destructive" className="mt-2">
                  Strong Negative
                </Badge>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">Resource Type ↔ Signal Type</div>
                <div className="text-2xl font-bold">{insights.correlations.resource_signal.toFixed(3)}</div>
                <Badge variant="outline" className="mt-2">
                  No Correlation
                </Badge>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm">
                <strong>Interpretation:</strong> The strong negative correlation (-0.784) between Severity and Signal
                Type indicates that certain signal types are consistently associated with specific severity levels. The
                weak positive correlation (0.182) between Severity and Resource Type suggests a slight tendency for
                certain resources to trigger higher severity alerts.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visualizations Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resource Types</TabsTrigger>
            <TabsTrigger value="severity">Severity Analysis</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            {resourceData ? (
              <ResourceTypes data={resourceData} />
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">Loading resource type data...</div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="severity" className="space-y-6">
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader>
                <CardTitle>Most Common Alert Severities</CardTitle>
                <CardDescription>Detailed breakdown of severity levels across all alert rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-xs font-medium text-red-400 mb-1">Sev0 - Emergency</div>
                      <div className="text-3xl font-bold">{insights.severity_distribution.Sev0 || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(((insights.severity_distribution.Sev0 || 0) / insights.total_alerts) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="text-xs font-medium text-orange-400 mb-1">Sev1 - Critical</div>
                      <div className="text-3xl font-bold">{insights.severity_distribution.Sev1 || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(((insights.severity_distribution.Sev1 || 0) / insights.total_alerts) * 100).toFixed(1)}% of total
                      </div>
                      <Badge variant="destructive" className="mt-2 text-xs">Most Common</Badge>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="text-xs font-medium text-yellow-400 mb-1">Sev2 - Error</div>
                      <div className="text-3xl font-bold">{insights.severity_distribution.Sev2 || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(((insights.severity_distribution.Sev2 || 0) / insights.total_alerts) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-xs font-medium text-blue-400 mb-1">Sev3 - Warning</div>
                      <div className="text-3xl font-bold">{insights.severity_distribution.Sev3 || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(((insights.severity_distribution.Sev3 || 0) / insights.total_alerts) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-xs font-medium text-green-400 mb-1">Sev4 - Info</div>
                      <div className="text-3xl font-bold">{insights.severity_distribution.Sev4 || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(((insights.severity_distribution.Sev4 || 0) / insights.total_alerts) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Severity Distribution Chart</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src="/visualizations/severity_distribution.png"
                          alt="Severity Distribution"
                          className="w-full h-auto rounded-lg"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Severity Rankings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(insights.severity_distribution)
                            .sort((a, b) => b[1] - a[1])
                            .map(([severity, count], index) => {
                              const percentage = ((count / insights.total_alerts) * 100).toFixed(1);
                              const severityColors: Record<string, string> = {
                                Sev0: 'bg-red-500',
                                Sev1: 'bg-orange-500',
                                Sev2: 'bg-yellow-500',
                                Sev3: 'bg-blue-500',
                                Sev4: 'bg-green-500',
                              };
                              return (
                                <div key={severity} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">#{index + 1}</span>
                                      <Badge variant="outline">{severity}</Badge>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-bold">{count}</span>
                                      <span className="text-muted-foreground ml-2">({percentage}%)</span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${severityColors[severity]}`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <CardTitle>Temporal Distribution Analysis</CardTitle>
                </div>
                <CardDescription>Time-series analysis of severity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Data Limitation Notice
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      The current dataset does not contain temporal/time-based data such as creation dates, trigger
                      timestamps, or modification dates. The analysis shows the <strong>static distribution</strong> of
                      configured alert rules by severity level.
                    </p>
                    <div className="text-sm">
                      <p className="font-medium mb-2">Available data fields:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Name, Condition, Severity</li>
                        <li>Target scope, Target resource type</li>
                        <li>Signal type, Status</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold mb-2">To Enable Temporal Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      To visualize how severities are distributed over time, you would need additional data:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Alert creation/modification timestamps</li>
                      <li>Alert trigger history with timestamps</li>
                      <li>Time-series metrics of alert firing events</li>
                      <li>Historical trend data from Azure Monitor</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Insights Available</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      While temporal trends are not available, the dashboard provides comprehensive analysis of:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Severity distribution across all alert rules</li>
                      <li>Correlations between severity, resource types, and signal types</li>
                      <li>Environment-based severity patterns</li>
                      <li>Resource type and signal type distributions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Severity Distribution</CardTitle>
                  <CardDescription>Alert count by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src="/visualizations/severity_distribution.png"
                    alt="Severity Distribution"
                    className="w-full h-auto rounded-lg"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Signal Type Distribution</CardTitle>
                  <CardDescription>Breakdown of alert signal types</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src="/visualizations/signal_type_distribution.png"
                    alt="Signal Type Distribution"
                    className="w-full h-auto rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Resource Types</CardTitle>
                <CardDescription>Most frequently monitored resource types</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/resource_type_distribution.png"
                  alt="Resource Type Distribution"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Correlation Matrix</CardTitle>
                <CardDescription>
                  Pearson correlation coefficients between encoded categorical variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/correlation_matrix.png"
                  alt="Correlation Matrix"
                  className="w-full h-auto rounded-lg max-w-2xl mx-auto"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severity vs Resource Type Heatmap</CardTitle>
                <CardDescription>Cross-tabulation showing alert counts for each combination</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/severity_resource_heatmap.png"
                  alt="Severity Resource Heatmap"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severity by Signal Type</CardTitle>
                <CardDescription>Stacked bar chart showing severity distribution across signal types</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/severity_signal_stacked.png"
                  alt="Severity Signal Stacked"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distributions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 15 Alert Names</CardTitle>
                <CardDescription>Most frequently occurring alert configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/top_alert_names.png"
                  alt="Top Alert Names"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Severity Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(insights.severity_distribution)
                      .sort((a, b) => b[1] - a[1])
                      .map(([severity, count]) => (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                severity === "Sev0"
                                  ? "destructive"
                                  : severity === "Sev1"
                                    ? "destructive"
                                    : severity === "Sev2"
                                      ? "default"
                                      : "outline"
                              }
                            >
                              {severity}
                            </Badge>
                            <span className="text-sm">{count} alerts</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {((count / insights.total_alerts) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Resource Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(insights.resource_type_distribution).map(([resource, count]) => (
                      <div key={resource} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm">{resource}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({((count / insights.total_alerts) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution by Environment</CardTitle>
                <CardDescription>
                  Alerts categorized by deployment environment (extracted from target scope)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/environment_distribution.png"
                  alt="Environment Distribution"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution by Environment</CardTitle>
                <CardDescription>How severity levels vary across different environments</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/visualizations/severity_by_environment.png"
                  alt="Severity by Environment"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(insights.environment_distribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([env, count]) => (
                      <div key={env} className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground mb-1">{env}</div>
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {((count / insights.total_alerts) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Azure Monitor Analytics Dashboard • Data-driven insights for alert management</p>
        </div>
      </footer>
    </div>
  );
}

