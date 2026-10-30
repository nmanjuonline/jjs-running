/**
 * Data Access Layer & Abstraction for Flagship Training Programs
 *
 * Current Data Source:
 *   - Modular JSON: src/data/json/programs.json
 *   - Clean unformatted numeric schema (e.g. price: 6000, tax: 5)
 *
 * Database Migration Note:
 *   When connecting to your existing database, update the query/fetch logic below.
 *   Components consume `programsData` or helper functions (`getPrograms()`, `getProgramById()`),
 *   keeping your frontend decoupled from the underlying database schema.
 */

import rawPrograms from './json/programs.json';

// Helper formatters
const formatCurrency = (val) => (typeof val === 'number' ? `₹${val.toLocaleString('en-IN')}` : val);
const formatTax = (val) => (typeof val === 'number' ? `+ ${val}% GST` : val);

/**
 * Hydrated Programs Collection:
 * Retains raw numeric fields (price: 6000, tax: 5) for business calculations and DB adapters,
 * while providing formatted display properties for UI components expecting "₹6,000" and "+ 5% GST".
 */
export const programsData = rawPrograms.map((program) => ({
  ...program,
  // Raw unformatted database values
  rawPrice: program.price,
  rawTax: program.tax,
  // Formatted display values for existing UI presentation
  price: formatCurrency(program.price),
  tax: formatTax(program.tax)
}));

// Helper Query Methods (Ready for future DB / API replacement)
export const getPrograms = () => programsData;
export const getRawPrograms = () => rawPrograms;

export const getProgramById = (id) => {
  return programsData.find((p) => p.id === id || p.title === id) || null;
};

export const getProgramsByCategory = (category) => {
  if (!category || category === 'All') return programsData;
  return programsData.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

export default programsData;
