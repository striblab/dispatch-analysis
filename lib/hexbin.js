/**
 * Create hexbin from the command line
 */

// Dependencies
const { hexGrid } = require('@turf/turf');
const db = require('./db.js');
const argv = require('yargs').argv;

// Main generate
async function generateHexbin() {
  // Setup database
  await db.connect();

  // Get bbox from data
  let bbox = await getBbox(db);

  // Make hexbin
  let hexbin = hexbinGrid(bbox);

  // Output for piping
  process.stdout.write(JSON.stringify(hexbin));

  // Close database
  await db.close();
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
  let cellSide = argv.side ? parseFloat(argv.side) : 0.25;
  let options = { units: argv.units || 'miles' };

  return hexGrid(bbox, cellSide, options);
}

// Do generation
generateHexbin();
