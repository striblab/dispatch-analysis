/**
 * Wrapper around ogr2ogr to use environment variable to
 * get stdin geojson to postgis
 */

// Dependencies
const { spawn } = require('child_process');
const { URL } = require('url');
const _ = require('lodash');
const db = require('./db.js');
const argv = require('yargs').argv;
//const debug = require('debug')('dispatch:geojson-to-postgis');
require('dotenv').load();

// Get database
if (!process.env.DISPATCH_DB_URI) {
  throw new Error('Environment variable, DISPATCH_DB_URI, is not set.');
}
let dbParts = new URL(process.env.DISPATCH_DB_URI);
if (!dbParts.protocol.match(/^postgres/i)) {
  throw new Error('DISPATCH_DB_URI must be of protocol type "postgres".');
}

// Spawn
let commandArguments = [
  '-f',
  'PostgreSQL',
  `PG:dbname=${dbParts.pathname.replace(/\//m, '')} user=${
    dbParts.username
  } host=${dbParts.hostname}`,
  '/vsistdin/',
  argv.append ? '-append' : '-overwrite',
  '-nln',
  argv.table || 'geojson_import',
  argv.sourceProj ? '-s_srs' : '',
  argv.sourceProj ? argv.sourceProj : '',
  argv.targetProj ? '-t_srs' : '',
  argv.targetProj ? argv.targetProj : ''
];
const ogr2ogr = spawn('ogr2ogr', _.filter(commandArguments), {
  stdio: 'inherit',
  env: process.env
});

// Add indexes
ogr2ogr.on('close', async code => {
  if (code !== 0) {
    console.error(`ogr2ogr process exited with code ${code}`);
    return;
  }

  // Setup database
  await db.connect();

  // Create index
  await db.sequelize.query(
    `CREATE INDEX ${
      argv.table
    }_wkb_geom_idx ON dispatch_hexes USING GIST (wkb_geometry);`
  );

  // Close database
  await db.close();
});
