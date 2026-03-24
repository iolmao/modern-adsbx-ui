export type FeedType = 'autodiscovered' | 'local' | 'external';

const LOCAL_PATTERNS = [
  /^https?:\/\/localhost/,
  /^https?:\/\/127\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/10\./,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./,
  /^https?:\/\/[^/]+\.local/,
];

export function getFeedType(url: string, discoveredUrl: string | null): FeedType {
  if (discoveredUrl && url === discoveredUrl) return 'autodiscovered';
  if (LOCAL_PATTERNS.some((p) => p.test(url))) return 'local';
  return 'external';
}

export const FEED_TYPE_LABEL: Record<FeedType, string> = {
  autodiscovered: 'Auto-discovered',
  local:          'Local network',
  external:       'External feed',
};
