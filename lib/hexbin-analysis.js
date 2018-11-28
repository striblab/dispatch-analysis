/**
 * Do hexbin anlaysis
 */

// Dependencies
const _ = require('lodash');
const db = require('./db.js');

// Main function
async function main() {
  // Setup database
  await db.connect();

  // Query
  let query = `
  SELECT
    h.ogc_fid AS hex_id,
    h.wkb_geometry AS hex_geometry,
    COUNT(d.*) AS incidents,
    AVG(d.response_time) AS avg_response_time,
    MIN(d.response_time) AS min_response_time,
    MAX(d.response_time) AS max_response_time,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.response_time)::numeric, 2) AS median_response_time,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY d.response_time) AS response_time_25,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY d.response_time) AS response_time_75,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY d.response_time) AS response_time_90,
    SUM(CASE WHEN d.response_time >= 0 AND d.response_time < 60 THEN 1 ELSE 0 END) as histo_0,
    SUM(CASE WHEN d.response_time >= 60 AND d.response_time < 120 THEN 1 ELSE 0 END) as histo_60,
    SUM(CASE WHEN d.response_time >= 120 AND d.response_time < 180 THEN 1 ELSE 0 END) as histo_120,
    SUM(CASE WHEN d.response_time >= 180 AND d.response_time < 240 THEN 1 ELSE 0 END) as histo_180,
    SUM(CASE WHEN d.response_time >= 240 AND d.response_time < 300 THEN 1 ELSE 0 END) as histo_240,
    SUM(CASE WHEN d.response_time >= 300 AND d.response_time < 360 THEN 1 ELSE 0 END) as histo_300,
    SUM(CASE WHEN d.response_time >= 360 AND d.response_time < 420 THEN 1 ELSE 0 END) as histo_360,
    SUM(CASE WHEN d.response_time >= 420 AND d.response_time < 480 THEN 1 ELSE 0 END) as histo_420,
    SUM(CASE WHEN d.response_time >= 480 AND d.response_time < 540 THEN 1 ELSE 0 END) as histo_480,
    SUM(CASE WHEN d.response_time >= 540 AND d.response_time < 600 THEN 1 ELSE 0 END) as histo_540,
    SUM(CASE WHEN d.response_time >= 600 AND d.response_time < 660 THEN 1 ELSE 0 END) as histo_600,
    SUM(CASE WHEN d.response_time >= 660 AND d.response_time < 720 THEN 1 ELSE 0 END) as histo_660,
    SUM(CASE WHEN d.response_time >= 720 AND d.response_time < 780 THEN 1 ELSE 0 END) as histo_720,
    SUM(CASE WHEN d.response_time >= 780 AND d.response_time < 840 THEN 1 ELSE 0 END) as histo_780,
    SUM(CASE WHEN d.response_time >= 840 AND d.response_time < 900 THEN 1 ELSE 0 END) as histo_840,
    SUM(CASE WHEN d.response_time >= 900 AND d.response_time < 960 THEN 1 ELSE 0 END) as histo_900,
    SUM(CASE WHEN d.response_time >= 960 AND d.response_time < 1020 THEN 1 ELSE 0 END) as histo_960,
    SUM(CASE WHEN d.response_time >= 1020 AND d.response_time < 1080 THEN 1 ELSE 0 END) as histo_1020,
    SUM(CASE WHEN d.response_time >= 1080 AND d.response_time < 1140 THEN 1 ELSE 0 END) as histo_1080,
    SUM(CASE WHEN d.response_time >= 1140 AND d.response_time < 1200 THEN 1 ELSE 0 END) as histo_1140,
    SUM(CASE WHEN d.response_time >= 1200 THEN 1 ELSE 0 END) as histo_1200
  FROM
    dispatch_hexes AS h
    LEFT JOIN dispatches AS d
      ON ST_Contains(h.wkb_geometry, d.geometry_point)
      AND (
        d.officer_initiated IS NULL
        OR d.officer_initiated = FALSE
      )
      AND d.response_time IS NOT NULL
      AND d.response_time < 7200
      AND d.response_time > 10
      AND d.priority IS NOT NULL
      AND d.priority <= 1
    INNER JOIN mn_cities AS c
      ON ST_Intersects(h.wkb_geometry, c.wkb_geometry)
      AND mcd_name IN ('Minneapolis', 'St. Paul')
  GROUP BY
    h.ogc_fid
  ORDER BY
    incidents DESC;
  `;

  // Run query
  let results = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT
  });

  // Turn into JSON
  let geojson = {
    type: 'FeatureCollection',
    features: []
  };
  results.forEach(r => {
    geojson.features.push({
      type: 'Feature',
      geometry: r.hex_geometry,
      properties: _.omit(r, 'hex_geometry')
    });
  });

  // Output
  process.stdout.write(JSON.stringify(geojson));

  // Close database
  await db.close();
}

// Do main
main();
