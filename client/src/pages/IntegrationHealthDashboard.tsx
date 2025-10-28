import React from 'react';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useFetchData } from '../hooks/useFetchData';

interface IntegrationMetrics {
  messageProcessingRate: number;
  errorRate: number;
  avgProcessingTime: number;
  queueDepth: number;
}

interface LabSystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  metrics: IntegrationMetrics;
}

const IntegrationHealthDashboard: React.FC = () => {
  const { data: dashboardConfig } = useFetchData<any>(
    '/data/Default-AMBA_defaults/integration-dashboard-config.json'
  );

  const { data: labSystemsData } = useFetchData<LabSystemStatus[]>(
    '/data/analysis/lab-systems-status.json'
  );

  if (!dashboardConfig || !labSystemsData) {
    return <div>Loading dashboard...</div>;
  }

  const renderStatusGrid = (labSystem: LabSystemStatus) => {
    const { metrics } = labSystem;
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{labSystem.name}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Box sx={{ flexBasis: '23%' }}>
            <Stack>
              <Typography variant="body2">Processing Rate</Typography>
              <Typography variant="h6">
                {metrics.messageProcessingRate.toFixed(2)}/sec
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ flexBasis: '23%' }}>
            <Stack>
              <Typography variant="body2">Error Rate</Typography>
              <Typography variant="h6" color={metrics.errorRate > 5 ? 'error' : 'inherit'}>
                {metrics.errorRate.toFixed(2)}%
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ flexBasis: '23%' }}>
            <Stack>
              <Typography variant="body2">Avg. Processing Time</Typography>
              <Typography variant="h6">
                {(metrics.avgProcessingTime / 1000).toFixed(2)}s
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ flexBasis: '23%' }}>
            <Stack>
              <Typography variant="body2">Queue Depth</Typography>
              <Typography variant="h6">{metrics.queueDepth}</Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    );
  };

  const renderErrorDistributionChart = () => {
    const options = {
      chart: {
        type: 'bar' as const,
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: labSystemsData.map((system) => system.name),
      },
      yaxis: {
        title: {
          text: 'Error Count',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + ' errors',
        },
      },
    };

    const series = [
      {
        name: 'Errors',
        data: labSystemsData.map((system) => system.metrics.errorRate),
      },
    ];

    return (
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lab Integration Health Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {labSystemsData.map((labSystem) => (
          <Box key={labSystem.name}>
            {renderStatusGrid(labSystem)}
          </Box>
        ))}

        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Error Distribution by Lab System
            </Typography>
            {renderErrorDistributionChart()}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default IntegrationHealthDashboard;