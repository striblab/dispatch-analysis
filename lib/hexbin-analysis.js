/**
 * Do hexbin anlaysis
 */

// Dependencies
const _ = require('lodash');
const db = require('./db.js');
const argv = require('yargs').argv;

// Main function
async function main() {
  // Setup database
  await db.connect();

  // Create set of bins for histogram
  let step = 60;
  let bins = _.range(0, 1260, step);

  // Query
  let query = `
  SELECT
    h.ogc_fid AS hex_id,
    h.wkb_geometry AS hex_geometry,
    CAST(COUNT(d.*) AS INTEGER) AS incidents,
    AVG(d.response_time) AS avg_response_time,
    MIN(d.response_time) AS min_response_time,
    MAX(d.response_time) AS max_response_time,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.response_time)::numeric, 2) AS median_response_time,

    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY d.response_time) AS response_time_25,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY d.response_time) AS response_time_75,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY d.response_time) AS response_time_90,

    ${bins
    .map((b, bi) => {
      return bi < bins.length - 1
        ? 'SUM(CASE WHEN d.response_time >= ' +
              b +
              ' AND d.response_time < ' +
              (b + step) +
              ' THEN 1 ELSE 0 END) as histo_' +
              b
        : 'SUM(CASE WHEN d.response_time >= ' +
              b +
              ' THEN 1 ELSE 0 END) as histo_' +
              b;
    })
    .join(', ')}
  FROM
    (SELECT DISTINCT
      dispatch_hexes.*
    FROM dispatch_hexes
      INNER JOIN mn_cities AS c
        ON ST_Intersects(dispatch_hexes.wkb_geometry, c.wkb_geometry)
      AND mcd_name IN ('Minneapolis', 'St. Paul', 'Edina', 'Richfield')
    ) AS h
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
      ${
  argv.respondingType
    ? 'AND d.responding_agency_type = \'' + argv.respondingType + '\''
    : ''
}
  GROUP BY
    h.ogc_fid,
    h.wkb_geometry
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
    // Turn into numbers
    _.forEach(r, (v, k) => {
      if (k.match(/^histo/i)) {
        r[k] = parseInt(v, 10);
      }
    });

    // Less precision
    _.forEach(r, (v, k) => {
      if (_.isNumber(v) && !_.isInteger(v)) {
        r[k] = Math.round(v * 1000) / 1000;
      }
    });

    // Mark responding agency
    if (argv.respondingType) {
      r.rType = argv.respondingType;
    }

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
