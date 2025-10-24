import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Network, 
  Database, 
  HardDrive, 
  BarChart3, 
  Shield, 
  Workflow,
  Globe,
  Settings,
  Layers
} from "lucide-react";

interface ResourceCategory {
  [resource: string]: number;
}

interface ResourceAnalysis {
  categories: {
    [category: string]: ResourceCategory;
  };
  resource_severity: {
    [resource: string]: {
      [severity: string]: number;
    };
  };
}

interface ResourceTypesProps {
  data: ResourceAnalysis;
}

const categoryIcons: { [key: string]: any } = {
  "Compute": Server,
  "Networking": Network,
  "Storage": HardDrive,
  "Databases": Database,
  "Analytics": BarChart3,
  "Security": Shield,
  "Integration": Workflow,
  "App Services": Globe,
  "Configuration": Settings,
  "Other": Layers
};

const categoryDescriptions: { [key: string]: string } = {
  "Compute": "Performance, health, and running processes for VM and VMSS",
  "Networking": "Health and metrics for all deployed network resources",
  "Storage": "Performance, capacity, and availability of storage accounts",
  "Databases": "Performance, failures, capacity, and operational health",
  "Analytics": "Monitor live applications - performance anomalies and user activity",
  "Security": "Requests, failures, operations, and latency of Key Vaults",
  "Integration": "Performance, connections, requests, and messages",
  "App Services": "Web application monitoring and performance tracking",
  "Configuration": "Configuration management and health monitoring",
  "Other": "General monitoring and cross-resource alerts"
};

const categoryColors: { [key: string]: string } = {
  "Compute": "from-blue-500/10 to-blue-600/5 border-blue-500/20",
  "Networking": "from-purple-500/10 to-purple-600/5 border-purple-500/20",
  "Storage": "from-green-500/10 to-green-600/5 border-green-500/20",
  "Databases": "from-orange-500/10 to-orange-600/5 border-orange-500/20",
  "Analytics": "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
  "Security": "from-red-500/10 to-red-600/5 border-red-500/20",
  "Integration": "from-pink-500/10 to-pink-600/5 border-pink-500/20",
  "App Services": "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20",
  "Configuration": "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
  "Other": "from-gray-500/10 to-gray-600/5 border-gray-500/20"
};

export default function ResourceTypes({ data }: ResourceTypesProps) {
  const sortedCategories = Object.entries(data.categories).sort((a, b) => {
    const totalA = Object.values(a[1]).reduce((sum, val) => sum + val, 0);
    const totalB = Object.values(b[1]).reduce((sum, val) => sum + val, 0);
    return totalB - totalA;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCategories.map(([category, resources]) => {
          const Icon = categoryIcons[category] || Layers;
          const totalAlerts = Object.values(resources).reduce((sum, val) => sum + val, 0);
          const colorClass = categoryColors[category] || categoryColors["Other"];

          return (
            <Card key={category} className={`bg-gradient-to-br ${colorClass}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </div>
                  <Badge variant="secondary">{totalAlerts} alerts</Badge>
                </div>
                <CardDescription className="text-xs">
                  {categoryDescriptions[category] || "Resource monitoring and alerts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(resources)
                    .sort((a, b) => b[1] - a[1])
                    .map(([resource, count]) => (
                      <div key={resource} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{resource}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Resource Severity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Type Severity Breakdown</CardTitle>
          <CardDescription>Alert severity distribution for top resource types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.resource_severity).map(([resource, severities]) => {
              const total = Object.values(severities).reduce((sum, val) => sum + val, 0);
              return (
                <div key={resource} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{resource}</span>
                    <span className="text-sm text-muted-foreground">{total} total alerts</span>
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                    {Object.entries(severities)
                      .sort((a, b) => {
                        const order = { Sev0: 0, Sev1: 1, Sev2: 2, Sev3: 3, Sev4: 4 };
                        return (order[a[0] as keyof typeof order] || 5) - (order[b[0] as keyof typeof order] || 5);
                      })
                      .map(([severity, count]) => {
                        const percentage = (count / total) * 100;
                        const colors: { [key: string]: string } = {
                          Sev0: "bg-red-500",
                          Sev1: "bg-orange-500",
                          Sev2: "bg-yellow-500",
                          Sev3: "bg-blue-500",
                          Sev4: "bg-green-500"
                        };
                        return (
                          <div
                            key={severity}
                            className={colors[severity] || "bg-gray-500"}
                            style={{ width: `${percentage}%` }}
                            title={`${severity}: ${count} (${percentage.toFixed(1)}%)`}
                          />
                        );
                      })}
                  </div>
                  <div className="flex gap-3 text-xs">
                    {Object.entries(severities)
                      .sort((a, b) => {
                        const order = { Sev0: 0, Sev1: 1, Sev2: 2, Sev3: 3, Sev4: 4 };
                        return (order[a[0] as keyof typeof order] || 5) - (order[b[0] as keyof typeof order] || 5);
                      })
                      .map(([severity, count]) => (
                        <div key={severity} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {severity}
                          </Badge>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

