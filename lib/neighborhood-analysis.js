/**
 * Do neighborhood analysis
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
      p.bdname AS neighborhood,
      AVG(d.response_time) / 60 AS average_response_time,
      (ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.response_time)::numeric, 2)) / 60 AS median_response_time,
      AVG(d.call_time) / 60 AS average_call_time,
      (ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.call_time)::numeric, 2)) / 60 AS median_call_time,
      AVG(d.to_queue_time) / 60 AS average_to_queue_time,
      (ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.to_queue_time)::numeric, 2)) / 60 AS median_to_queue_time,
      AVG(d.in_queue_time) / 60 AS average_in_queue_time,
      (ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.in_queue_time)::numeric, 2)) / 60 AS median_in_queue_time,
      AVG(d.drive_time) / 60 AS average_drive_time,
      (ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.drive_time)::numeric, 2)) / 60 AS median_drive_time,
      COUNT(*)::numeric AS incidents
    FROM
      dispatches AS d
        INNER JOIN mpls_neighborhoods AS p
          ON ST_Contains(p.wkb_geometry, d.geometry_point)
    WHERE
      (
        d.officer_initiated IS NULL
        OR d.officer_initiated = FALSE
      )
      AND d.response_time IS NOT NULL
      AND d.response_time < 7200
      AND d.response_time > 10
      AND d.priority IS NOT NULL
      AND d.priority <= 1
      AND d.responding_agency = 'MPD'
    GROUP BY
      p.bdname
    ORDER BY
      p.bdname
    ;
  `;

  // Run query
  let results = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT
  });

  // Turn into CSV
  let csvData = _.map(results, r => {
    return r;
  });

  // Output
  process.stdout.write(JSON.stringify(csvData));
  process.stdout.write('\n');

  // Close database
  await db.close();
}

// Do main
main();
