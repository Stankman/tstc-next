// Client functions (can be used in both server and client components)
export {
  getOnetData,
  getMultipleOnetData,
  prefetchOnetData,
  clearOnetCache,
  getOnetCacheInfo,
  extractOnetIds,
  type OnetData
} from './onet.client';

// React hooks (client components only)
export { useOnetData } from './onet.hooks';
