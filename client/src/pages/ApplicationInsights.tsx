import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, TrendingUp, AlertTriangle, Clock, Users, Eye, Activity } from "lucide-react";
import { useLocation } from "wouter";

interface AppInsightsData {
  resource_type: string;
  total_instances: number;
  instances: Array<{
    name: string;
    resource_group: string;
    location: string;
    subscription: string;
  }>;
  metrics: {
    total_requests: number;
    failed_requests: number;
    avg_response_time_ms: number;
    availability_percent: number;
    active_users: number;
    page_views: number;
  };
  alerts_configured: number;
  severity_breakdown: {
    [key: string]: number;
  };
  common_alert_types: string[];
  regions: string[];
  subscriptions: string[];
}

export default function ApplicationInsights() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<AppInsightsData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetch("/application_insights_data.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to load Application Insights data:", err));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
      // In a real implementation, you would process these files here
      console.log("Files uploaded:", files);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading Application Insights data...</p>
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
              <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="border-l border-border pl-4">
                <h1 className="text-2xl font-bold tracking-tight">Application Insights</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor live applications - performance anomalies and user activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".csv,.json,.xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.total_requests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all instances</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Failed Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.failed_requests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((data.metrics.failed_requests / data.metrics.total_requests) * 100).toFixed(2)}% failure rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.availability_percent}%</div>
              <p className="text-xs text-muted-foreground mt-1">Uptime across all services</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.avg_response_time_ms}ms</div>
              <p className="text-xs text-muted-foreground mt-1">Average across endpoints</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.active_users.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current active sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.page_views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total page views</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>{data.alerts_configured} alerts configured for Application Insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Severity Distribution</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(data.severity_breakdown).map(([severity, count]) => {
                      const total = Object.values(data.severity_breakdown).reduce((a, b) => a + b, 0);
                      const percentage = (count / total) * 100;
                      const colors: { [key: string]: string } = {
                        Sev0: "bg-red-500",
                        Sev1: "bg-orange-500",
                        Sev2: "bg-yellow-500",
                        Sev3: "bg-blue-500",
                        Sev4: "bg-green-500",
                      };
                      return (
                        <div key={severity}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>{severity}</span>
                            <span className="text-muted-foreground">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
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
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Alert Types</CardTitle>
              <CardDescription>Most frequently configured alert conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.common_alert_types.map((alertType, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="text-sm">{alertType}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instances Table */}
        <Card>
          <CardHeader>
            <CardTitle>Application Insights Instances</CardTitle>
            <CardDescription>
              {data.total_instances} total instances across {data.regions.length} regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Resource Group</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {data.instances.map((instance, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{instance.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{instance.resource_group}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{instance.location}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{instance.subscription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Uploaded Data Files</CardTitle>
              <CardDescription>Files uploaded for additional metrics analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

