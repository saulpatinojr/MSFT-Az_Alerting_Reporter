import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ApplicationInsights from "./pages/ApplicationInsights";
import AlertFatigueRiskDashboard from "./pages/AlertFatigueRiskDashboard";
import ResourceHealthDashboard from "./pages/ResourceHealthDashboard";
import AlertCorrelationAnalysis from "./pages/AlertCorrelationAnalysis";
import AlertConfigurationAnalysis from "./pages/AlertConfigurationAnalysis";
import EnvironmentDistributionDashboard from "./pages/EnvironmentDistributionDashboard";
import MonitoringMaturityDashboard from "./pages/MonitoringMaturityDashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/resource/application-insights"} component={ApplicationInsights} />
      <Route path={"/dashboard/alert-fatigue"} component={AlertFatigueRiskDashboard} />
      <Route path={"/dashboard/resource-health"} component={ResourceHealthDashboard} />
      <Route path={"/dashboard/alert-correlation"} component={AlertCorrelationAnalysis} />
      <Route path={"/dashboard/configuration-analysis"} component={AlertConfigurationAnalysis} />
      <Route path={"/dashboard/environment-distribution"} component={EnvironmentDistributionDashboard} />
      <Route path={"/dashboard/monitoring-maturity"} component={MonitoringMaturityDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
	      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

