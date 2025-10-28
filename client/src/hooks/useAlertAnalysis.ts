import { useEffect, useState } from 'react';
import { AlertAnalysis } from '../types/AlertAnalysis';
import axios from 'axios';

export const useAlertAnalysis = () => {
  const [data, setData] = useState<AlertAnalysis | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const response = await axios.get('/data/analysis/alert_configuration_analysis.md');
        const content = response.data as string;
        const blocks = content.match(/```json\n([\s\S]*?)```/g) || [];
        const jsonBlocks = blocks.map((block: string) =>
          JSON.parse(block.replace(/```json\n/, '').replace(/```$/, ''))
        );
        const result: AlertAnalysis = {
          stats: jsonBlocks[1] || {},
          patterns: jsonBlocks[2] || {},
          resourceMetrics: jsonBlocks[3] || {},
          alertFatigue: jsonBlocks[4] || {},
          integrationHealth: jsonBlocks[5] || {},
          maturity: jsonBlocks[6] || {},
          metadata: jsonBlocks[7] || {}
        } as any;
        if (alive) setData(result);
      } catch (e: any) {
        if (alive) setError(e);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, isLoading, error } as const;
};
