/**
 * Create hexbin for response time
 */

// Dependencies
const { hexGrid } = require('@turf/turf');
const path = require('path');
const fs = require('fs');
const Progress = require('progress');
const db = require('../db.js');

// Main generate
async function generateHexbin() {
  // Setup database
  await db.connect();

  // Get bbox from data
  let bbox = await getBbox(db);

  // Make hexbin
  let hexbin = hexbinGrid(bbox);

  // Populate each bin
  let filled = await fillHexbin(hexbin);

  // Output
  fs.writeFileSync(
    path.join(
      __dirname,
      '..',
      'data',
      'build',
      'hexbin-response-time.geo.json'
    ),
    JSON.stringify(filled)
  );

  // Close database
  await db.close();
}

// Calculate properties for a hexbin
async function calculateHexbin(feature) {
  let query = `
    SELECT
      COUNT(*) AS count,
      AVG(response_time) AS average_response_time
    FROM
      dispatches AS d
    WHERE
      ST_Within(ST_SetSRID(d.geometry_point, 4326), ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(
    feature.geometry
  )}'), 4326))
      AND (
        officer_initiated IS NULL
        OR officer_initiated = TRUE
      )
      AND response_time IS NOT NULL
      AND response_time < 1200
      AND response_time > 10
	    AND priority IN ('0', '1')
  `;

  let response = await db.sequelize.query(query, { type: db.sequelize.SELECT });
  let parsed = {
    incidents: parseInt(response[0][0].count, 0),
    averageResponseTime: parseFloat(response[0][0].average_response_time)
  };

  // Filter where more than 5 incidents
  if (parsed.incidents > 5) {
    return parsed;
  }

  return {};
}

// Fill each hexbin
async function fillHexbin(hexbin) {
  let bar = new Progress('filling bins [:bar] :rate/bps :percent :etas', {
    total: hexbin.features.length
  });

  for (let bi in hexbin.features) {
    hexbin.features[bi].properties = await calculateHexbin(hexbin.features[bi]);
    bar.tick();
  }

  return hexbin;
}

// Get bbox from table
async function getBbox(db) {
  let response = await db.sequelize.query(
    'SELECT ST_Extent(geometry_point) as extent FROM dispatches',
    { type: db.sequelize.SELECT }
  );

  let m = response[0][0].extent.match(
    /([0-9.-]+) ([0-9.-]+),([0-9.-]+) ([0-9.-]+)/i
  );
  return [
    parseFloat(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    parseFloat(m[4])
  ];
}

// Make hexbin grid
function hexbinGrid(bbox) {
  let cellSide = 0.25;
  let options = { units: 'miles' };

  return hexGrid(bbox, cellSide, options);
}

// Do generation
generateHexbin();
