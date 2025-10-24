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
  most_common_severity: string;
  severity_distribution: {
    [key: string]: number;
  };
  resource_type_distribution: {
    [key: string]: number;
  };
  signal_type_distribution: {
    [key: string]: number;
  };
  environment_distribution: {
    [key: string]: number;
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
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Monitoring Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.total_alerts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Active alert rules configured</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Alert Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.unique_alert_names.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique alert conditions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
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

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Primary Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">Application Insights</div>
              <p className="text-xs text-muted-foreground mt-1">
                {insights.resource_type_distribution["Application Insights"]} alerts (
                {((insights.resource_type_distribution["Application Insights"] / insights.total_alerts) * 100).toFixed(
                  1
                )}%)
              </p>
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
              {insights.key_insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
                  <span className="text-primary font-bold text-lg flex-shrink-0">{idx + 1}.</span>
                  <span className="text-sm text-foreground">{insight}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-primary/20">
                <h4 className="font-semibold text-sm mb-3">What This Means for Your Business:</h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    <span><strong>Strong Application Focus:</strong> Your organization prioritizes monitoring user-facing applications, ensuring customers experience optimal performance and reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    <span><strong>Proactive Risk Management:</strong> Over one-third of alerts are set to critical level, indicating you are actively watching for issues before they impact operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    <span><strong>Well-Organized Monitoring:</strong> Alert severity levels align with signal types, showing a systematic approach to managing infrastructure health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold flex-shrink-0">•</span>
                    <span><strong>Comprehensive Coverage:</strong> Monitoring spans compute resources, storage, databases, and applications, providing visibility across your entire technology stack</span>
                  </li>
                </ul>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Severity vs. Alert Type</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">-0.784</p>
                  <p className="text-xs text-muted-foreground mt-1">Strong Negative Correlation</p>
                  <p className="text-xs text-muted-foreground mt-2">Higher severity alerts use different signal types, showing intentional configuration strategy</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Severity vs. Resource Type</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">0.182</p>
                  <p className="text-xs text-muted-foreground mt-1">Weak Positive Correlation</p>
                  <p className="text-xs text-muted-foreground mt-2">Severity levels are distributed evenly across different resource types</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Resource Type vs. Signal Type</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">0.010</p>
                  <p className="text-xs text-muted-foreground mt-1">No Correlation</p>
                  <p className="text-xs text-muted-foreground mt-2">Signal types are selected independently of resource type</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-semibold text-sm mb-2">What This Tells Us:</h4>
              <p className="text-sm text-muted-foreground">Your alert configuration shows intentional design. The strong negative correlation between severity and signal type indicates that critical alerts use specific monitoring methods, while less critical alerts use different approaches. This is a sign of mature monitoring practices where different alert types are matched to appropriate detection methods.</p>
            </div>
          </CardContent>
        </Card>

        {/* Visualizations Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resource Types</TabsTrigger>
            <TabsTrigger value="severity">Severity Analysis</TabsTrigger>
            <TabsTrigger value="correlations">Analysis</TabsTrigger>
            <TabsTrigger value="distributions">Distribution</TabsTrigger>
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
                <CardTitle>Alert Severity Breakdown</CardTitle>
                <CardDescription>How your 1,000 alert rules are distributed by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(insights.severity_distribution)
                    .sort((a, b) => {
                      const order = { Sev0: 0, Sev1: 1, Sev2: 2, Sev3: 3, Sev4: 4 };
                      return (order[a[0] as keyof typeof order] || 5) - (order[b[0] as keyof typeof order] || 5);
                    })
                    .map(([severity, count]) => {
                      const percentage = (count / insights.total_alerts) * 100;
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
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-semibold text-sm mb-2">Severity Level Guide:</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li><strong>Sev0 (Emergency):</strong> System down or critical service failure - requires immediate response</li>
                    <li><strong>Sev1 (Critical):</strong> Major functionality impaired - needs urgent investigation</li>
                    <li><strong>Sev2 (Error):</strong> Significant issue detected - should be addressed soon</li>
                    <li><strong>Sev3 (Warning):</strong> Potential issue identified - monitor for escalation</li>
                    <li><strong>Sev4 (Informational):</strong> Status update - for awareness and trending</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Alert Distribution by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/visualizations/severity_distribution.png" alt="Severity Distribution" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Signal Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/visualizations/signal_distribution.png" alt="Signal Distribution" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistical Relationships</CardTitle>
                <CardDescription>How different alert attributes relate to each other</CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/visualizations/correlation_heatmap.png" alt="Correlation Heatmap" className="w-full rounded-lg" />
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
                <img src="/visualizations/resource_distribution.png" alt="Resource Distribution" className="w-full rounded-lg" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Breakdown</CardTitle>
                <CardDescription>Alert distribution across development, staging, and production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(insights.environment_distribution).map(([env, count]) => {
                    const percentage = (count / insights.total_alerts) * 100;
                    return (
                      <div key={env}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{env}</p>
                          <Badge variant="secondary">{count} alerts ({percentage.toFixed(1)}%)</Badge>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
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
