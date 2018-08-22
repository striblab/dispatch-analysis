/**
 * Some helpful functions
 */

// Dependencies
const _ = require('lodash');
const debug = require('debug')('dispatch:parser-utils');

// Generic clean
function clean(input) {
  if (_.isString(input) && input.match(/null/i)) {
    return null;
  }

  if (_.isString(input) && input.trim() === '') {
    return undefined;
  }

  if (_.isString(input)) {
    return input.trim().replace(/\s+/, ' ');
  }
}

// Boolean
function cleanBoolean(input, falsey = false) {
  // Valid non-boolean values
  if (input === null || input === undefined) {
    return falsey ? false : input;
  }

  if (_.isString(input) && input.trim() === '') {
    return false;
  }

  if (!input) {
    return false;
  }

  if (_.isString(input) && input.trim().match(/^(true|yes|1)$/i)) {
    return true;
  }

  if (_.isString(input) && input.trim().match(/^(false|no|nan|0)$/i)) {
    return false;
  }

  throw new Error(`Unable to parse boolean from: "${input}"`);
}

// Clean number
function cleanNumber(input, float = true) {
  let parse = float ? parseFloat : parseInt;

  if (input === null || input === undefined) {
    return input;
  }

  if (_.isNumber(input)) {
    return input;
  }

  if (_.isString(input) && !_.isNaN(parse(input.replace(/[^0-9.]+/, '')))) {
    return parse(input.replace(/[^0-9.]+/, ''));
  }

  return undefined;
}

// Date
function cleanDate(input) {
  input = clean(input);

  if (_.isString(input) && input.length < 4) {
    return undefined;
  }

  let d = Date.parse(input);
  if (!_.isNaN(d)) {
    return new Date(input);
  }

  return undefined;
}

// Standardize incident
function cleanIncident(input) {
  input = clean(input);

  if (_.isString(input) && input.length < 4) {
    return undefined;
  }

  if (!_.isString(input)) {
    return undefined;
  }

  // Matches
  let matches = [
    [/^traffic\s+stop$/i, 'traffic stop'],
    [/^directed\s+patrol$/i, 'directed patrol'],
    [/^suspicious.*(bag|item)/i, 'suspicious item'],
    [/^suspicious.*(person)/i, 'suspicious person'],
    [/^suspicious.*(vehicle)/i, 'suspicious vehicle'],
    [/^911\s+calls?$/i, '911 call'],
    [/^public\s+assist$/i, 'public assistance']
  ];
  let m = matches.find(m => {
    return input.match(m[0]);
  });
  if (m) {
    return m[1];
  }

  //console.log(input);
  return input;
}

// Clean location
function cleanLocation(input) {
  input = clean(input);

  if (_.isString(input) && input.length < 4) {
    return undefined;
  }

  if (!_.isString(input)) {
    return undefined;
  }

  return input;
}

// Group locations
function cleanLocationGroup(input) {
  input = clean(input);

  if (_.isString(input) && input.length < 4) {
    return undefined;
  }

  if (!_.isString(input)) {
    return undefined;
  }

  return undefined;
}

// Clean agency type
function cleanAgencyType(input) {
  input = clean(input);

  if (!_.isString(input)) {
    return 'unknown';
  }

  if (input.match(/(law.*enf|police)/i)) {
    return 'police';
  }

  if (input.match(/fire.*(ems|med)/i)) {
    return 'fire-medical';
  }

  if (input.match(/(ems|medical)/i)) {
    return 'medical';
  }

  if (input.match(/(fire)/i)) {
    return 'fire';
  }

  debug(`Unable to determine agency type from: ${input}`);
  return 'unknown';
}

// Excel number data to real date
// https://gist.github.com/christopherscott/2782634
function excelToJSDate(input) {
  input = cleanNumber(input);

  if (!input) {
    return undefined;
  }

  return new Date((input - (25567 + 2)) * 86400 * 1000);
}

// Parse non-decimal lat/lon
function parseNoDecimalLatLon(input, xy) {
  if (
    !input ||
    (_.isString(input) && !input.trim()) ||
    (input.length && input.length < 3)
  ) {
    return undefined;
  }

  if (_.isNumber(input)) {
    return input;
  }

  if (!_.isString(input)) {
    return undefined;
  }

  let n = cleanNumber(`${input.slice(0, 2)}.${input.slice(2)}`);

  // Some numbers come in without negative
  if (xy === 'longitude' && n > 0) {
    return n * -1;
  }
  if (xy === 'latitude' && n < 0) {
    return n * -1;
  }

  return n;
}

// Make GeoJSON version point
function makeGeoJSONPoint(lat, lon) {
  if (!lat || !lon || !_.isNumber(lat) || !_.isNumber(lon)) {
    return undefined;
  }

  return {
    type: 'Point',
    coordinates: [lon, lat],
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:4326'
      }
    }
  };
}

// Export
module.exports = {
  clean,
  cleanBoolean,
  cleanNumber,
  cleanDate,
  cleanIncident,
  cleanLocation,
  cleanLocationGroup,
  cleanAgencyType,
  excelToJSDate,
  parseNoDecimalLatLon,
  makeGeoJSONPoint
};
