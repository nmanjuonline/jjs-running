/**
 * Data Access Layer & Abstraction for Training Centers and Training Center Heads (TCHs)
 *
 * Current Data Source:
 *   - Modular JSON files:
 *     - src/data/json/centers.json (Training grounds & centers with map URLs & vicinities)
 *     - src/data/json/tchs.json (Individual Training Center Heads)
 *
 * Architecture Notes:
 *   - Centers and TCHs have a 1-to-many relationship (centers can have multiple TCHs, e.g. Jayanagar and BGR).
 *   - Each TCH is an individual person record with distinct ID, contact, and center assignment.
 *   - Database Migration Note: When connecting to your existing database, update the data adapter below.
 *     UI components consume `centersData`, `tchsData`, or the helper query getters without needing schema changes.
 */

import rawCenters from './json/centers.json';
import rawTchs from './json/tchs.json';

// Fast O(1) lookup map for TCH records
const tchMap = new Map(rawTchs.map((tch) => [tch.id, tch]));

// Fast O(1) lookup map for Centers
const centerMap = new Map(rawCenters.map((center) => [center.id, center]));

/**
 * Hydrated Centers Collection:
 * Resolves all assigned TCHs for each center.
 * Provides backward-compatible `center.tch` (e.g. "Kumar & Girish")
 * alongside the full array `center.tchs`.
 */
export const centersData = rawCenters.map((center) => {
  const tchs = (center.tchIds || [])
    .map((tchId) => tchMap.get(tchId))
    .filter(Boolean);

  const tchDisplayNames = tchs.map((t) => t.name).join(' & ');

  return {
    ...center,
    // Formatted display string for existing components expecting `center.tch`
    tch: tchDisplayNames || 'TCH Assigned',
    // Full array of individual TCH objects
    tchs: tchs
  };
});

/**
 * Hydrated TCHs Collection:
 * Each TCH record with resolved center reference.
 */
export const tchsData = rawTchs.map((tch) => {
  const center = centerMap.get(tch.centerId) || null;
  return {
    ...tch,
    center: center
      ? {
          id: center.id,
          name: center.name,
          city: center.city,
          venue: center.venue,
          mapUrl: center.mapUrl
        }
      : null
  };
});

// Helper Query Methods (Ready for future DB / API replacement)
export const getCenters = () => centersData;
export const getTchs = () => tchsData;

export const getCenterById = (id) => {
  return centersData.find((c) => c.id === id) || null;
};

export const getTchById = (id) => {
  return tchsData.find((t) => t.id === id) || null;
};

export const getTchsByCenterId = (centerId) => {
  return tchsData.filter((t) => t.centerId === centerId);
};

export const getCentersByCity = (city) => {
  if (!city || city === 'All Cities') return centersData;
  return centersData.filter((c) => c.city.toLowerCase() === city.toLowerCase());
};

export default centersData;
