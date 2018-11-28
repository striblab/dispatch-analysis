// Dependencies
const _ = require('lodash');
const moment = require('moment-timezone');
const utils = require('../parser-utils.js');

// Main import function
module.exports = async function minneapolisParser(data, file, cache) {
  /**
  '﻿Master_Incident_Number': '17-0000001',
  Response_Date: '2017-01-01T00:05:57',
  Agency_Type: 'FIRE',
  Problem: 'Assist EMS Crew (F)',
  Incident_Type: 'Medical Closest Unit (E-L-R)',
  Location_Name: 'HYATT REGENCY',
  Location_Type: 'Hotel',
  City: 'MINNEAPOLIS',
  State: 'MN',
  ZipCode: '55403',
  Fixed_Time_PhonePickUp: '',
  Fixed_Time_CallEnteredQueue: '2017-01-01T00:05:57',
  Fixed_Time_CallTakingComplete: '',
  Time_First_Unit_Assigned: '2017-01-01T00:06:05',
  Time_First_Unit_Enroute: '2017-01-01T00:07:10',
  Time_First_Unit_Arrived: '2017-01-01T00:09:43',
  Fixed_Time_CallClosed: '2017-01-01T00:23:01',
  latitude: '44.97105',
  longitude: '-93.27715',
  HouseNumber: '1300',
  Address: '1300 Nicollet Mall',
  StreetName: 'NICOLLET ',
  StreetType: 'MALL ',
  StreetDirection: '',
  Priority_Number: '2',
  Call_Disposition: '' }
  */

  // There's an odd character in the incident field
  let localIncidentId = _.find(data, (d, di) => {
    return di.match(/master.*incident/i);
  });

  // Basic parse
  let parsed = {
    filename: file.file,
    fileId: data.line_number,
    district: file.district,
    fileAgency: file.organization,
    dispatchType: file.type,
    localIncidentId: localIncidentId,
    respondingAgency: data.Agency_Type === 'FIRE' ? 'MFD' : 'MPD',
    respondingAgencyType: utils.cleanAgencyType(data.Agency_Type),
    officerInitiated: undefined,
    priorityRaw: utils.clean(data.Priority_Number),
    priority: utils.clean(data.Priority_Number),
    dispositionRaw: utils.clean(data.Call_Disposition),
    dispositionCode: utils.clean(
      data.Call_Disposition ? data.Call_Disposition.split('-')[0] : ''
    ),
    incidentRaw: utils.clean(data.Problem),
    incidentCodeRaw: undefined,
    incident: utils.cleanIncident(data.Problem),
    incidentGroupRaw: data.Incident_Type,
    incidentGroup: data.Incident_Type,
    locationRaw: utils.clean(data.Location_Name),
    location: utils.cleanLocation(data.Location_Name),
    locationGroup: utils.cleanLocationGroup(data.Location_Type),
    fullAddress: utils.clean(data.Address),
    address: utils.clean(data.Address),
    city: utils.clean(data.City),
    state: utils.clean(data.State),
    zip: utils.clean(data.ZipCode),
    incidentSourceRaw: undefined,
    incidentSource: undefined,
    latitude: utils.cleanNumber(data.latitude, true),
    longitude: utils.cleanNumber(data.longitude, true),
    incidentTime: utils.cleanDate(data.Response_Date),
    firstKeystroke: utils.cleanDate(data.Fixed_Time_PhonePickUp),
    incidentInQueue: utils.cleanDate(data.Fixed_Time_CallEnteredQueue),
    callComplete: utils.cleanDate(data.Fixed_Time_CallTakingComplete),
    incidentClosed: utils.cleanDate(data.Fixed_Time_CallClosed),
    firstUnitAssigned: utils.cleanDate(data.Time_First_Unit_Assigned),
    firstUnitEnroute: utils.cleanDate(data.Time_First_Unit_Enroute),
    firstUnitArrived: utils.cleanDate(data.Time_First_Unit_Arrived),
    notes: undefined
  };

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
