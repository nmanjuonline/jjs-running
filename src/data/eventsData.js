/**
 * Data Access Layer & Abstraction for Races & Events
 *
 * Current Data Source:
 *   - Modular JSON: src/data/json/races.json (Unformatted database-ready schema: ISO dates, raw counts)
 *
 * Database Migration Note:
 *   When connecting to your existing database, update the query/fetch logic below.
 *   Components consume `eventsData` or helper functions (`getRaces()`, `getRaceById()`),
 *   keeping your frontend decoupled from the underlying database schema.
 */

import rawRaces from './json/races.json';

// Helper date formatter (converts ISO "YYYY-MM-DD" to "Nov 29, 2026")
const formatDate = (isoString) => {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

// Helper participants formatter
const formatParticipants = (count, category) => {
  if (typeof count !== 'number') return count || '';
  if (category && category.includes('All-Women')) {
    return `${count.toLocaleString('en-IN')}+ Women & Girls participating`;
  }
  return `${count.toLocaleString('en-IN')}+ Runners participating`;
};

/**
 * Hydrated Events Collection:
 * Maintains 100% backward compatibility for RaceCalendar.jsx while storing raw data in races.json.
 */
export const eventsData = rawRaces.map((race) => ({
  ...race,
  // Raw unformatted database values
  rawDate: race.date,
  rawParticipantsCount: race.participantsCount,
  rawDistances: race.distances,
  rawElevationGainMeters: race.elevationGainMeters,

  // Formatted display values for UI components
  date: formatDate(race.date),
  location: race.venue || race.city,
  participants: formatParticipants(race.participantsCount, race.category),
  targetDistance: Array.isArray(race.distances) ? race.distances.join(' / ') : race.distances,
  elevation: race.elevationDescription || (race.elevationGainMeters ? `+${race.elevationGainMeters}m Elevation Gain` : '')
}));

// Helper Query Methods (Ready for future DB / API replacement)
export const getRaces = () => eventsData;
export const getRawRaces = () => rawRaces;

export const getRaceById = (id) => {
  return eventsData.find((e) => e.id === id) || null;
};

export const getUpcomingRaces = () => {
  return [...eventsData].sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
};

// Runner Testimonials Collection (Upcoming extraction to stories.json)
export const runnerStories = [
  {
    name: 'Ananya Sharma',
    role: 'Software Architect & Boston Marathon Qualifier',
    center: 'Jayanagar HQ',
    journey: 'From struggling through a 500 m jog to running a 3:24:12 Boston qualifying time',
    quote: 'Before JJs Running, I thought marathoners were born superhuman. The coaches taught me that endurance is pure scientific compounding: heart-rate control, consistent weekend SLRs, and a pack that never lets you give up.',
    avatar: '/images/jjs/1296547704.jpg',
    stats: {
      initialPace: '8:45 min/km',
      currentPace: '4:50 min/km',
      totalKm: '8,400+ km logged',
      marathons: '6 Completed'
    }
  },
  {
    name: 'Vikramaditya Hegde',
    role: 'Cardiologist & Ultra Trail Finisher',
    center: 'Pune University (SPPU)',
    journey: 'Overcoming metabolic syndrome to conquer the Malnad 100K',
    quote: 'As a doctor, I recommend JJs Running to all my patients. The emphasis on injury prevention, mobility drills, and gradual periodization ensures you run for life, not for an orthopedic clinic.',
    avatar: '/images/jjs/2006143083.jpg',
    stats: {
      initialPace: '9:15 min/km',
      currentPace: '5:30 min/km',
      totalKm: '11,200+ km logged',
      marathons: '4 Ultras & 12 Marathons'
    }
  },
  {
    name: 'Preethi Sundararaman',
    role: 'Mother of Two & 10K Champion',
    center: 'HSR Layout',
    journey: 'Joined Fitness Thru Running at age 43 and is now a regular on the podium',
    quote: 'Waking up at 5:00 AM with JJs Running changed my mental health forever. The community is so warm, no runner is left behind, whether you run at 4:30 pace or 9:00 pace.',
    avatar: '/images/jjs/1078542079.jpg',
    stats: {
      initialPace: '10:00 min/km (Walk-Run)',
      currentPace: '5:10 min/km',
      totalKm: '4,800+ km logged',
      marathons: '18 Half Marathons'
    }
  }
];

export default eventsData;
