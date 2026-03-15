import { useQuery } from '@tanstack/react-query';
import fallbackData from '../data/singaporePlanningAreas.json';

// Proxied through Vite (/api-gov → https://api-open.data.gov.sg) to avoid CORS
const POLL_URL =
  '/api-gov/v1/public/api/datasets/d_2cc750190544007400b2cfd5d7f53209/poll-download';

function normalise(rows) {
  return rows
    .filter((r) => r.PLN_AREA_N && r.REGION_N)
    .map((r) => ({
      PLN_AREA_N: r.PLN_AREA_N.toUpperCase().trim(),
      REGION_N: r.REGION_N.toUpperCase().trim(),
    }));
}

async function fetchPlanningAreas() {
  try {
    const pollRes = await fetch(POLL_URL);
    if (!pollRes.ok) return fallbackData;
    const pollJson = await pollRes.json();

    const downloadUrl = pollJson?.data?.url;
    if (!downloadUrl) return fallbackData;

    const dataRes = await fetch(downloadUrl);
    if (!dataRes.ok) return fallbackData;
    const text = await dataRes.text();

    // Parse GeoJSON
    const geojson = JSON.parse(text);
    const features = geojson?.features ?? [];
    if (features.length > 0) {
      const result = normalise(
        features.map((f) => ({
          PLN_AREA_N: f?.properties?.PLN_AREA_N || '',
          REGION_N: f?.properties?.REGION_N || '',
        })),
      );
      if (result.length > 0) return result;
    }
  } catch {
    // network error, CORS, JSON parse failure — all silently fall through
  }

  return fallbackData;
}

export function useSingaporePlanningAreas() {
  return useQuery({
    queryKey: ['sg-planning-areas'],
    queryFn: fetchPlanningAreas,
    placeholderData: fallbackData,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
}
