/**
 * Data Access Layer & Abstraction for Training Centers and Coaches
 *
 * Current Data Source:
 *   - Modular JSON files:
 *     - src/data/json/centers.json (Training grounds & centers with map URLs & vicinities)
 *     - src/data/json/coaches.json (Training Center Heads & Coaches with bios & contacts)
 *
 * Database Migration Note:
 *   When connecting to your existing database, update the data fetching / adapter functions below.
 *   Components consume `centersData`, `coachesData`, or the helper query getters (`getCenters()`, `getCoaches()`),
 *   keeping the UI completely decoupled from your underlying database schema.
 */

import rawCenters from './json/centers.json';
import rawCoaches from './json/coaches.json';

// Fast O(1) lookup map for coaches
const coachMap = new Map(rawCoaches.map((coach) => [coach.id, coach]));

// Fast O(1) lookup map for centers
const centerMap = new Map(rawCenters.map((center) => [center.id, center]));

/**
 * Hydrated Centers Collection:
 * Joins center data with its designated coach record,
 * while maintaining 100% backward compatibility (e.g. `center.tch`, `mapUrl`, `vicinity`).
 */
export const centersData = rawCenters.map((center) => {
  const coach = coachMap.get(center.coachId) || null;
  return {
    ...center,
    // Preserves compatibility with existing components expecting `center.tch`
    tch: coach ? coach.name : 'TCH Assigned',
    // Full coach relationship object for enriched UI/modal use
    coach: coach
  };
});

/**
 * Hydrated Coaches Collection:
 * Includes reference to primary center details.
 */
export const coachesData = rawCoaches.map((coach) => {
  const center = centerMap.get(coach.primaryCenterId) || null;
  return {
    ...coach,
    center: center ? { id: center.id, name: center.name, city: center.city, venue: center.venue, mapUrl: center.mapUrl } : null
  };
});

// Helper Query Methods (Ready for future DB / API service replacement)
export const getCenters = () => centersData;
export const getCoaches = () => coachesData;

export const getCenterById = (id) => {
  return centersData.find((c) => c.id === id) || null;
};

export const getCoachById = (id) => {
  return coachesData.find((c) => c.id === id) || null;
};

export const getCentersByCity = (city) => {
  if (!city || city === 'All Cities') return centersData;
  return centersData.filter((c) => c.city.toLowerCase() === city.toLowerCase());
};

export default centersData;
