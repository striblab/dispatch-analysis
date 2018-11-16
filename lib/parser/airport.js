// Dependencies
const _ = require('lodash');
const moment = require('moment-timezone');
const utils = require('../parser-utils.js');

// Main import function
module.exports = async function airportParser(data, file, cache) {
  /**
  { 'INCIDENT DATE/TIME': '2017-01-17T18:56:54',
  AGENCY: 'MSP Police',
  PROBLEM: 'Check Welfare',
  PREMISE: 'MINNIBAR GATE G4',
  ADDRESS: 'Lindbergh Terminal G Floor 2',
  CITY: 'MSP AIRPORT',
  STATE: 'MN',
  ZIP: '55111',
  LATITUDE: '44880853',
  LONGITUDE: '93209364',
  'TIME FIRST KEYSTROKE': '2017-01-17T18:56:16',
  'TIME CALL ENTERED QUEUE': '2017-01-17T18:56:55',
  'TIME CALLTAKING COMPLETE': '2017-01-17T18:59:16',
  'TIME CALL CLOSED': '2017-01-17T20:17:48',
  'TIME FIRST UNIT ASSIGNED': '2017-01-17T18:59:46',
  'TIME FIRST UNIT ENROUTE': '',
  'TIME FIRST UNIT ARRIVED': '2017-01-17T19:04:05' }
  */

  let parsed = {
    filename: file.file,
    fileId: data.line_number,
    district: file.district,
    fileAgency: file.organization,
    dispatchType: file.type,
    localIncidentId: undefined,
    respondingAgency: utils.clean(data.AGENCY),
    respondingAgencyType: data.AGENCY.match(/police/i)
      ? 'police'
      : data.AGENCY.match(/fire/i)
        ? 'fire'
        : undefined,
    officerInitiated: undefined,
    priorityRaw: undefined,
    priority: undefined,
    dispositionRaw: undefined,
    dispositionCode: undefined,
    incidentRaw: utils.clean(data.PROBLEM),
    incidentCodeRaw: undefined,
    incident: utils.cleanIncident(data.PROBLEM),
    locationRaw: utils.clean(data.PREMISE),
    location: utils.cleanLocation(data.PREMISE),
    locationGroup: utils.cleanLocationGroup(data.PREMISE),
    fullAddress: utils.clean(data.ADDRESS),
    address: utils.clean(data.ADDRESS),
    city: utils.clean(data.CITY),
    state: utils.clean(data.STATE),
    zip: utils.clean(data.ZIP),
    incidentSourceRaw: undefined,
    incidentSource: undefined,
    latitude: utils.parseNoDecimalLatLon(data.LATITUDE),
    longitude: utils.parseNoDecimalLatLon(data.LONGITUDE, 'longitude'),
    incidentTime: utils.cleanDate(data['INCIDENT DATE/TIME']),
    firstKeystroke: utils.cleanDate(data['TIME FIRST KEYSTROKE']),
    incidentInQueue: utils.cleanDate(data['TIME CALL ENTERED QUEUE']),
    callComplete: utils.cleanDate(data['TIME CALLTAKING COMPLETE']),
    incidentClosed: utils.cleanDate(data['TIME CALL CLOSED']),
    firstUnitAssigned: utils.cleanDate(data['TIME FIRST UNIT ASSIGNED']),
    firstUnitEnroute: utils.cleanDate(data['TIME FIRST UNIT ENROUTE']),
    firstUnitArrived: utils.cleanDate(data['TIME FIRST UNIT ARRIVED']),
    notes: undefined,
    originalData: JSON.stringify(data)
  };

  // It looks like there are incidents where first key stroke and
  // unit arriving are the same, and this is probably officer initiaed
  if (
    parsed.firstKeystroke &&
    parsed.firstUnitArrived &&
    parsed.firstKeystroke.getTime() === parsed.firstUnitArrived.getTime()
  ) {
    parsed.officerInitiated = true;
    parsed.notes = `${
      parsed.notes ? parsed.notes + '  ' : ''
    }Assumed officer initiated since first keystroke and unit arrived are the exact same.`;
  }

  // Geo point
  parsed.geometryPoint = utils.makeGeoJSONPoint(
    parsed.latitude,
    parsed.longitude
  );

  // Response time
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
