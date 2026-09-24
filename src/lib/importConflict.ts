const OFFICIAL_MOCK_OVERLAP_PREFIX = 'OFFICIAL_MOCK_OVERLAP:';

export function officialMockOverlapMessage(error: unknown): string | null {
  const message = String(error);
  const index = message.indexOf(OFFICIAL_MOCK_OVERLAP_PREFIX);
  if (index < 0) return null;
  return message.slice(index + OFFICIAL_MOCK_OVERLAP_PREFIX.length);
}
