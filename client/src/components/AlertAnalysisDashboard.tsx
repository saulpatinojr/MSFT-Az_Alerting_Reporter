import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { AlertAnalysis } from '../types/AlertAnalysis';
import { Box, Paper, Typography } from '@mui/material';

interface AlertAnalysisDashboardProps {
  data: AlertAnalysis;
}

export const AlertAnalysisDashboard: React.FC<AlertAnalysisDashboardProps> = ({ data }) => {
  const severityChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Sev1', 'Sev3', 'Sev4'],
    colors: ['#dc3545', '#ffc107', '#17a2b8'],
    legend: {
      position: 'bottom'
    }
  };

  const severityChartSeries = [
    data.stats.severityDistribution.sev1,
    data.stats.severityDistribution.sev3,
    data.stats.severityDistribution.sev4
  ];

  const trendChartOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true
      }
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      title: {
        text: 'Alert Count'
      }
    }
  };

  const trendChartSeries = [{
    name: 'Total Alerts',
    data: data.stats.trendsOverTime.daily.map(item => ([
      new Date(item.date).getTime(),
      item.count
    ]))
  }];

  const labHealthData = Object.entries(data.integrationHealth.labSystems).map(([lab, metrics]) => ({
    name: lab,
    data: [
      { x: 'Error Rate', y: metrics.errorRate },
      { x: 'Availability', y: metrics.availability }
    ]
  }));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        <Box sx={{ gridColumn: '1/-1' }}>
          <Typography variant="h4" gutterBottom>
            Alert Analysis Dashboard
          </Typography>
        </Box>

        {/* Severity Distribution */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Severity Distribution
            </Typography>
            <ReactApexChart
              options={severityChartOptions as any}
              series={severityChartSeries}
              type="donut"
              height={350}
            />
          </Paper>
        </Box>

        {/* Alert Trends */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Alert Trends
            </Typography>
            <ReactApexChart
              options={trendChartOptions as any}
              series={trendChartSeries}
              type="line"
              height={350}
            />
          </Paper>
        </Box>

        {/* Lab Integration Health */}
        <Box sx={{ gridColumn: '1/-1' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lab Integration Health
            </Typography>
            <ReactApexChart
              options={{
                chart: {
                  type: 'heatmap'
                },
                dataLabels: {
                  enabled: true
                }
              } as any}
              series={labHealthData}
              type="heatmap"
              height={350}
            />
          </Paper>
        </Box>

        {/* Monitoring Maturity */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monitoring Maturity
            </Typography>
            <ReactApexChart
              options={{
                chart: {
                  type: 'radar'
                },
                xaxis: {
                  categories: Object.keys(data.maturity.breakdown)
                }
              } as any}
              series={[{
                name: 'Score',
                data: Object.values(data.maturity.breakdown)
              }]}
              type="radar"
              height={350}
            />
          </Paper>
        </Box>

        {/* Alert Fatigue Analysis */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Alert Fatigue - Time Window Analysis
            </Typography>
            <ReactApexChart
              options={{
                chart: {
                  type: 'bar'
                },
                xaxis: {
                  categories: Object.keys(data.alertFatigue.timeWindowAnalysis)
                }
              } as any}
              series={[{
                name: 'Average Duplicates',
                data: Object.values(data.alertFatigue.timeWindowAnalysis).map(
                  tw => tw.averageDuplicates
                )
              }]}
              type="bar"
              height={350}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertAnalysisDashboard;