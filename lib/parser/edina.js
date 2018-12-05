/**
 * Parse Edina data
 */

// Dependencies
const _ = require('lodash');
const moment = require('moment-timezone');
const utils = require('../parser-utils.js');

// Main parser
module.exports = async function edinaParser(data, file) {
  /**
   * Projection of geo coordinates
   * PROJCS["NAD_1983_StatePlane_Minnesota_South_FIPS_2203_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",2624666.666666666],PARAMETER["False_Northing",328083.3333333333],PARAMETER["Central_Meridian",-94.0],PARAMETER["Standard_Parallel_1",43.78333333333333],PARAMETER["Standard_Parallel_2",45.21666666666667],PARAMETER["Latitude_Of_Origin",43.0],UNIT["Foot_US",0.3048006096012192]]
   */

  // Looks like: https://epsg.io/102693

  /**
    { line_number: '1',
  'Event Call Time': '2017-01-01T00:41:37',
  'Event Number': '2017000012',
  'Call Source': 'PHONE',
  'Street Address': '5331 16TH ST W',
  'City ': 'SAINT LOUIS PARK',
  State: 'MN',
  Zip: '55416',
  'Geo X': '2793571',
  'Geo Y': '1046125.13',
  'CAD Site/Business Name': '',
  'Business Type': '',
  'Site Type': '',
  'Nature Code': 'ASSIST OTHER AGENCY-EMS',
  Priority: 'P',
  Agency: 'FIRE',
  Service: 'FIRE',
  Beat: '',
  'Fire District': '',
  'Day of the Week': '1',
  'Report Number': '170001',
  '1st Dispatch Time': '2017-01-01T00:42:34',
  '1st En Route': '2017-01-01T00:44:29',
  '1st Arrived': '',
  '1st Transported': '',
  'Last Clear': '',
  'Primary Unit': '',
  CloseCode: 'CBCK',
  Secs2Arrive: '0',
  Secs2Dispatch: '57',
  Secs2Enroute: '172',
  Secs2Finish: '47',
  Secs2LastClear: '0',
  Secs2Route: '47',
  Secs2Transport: '0',
  SecsArrive2LastClear: '0',
  SecsArrive2Transport: '0',
  SecsDisp2Arrive: '0',
  SecsDisp2Enroute: '115',
  SecsFinished2Dispatch: '10',
  SecsRoute2Dispatch: '10',
  SecsTransport2LastClear: '0',
  TimeReady: '2017-01-01T00:42:21',
  TimeFinished: '2017-01-01T00:42:24',
  TimeRoute: '2017-01-01T00:42:24',
  TimeClose: '2017-01-01T01:04:20' }
    */

  // City has a space in the field name
  _.each(data, (v, k) => {
    data[k.trim()] = v;
  });

  // Basic parse
  let parsed = {
    filename: file.file,
    fileId: data.line_number,
    district: file.district,
    fileAgency: file.organization,
    dispatchType: file.type,
    localIncidentId: data['Event Number'],
    respondingAgency: file.organization.toUpperCase(),
    respondingAgencyType: utils.cleanAgencyType(file.organization),
    officerInitiated:
      data['Call Source'] && data['Call Source'].match(/^self$/i)
        ? true
        : undefined,
    priorityRaw: utils.clean(data.Priority),
    // There is a "P", which seems to be priority, though 1 also seems to be high priority
    priority: utils.cleanNumber(data.Priority === 'P' ? 0 : data.Priority),
    dispositionRaw: utils.clean(data.CloseCode),
    dispositionCode: utils.cleanDisposition(data.CloseCode),
    incidentRaw: utils.clean(data['Nature Code']),
    incidentCodeRaw: undefined,
    incident: utils.cleanIncident(data['Nature Code']),
    incidentGroupRaw: utils.clean(data['Nature Code']),
    incidentGroup: utils.clean(data['Nature Code']),
    locationRaw: utils.clean(data['CAD Site/Business Name']),
    location: utils.cleanLocation(data['CAD Site/Business Name']),
    locationGroup: utils.cleanLocationGroup(
      _.filter([data['Site Type'], data['Business Type']]).join('-')
    ),
    fullAddress: utils.clean(data['Street Address']),
    address: utils.clean(data['Street Address']),
    city: utils.clean(data.City),
    state: utils.clean(data.State),
    zip: utils.clean(data.Zip),
    incidentSourceRaw: utils.clean(data['Call Source']),
    incidentSource: utils.clean(data['Call Source']),
    latitude: undefined,
    longitude: undefined,
    incidentTime: utils.cleanDate(data['Event Call Time']),
    firstKeystroke: utils.cleanDate(data['Event Call Time']),
    incidentInQueue: undefined,
    callComplete: undefined,
    incidentClosed: utils.cleanDate(data.TimeClose),
    firstUnitAssigned: undefined,
    firstUnitEnroute: utils.cleanDate(data['1st En Route']),
    firstUnitArrived: utils.cleanDate(data['1st Arrived']),
    notes: undefined
  };

  // Reporject latitude and longitige
  if (data['Geo X'] && data['Geo Y']) {
    let reprojected = await utils.reprojectFeture(
      {
        type: 'Point',
        coordinates: [
          utils.cleanNumber(data['Geo X']),
          utils.cleanNumber(data['Geo Y'])
        ]
      },
      'EPSG:102693',
      'EPSG:4326'
    );
    if (reprojected) {
      parsed.latitude = reprojected.coordinates[1];
      parsed.longitude = reprojected.coordinates[0];
    }
  }

  // It looks like there are incidents where first key stroke and
  // unit arriving are the same, and this is probably officer initiaed
  //
  // From MPD:
  // If the (FixedTimePhonePickUp time or FixedTimeCallEnteredQueue time) and
  // TimeFIrst_UnitAssigned are within a few seconds, it’s more than likely
  // officer-initiated.  Or, similarly if the TimeFirst_UnitAssigned and
  // TimeFristUnitArrived are within a few seconds, it’s more than likely officer-initiated.
  let officerInitiatedTests = [
    ['firstKeystroke', 'firstUnitAssigned'],
    ['incidentInQueue', 'firstUnitAssigned'],
    ['firstUnitAssigned', 'firstUnitArrived']
  ];
  _.find(officerInitiatedTests, test => {
    if (
      parsed[test[0]] &&
      parsed[test[1]] &&
      Math.abs(parsed[test[0]].getTime() - parsed[test[1]].getTime()) < 3 * 1000
    ) {
      parsed.officerInitiated = true;
      parsed.notes = `${
        parsed.notes ? parsed.notes + '  ' : ''
      }Assumed officer initiated since ${[test[0]]} and ${[
        test[1]
      ]} are a few seconds apart.`;
      return true;
    }
  });

  // Geo point
  parsed.geometryPoint = utils.makeGeoJSONPoint(
    parsed.latitude,
    parsed.longitude
  );

  // Response time (in seconds)
  if (
    parsed.firstKeystroke &&
    parsed.firstUnitArrived &&
    parsed.firstKeystroke.getTime() !== parsed.firstUnitArrived.getTime()
  ) {
    parsed.responseTime =
      (parsed.firstUnitArrived.getTime() - parsed.firstKeystroke.getTime()) /
      1000;
  }

  // Incident time buckets
  if (parsed.incidentTime) {
    let m = moment(parsed.incidentTime);
    parsed.incidentHour = m.hour();
    parsed.incidentWeek = m.week();
    parsed.incidentWeekDay = m.day();
    parsed.incidentMonth = m.month() + 1;
  }

  return parsed;
};
