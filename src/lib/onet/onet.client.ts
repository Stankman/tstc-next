import { cache } from 'react';

export interface OnetData {
  serieId: string;
  fullSerieId: string;
  occupation: string;
  annualMedian: string;
}

interface OnetError {
  error: string;
  details?: string;
}

// Cache for storing ONET data
const onetCache = new Map<string, { data: OnetData; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetches ONET data for a given serie ID with caching
 */
export const getOnetData = cache(async (serieId: string): Promise<OnetData> => {
  // Check cache first
  const cached = onetCache.get(serieId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`/api/onet/${serieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: OnetError = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data: OnetData = await response.json();
    
    // Cache the successful result
    onetCache.set(serieId, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error(`Failed to fetch ONET data for ${serieId}:`, error);
    throw error;
  }
});

/**
 * Fetches multiple ONET data entries
 */
export const getMultipleOnetData = async (serieIds: string[]): Promise<OnetData[]> => {
  try {
    const promises = serieIds.map(id => getOnetData(id));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch multiple ONET data:', error);
    throw error;
  }
};

/**
 * Prefetch ONET data for better performance
 */
export const prefetchOnetData = (serieIds: string[]): void => {
  serieIds.forEach(async (id) => {
    try {
      await getOnetData(id);
    } catch (error) {
      // Silently fail for prefetch
      console.warn(`Prefetch failed for ONET ${id}:`, error);
    }
  });
};

/**
 * Clear cache for a specific serie ID or all cache
 */
export const clearOnetCache = (serieId?: string): void => {
  if (serieId) {
    onetCache.delete(serieId);
  } else {
    onetCache.clear();
  }
};

/**
 * Get cache status
 */
export const getOnetCacheInfo = () => ({
  size: onetCache.size,
  entries: Array.from(onetCache.keys()),
});

/**
 * Utility function to extract ONET IDs from program ACF data
 */
export const extractOnetIds = (program: { acf?: { onet_ids?: Array<{ onet_id: string }> } }): string[] => {
  return program.acf?.onet_ids?.map(item => item.onet_id) || [];
};
