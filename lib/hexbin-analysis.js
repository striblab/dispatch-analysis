/**
 * Do hexbin anlaysis
 */

// Dependencies
const _ = require('lodash');
const db = require('./db.js');
const argv = require('yargs').argv;

// Cities to include
//const cities = ['Minneapolis', 'St. Paul', 'Edina', 'Richfield'];
const cities = ['Minneapolis', 'St. Paul'];

const agencies = _.flatten(
  cities.map(c => {
    return {
      Minneapolis: ['MPD', 'MFD'],
      'St. Paul': ['SPPD', 'SPFD'],
      Edina: ['EPD', 'EFD'],
      Richfield: ['RPD', 'RFD']
    }[c];
  })
);

// Main function
async function main() {
  // Setup database
  await db.connect();

  // Create set of bins for histogram
  let step = 60;
  let bins = _.range(0, 1260, step);

  // Common where clause to get at the type of incidents
  let commonIncidentFilter = `
    (
      d.officer_initiated IS NULL
      OR d.officer_initiated = FALSE
    )
    AND d.response_time IS NOT NULL
    AND d.response_time < 7200
    AND d.response_time > 10
    AND d.priority IS NOT NULL
    AND d.priority <= 1
  `;

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
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.call_time)::numeric, 2) AS median_call_time,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.to_queue_time)::numeric, 2) AS median_to_queue_time,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.in_queue_time)::numeric, 2) AS median_in_queue_time,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY d.drive_time)::numeric, 2) AS median_drive_time,
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
      AND mcd_name IN ('${cities.join('\', \'')}')
    ) AS h
    LEFT JOIN dispatches AS d
      ON ST_Contains(h.wkb_geometry, d.geometry_point)
      AND ${commonIncidentFilter}
      ${
  argv.respondingType
    ? 'AND d.responding_agency_type = \'' + argv.respondingType + '\''
    : ''
}
      ${
  agencies
    ? 'AND d.responding_agency IN (\'' + agencies.join('\', \'') + '\')'
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
  for (let r of results) {
    // Get highest incident
    let query = `
      SELECT
        d.incident,
        COUNT(d.incident) AS count
      FROM
        dispatches AS d
        INNER JOIN dispatch_hexes AS h
          ON ST_Contains(h.wkb_geometry, d.geometry_point)
          AND h.ogc_fid = '${r.hex_id}'
      WHERE
        ${commonIncidentFilter}
        ${
  argv.respondingType
    ? 'AND d.responding_agency_type = \'' + argv.respondingType + '\''
    : ''
}
      GROUP BY
        d.incident
      ORDER BY
        COUNT(d.incident) DESC,
        d.incident
      LIMIT 1
    `;
    let incidents = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT
    });
    if (incidents && incidents.length) {
      r.most_frequent_incident = incidents[0].incident;
      r.most_frequent_incident_count = incidents[0].count;
    }

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
  }

  // Output
  process.stdout.write(JSON.stringify(geojson));

  // Close database
  await db.close();
}

// Do main
main();
