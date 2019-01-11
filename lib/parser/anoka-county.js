// Dependencies
const _ = require('lodash');
const moment = require('moment-timezone');
const utils = require('../parser-utils.js');

// Main import function
module.exports = async function anokaCountyParser(data, file, cache) {
  /**
  { line_number: '266',
  'Response Date': '42736.3199421296',
  Problem: 'F32I-Medical Lift Assist',
  Address: '8822 Van Buren St Ne',
  APT: '',
  City: 'Blaine',
  Jurisdiction: 'SBM Fire',
  'Agency Type': 'FIRE/EMS',
  Longitude: '93249874',
  Latitude: '45130939',
  'Phone Pickup': '42736.3199421296',
  Dispatched: '',
  Arrived: '',
  'Call closed': '42736.3209375',
  'Location Name': '',
  o: '',
  p: '' }
  */

  // There is some bad data.  It looks like data got shifted over, which suggests
  // some parsing, re-formatting issue.  TODO: Our error?
  if (utils.cleanAgencyType(data['Agency Type']) === 'unknown') {
    return false;
  }

  // Basic parse
  let parsed = {
    filename: file.file,
    fileId: data.line_number,
    district: file.district,
    fileAgency: file.organization,
    dispatchType: file.type,
    localIncidentId: undefined,
    respondingAgency: utils.clean(data.Jurisdiction),
    respondingAgencyType: utils.cleanAgencyType(data['Agency Type']),
    officerInitiated: undefined,
    priorityRaw: undefined,
    priority: undefined,
    dispositionRaw: undefined,
    dispositionCode: undefined,
    incidentRaw: utils.clean(data.Problem),
    incidentCodeRaw: utils.clean(data.Problem.split('-')[0]),
    incident: utils.cleanIncident(
      data.Problem.split('-')
        .slice(1)
        .join('-')
    ),
    locationRaw: utils.clean(data['Location Name']),
    location: utils.cleanLocation(data['Location Name']),
    locationGroup: utils.cleanLocationGroup(data['Location Name']),
    fullAddress: utils.clean(data.Address),
    address: utils.clean(data.Address),
    city: utils.clean(data.City),
    state: 'MN',
    zip: undefined,
    incidentSourceRaw: undefined,
    incidentSource: undefined,
    latitude: utils.parseNoDecimalLatLon(data.Latitude),
    longitude: utils.parseNoDecimalLatLon(data.Longitude, 'longitude'),
    incidentTime: utils.excelToJSDate(data['Response Date']),
    firstKeystroke: utils.excelToJSDate(data['Phone Pickup']),
    incidentInQueue: undefined,
    callComplete: undefined,
    incidentClosed: utils.excelToJSDate(data['Call closed']),
    firstUnitAssigned: utils.excelToJSDate(data['Dispatched']),
    firstUnitEnroute: undefined,
    firstUnitArrived: utils.excelToJSDate(data['Arrived']),
    notes: undefined
  };

  // Common
  parsed = common.officerInitiated(parsed);
  parsed = common.makeGeoPoint(parsed);
  parsed = common.responseTime(parsed);
  parsed = common.callTime(parsed);
  parsed = common.toQueueTime(parsed);
  parsed = common.inQueueTime(parsed);
  parsed = common.driveTime(parsed);
  parsed = common.incidentTimeParts(parsed);

  return parsed;
};
