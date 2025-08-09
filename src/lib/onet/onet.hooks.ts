"use client";

import { useState, useEffect } from 'react';
import { getMultipleOnetData, type OnetData } from './onet.client';

/**
 * React hook for fetching ONET data in components
 */
export const useOnetData = (serieIds: string[]) => {
  const [data, setData] = useState<OnetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serieIds.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await getMultipleOnetData(serieIds);
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ONET data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serieIds.join(',')]);

  return { data, loading, error };
};
