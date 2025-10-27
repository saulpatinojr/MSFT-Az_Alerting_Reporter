import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { DashboardInsights } from "@/services/types";
import { toast } from "sonner"; // Assuming sonner is installed and configured
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, Network, Shield, Zap, BarChart3, Settings, Package } from "lucide-react";



interface ResourceCategory {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  resources: { [key: string]: number };
}

export default function ResourceTypes() {
  const [, setLocation] = useLocation();

  const { data, isLoading, isError, error } = useQuery<DashboardInsights>({
    queryKey: ['dashboardInsights'],
    queryFn: dataService.fetchDashboardInsights,
  });

  const categoryConfig: { [key: string]: ResourceCategory } = {
    compute: {
      name: "Compute & Workloads",
      description: "Virtual machines, app services, and container resources",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-blue-500/10 border-blue-500/20",
      resources: data?.resource_health_summary?.categories?.compute || {},
    },
    networking: {
      name: "Networking & Connectivity",
      description: "Load balancers, gateways, and network infrastructure",
      icon: <Network className="w-5 h-5" />,
      color: "bg-purple-500/10 border-purple-500/20",
      resources: data?.resource_health_summary?.categories?.networking || {},
    },
    storage: {
      name: "Storage & Data",
      description: "Blob storage, file shares, and data repositories",
      icon: <Database className="w-5 h-5" />,
      color: "bg-green-500/10 border-green-500/20",
      resources: data?.resource_health_summary?.categories?.storage || {},
    },
    databases: {
      name: "Databases & Caching",
      description: "SQL databases, Cosmos DB, Redis, and data services",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-orange-500/10 border-orange-500/20",
      resources: data?.resource_health_summary?.categories?.databases || {},
    },
    analytics: {
      name: "Analytics & Monitoring",
      description: "Application Insights, Log Analytics, and monitoring tools",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-cyan-500/10 border-cyan-500/20",
      resources: data?.resource_health_summary?.categories?.analytics || {},
    },
    security: {
      name: "Security & Compliance",
      description: "Key Vault, security policies, and access management",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-red-500/10 border-red-500/20",
      resources: data?.resource_health_summary?.categories?.security || {},
    },
    integration: {
      name: "Integration & Messaging",
      description: "Service Bus, Event Hubs, and message queues",
      icon: <Package className="w-5 h-5" />,
      color: "bg-indigo-500/10 border-indigo-500/20",
      resources: data?.resource_health_summary?.categories?.integration || {},
    },
    configuration: {
      name: "Configuration & Management",
      description: "App Configuration, automation, and settings",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-slate-500/10 border-slate-500/20",
      resources: data?.resource_health_summary?.categories?.configuration || {},
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
    } else {
      console.warn(`No route found for resource: ${resource}`);
      toast.warning(`No detailed page available for ${resource}.`);
    }
  };

	  if (isLoading) {
	    return (
	      <div className="min-h-[50vh] flex items-center justify-center">
	        <Activity className="w-12 h-12 animate-spin text-primary" />
	        <p className="ml-4">Loading Resource Type Analysis...</p>
	      </div>
	    );
	  }

	  if (isError) {
	    return (
	      <div className="min-h-[50vh] flex items-center justify-center">
	        <AlertCircle className="w-12 h-12 text-red-500" />
	        <p className="ml-4 text-red-500">Error loading resource data: {error.message}</p>
	        <Button onClick={() => window.location.reload()} className="ml-4">Retry</Button>
	      </div>
	    );
	  }

	  return (
	    <div className="space-y-6">
	      <div className="grid gap-6">
	        {Object.entries(categoryConfig).map(([key, category]) => {
          const totalResources = Object.values(category.resources).reduce((sum, val) => sum + val, 0);
          if (totalResources === 0) return null;

          return (
	            <Card key={key} className={`${category.color} border cursor-default`} aria-labelledby={`category-title-${key}`}>
	              <CardHeader>
	                <div className="flex items-start justify-between">
	                  <div className="flex items-start gap-3">
	                    <div className="mt-1">{category.icon}</div>
	                    <div>
	                      <CardTitle className="text-lg" id={`category-title-${key}`}>{category.name}</CardTitle>
	                      <CardDescription>{category.description}</CardDescription>
	                    </div>
	                  </div>
	                  <Badge variant="secondary" className="ml-2 flex-shrink-0" aria-label={`Total alerts: ${totalResources}`}>
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
                          role="button" // Add role for accessibility
                          tabIndex={0} // Make it focusable for keyboard navigation
                          aria-label={`View details for ${resource} with ${count} alerts`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleResourceClick(resource);
                            }
                          }}
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
