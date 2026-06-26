import { API_URL } from './socket';

// Secured REST call — the service requires the x-api-key header.
export async function fetchRecentAlerts(apiKey, limit = 10) {
  const res = await fetch(`${API_URL}/api/alerts?limit=${limit}`, {
    headers: { 'x-api-key': apiKey },
  });
  if (res.status === 401) throw new Error('Unauthorized — check API key');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data || [];
}