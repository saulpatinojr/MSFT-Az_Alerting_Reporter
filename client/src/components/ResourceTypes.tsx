import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, Network, Shield, Zap, BarChart3, Settings, Package } from "lucide-react";

interface ResourceData {
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

interface ResourceCategory {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  resources: { [key: string]: number };
}

export default function ResourceTypes({ data }: { data: ResourceData }) {
  const [, setLocation] = useLocation();

  const categoryConfig: { [key: string]: ResourceCategory } = {
    compute: {
      name: "Compute & Workloads",
      description: "Virtual machines, app services, and container resources",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-blue-500/10 border-blue-500/20",
      resources: data.categories.compute || {},
    },
    networking: {
      name: "Networking & Connectivity",
      description: "Load balancers, gateways, and network infrastructure",
      icon: <Network className="w-5 h-5" />,
      color: "bg-purple-500/10 border-purple-500/20",
      resources: data.categories.networking || {},
    },
    storage: {
      name: "Storage & Data",
      description: "Blob storage, file shares, and data repositories",
      icon: <Database className="w-5 h-5" />,
      color: "bg-green-500/10 border-green-500/20",
      resources: data.categories.storage || {},
    },
    databases: {
      name: "Databases & Caching",
      description: "SQL databases, Cosmos DB, Redis, and data services",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-orange-500/10 border-orange-500/20",
      resources: data.categories.databases || {},
    },
    analytics: {
      name: "Analytics & Monitoring",
      description: "Application Insights, Log Analytics, and monitoring tools",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-cyan-500/10 border-cyan-500/20",
      resources: data.categories.analytics || {},
    },
    security: {
      name: "Security & Compliance",
      description: "Key Vault, security policies, and access management",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-red-500/10 border-red-500/20",
      resources: data.categories.security || {},
    },
    integration: {
      name: "Integration & Messaging",
      description: "Service Bus, Event Hubs, and message queues",
      icon: <Package className="w-5 h-5" />,
      color: "bg-indigo-500/10 border-indigo-500/20",
      resources: data.categories.integration || {},
    },
    configuration: {
      name: "Configuration & Management",
      description: "App Configuration, automation, and settings",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-slate-500/10 border-slate-500/20",
      resources: data.categories.configuration || {},
    },
  };

  const handleResourceClick = (resource: string) => {
    const routeMap: { [key: string]: string } = {
      "Application Insights": "/resource/application-insights",
      "Virtual machine": "/resource/virtual-machines",
      "Service Bus Namespace": "/resource/service-bus",
      "Key vault": "/resource/key-vault",
      "Storage account": "/resource/storage",
      "Azure Cosmos DB account": "/resource/cosmos-db",
      "Log Analytics workspace": "/resource/log-analytics",
      "Application gateway": "/resource/networking",
      "Load balancer": "/resource/networking",
    };

    const route = routeMap[resource];
    if (route) {
      setLocation(route);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {Object.entries(categoryConfig).map(([key, category]) => {
          const totalResources = Object.values(category.resources).reduce((sum, val) => sum + val, 0);
          if (totalResources === 0) return null;

          return (
            <Card key={key} className={`${category.color} border cursor-default`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{category.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {totalResources} alerts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(category.resources)
                    .sort((a, b) => b[1] - a[1])
                    .map(([resource, count]) => {
                      const percentage = (count / totalResources) * 100;
                      return (
                        <div
                          key={resource}
                          onClick={() => handleResourceClick(resource)}
                          className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">{resource}</p>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {count}
                            </Badge>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">{percentage.toFixed(0)}% of category</p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            What Are These Resource Types?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Resource Types</strong> are the different Azure services you use to run your applications and infrastructure. Each type serves a specific purpose and requires different monitoring approaches.
            </p>
            <p>
              The numbers above show how many alert rules you have configured for each resource type. This helps you understand where your monitoring efforts are focused and ensures all critical services are properly watched.
            </p>
            <p>
              <strong>Click on any resource card</strong> to see detailed monitoring information and metrics specific to that service type.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
