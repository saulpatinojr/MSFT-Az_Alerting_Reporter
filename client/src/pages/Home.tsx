import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Activity, Database } from "lucide-react";

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

export default function Home() {
  const [insights, setInsights] = useState<InsightsData | null>(null);

  useEffect(() => {
    fetch("/visualizations/insights.json")
      .then((res) => res.json())
      .then((data) => setInsights(data))
      .catch((err) => console.error("Failed to load insights:", err));
  }, []);

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
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Azure Monitor Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive analysis of alert rules and correlations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{insights.total_alerts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Active alert rules</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unique Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{insights.unique_alert_names.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Distinct alert names</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Common Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{insights.most_common_severity}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {insights.severity_distribution[insights.most_common_severity]} alerts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Resource Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Application Insights</div>
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
        <Card className="mb-8 border-primary/20 bg-primary/5">
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
        <Card className="mb-8">
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>

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
      <footer className="border-t border-border mt-16 py-6 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Azure Monitor Analytics Dashboard • Data-driven insights for alert management</p>
        </div>
      </footer>
    </div>
  );
}

