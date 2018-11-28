/**
 * Do hexbin anlaysis
 */

// Dependencies
const csv = require('d3-dsv').dsvFormat(',');
const _ = require('lodash');
const db = require('./db.js');

// Main function
async function main() {
  // Setup database
  await db.connect();

  // Query
  let query = `
  SELECT
    h.geoid AS tract_id,
    h.name AS tract_name,
    h.wkb_geometry AS tract_geometry,
    h.b19013001 AS median_household_income,
    COUNT(d.*) AS incidents,
    AVG(d.response_time) AS avg_response_time,
    MIN(d.response_time) AS min_response_time,
    MAX(d.response_time) AS max_response_time,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.response_time)::numeric, 2) AS median_response_time
  FROM
    census_tracts_b19013 AS h
    LEFT JOIN dispatches AS d ON
      ST_Contains(h.wkb_geometry, d.geometry_point)
      AND (
        d.officer_initiated IS NULL
        OR d.officer_initiated = FALSE
      )
      AND d.response_time IS NOT NULL
      AND d.response_time < 7200
      AND d.response_time > 10
      AND d.priority IS NOT NULL
      AND d.priority <= 1
  GROUP BY
    h.geoid,
    h.name,
    h.wkb_geometry,
    h.b19013001
  HAVING
    COUNT(d.*) > 10
  ORDER BY
    median_household_income DESC;
  `;

  // Run query
  let results = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT
  });

  // Turn into CSV
  let csvData = _.map(results, r => {
    return _.omit(r, 'tract_geometry');
  });

  // Output
  process.stdout.write(csv.format(csvData));

  // Close database
  await db.close();
}

// Do main
main();
