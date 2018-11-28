// Dependencies
const _ = require('lodash');
const moment = require('moment-timezone');
const utils = require('../parser-utils.js');

// Main import function
module.exports = async function stPaulParser(data, file, cache) {
  // SPPD and SPFD seems to be the same

  // SPPD
  /**
  { line_number: '1',
  Master_Incident_Number: '20170101-0000003',
  Response_Date: '2017-01-01T00:01:15',
  Agency: 'SPPD',
  Longitude: '93089567',
  Latitude: '44930100',
  Address: '513-540 Winslow Ave',
  City: 'St Paul',
  State: '',
  PostalCode: '55107',
  LocationName: '',
  Location_Type: '',
  IncidentType: 'PPV - Police Proactive Visit',
  Priority_Description: '5 Admin activities',
  Time_PhonePickUp: '2017-01-01T00:01:15',
  Time_FirstCallTakingKeystroke: '2017-01-01T00:01:15',
  Time_CallEnteredQueue: '2017-01-01T00:01:15',
  Time_CallTakingComplete: '2017-01-01T00:01:15',
  Time_CallClosed: '2017-01-01T00:04:59.333000',
  Time_First_Unit_Assigned: '2017-01-01T00:01:15',
  Time_First_Unit_Enroute: '2017-01-01T00:01:16',
  Time_First_Unit_Arrived: '2017-01-01T00:01:16',
  Fixed_Time_PhonePickUp: '2017-01-01T00:01:15',
  Fixed_Time_CallEnteredQueue: '2017-01-01T00:01:15',
  Fixed_Time_CallTakingComplete: '',
  Fixed_Time_CallClosed: '2017-01-01T00:04:59.333000',
  ClockStartTime: '2017-01-01T00:01:34',
  TimeFirstStaged: '',
  TimeFirstPTContact: '',
  TimeFirstDelayedAvail: '',
  TimeFirstCallCleared: '2017-01-01T00:04:59.333000',
  Call_Disposition: 'A - Advise/assist'
  */

  // SPFD
  /**
  { line_number: '243',
  Master_Incident_Number: '20170102-0002988',
  Response_Date: '2017-01-02T22:09:42',
  Agency: 'SPFD',
  Longitude: '93094251',
  Latitude: '44954458',
  Address: '640 Jackson St',
  City: 'St Paul',
  State: 'MN',
  PostalCode: '55101',
  LocationName: '1045 larp',
  Location_Type: 'Hospital',
  IncidentType: 'BLS - BLS Transport',
  Time_PhonePickUp: '2017-01-02T22:09:40',
  Time_FirstCallTakingKeystroke: '2017-01-02T22:09:42',
  Time_CallEnteredQueue: '2017-01-02T22:10:09',
  Time_CallTakingComplete: '2017-01-02T22:10:50',
  Time_CallClosed: '2017-01-02T23:29:27.987000',
  Time_First_Unit_Assigned: '2017-01-02T22:10:19',
  Time_First_Unit_Enroute: '2017-01-02T22:10:19',
  Time_First_Unit_Arrived: '2017-01-02T22:18:11',
  Fixed_Time_PhonePickUp: '2017-01-02T22:09:40',
  Fixed_Time_CallEnteredQueue: '2017-01-02T22:10:09',
  Fixed_Time_CallTakingComplete: '2017-01-02T22:10:50',
  Fixed_Time_CallClosed: '2017-01-02T23:29:27.987000',
  ClockStartTime: '2017-01-02T22:09:42',
  TimeFirstStaged: '',
  TimeFirstPTContact: '',
  TimeFirstDelayedAvail: '',
  TimeFirstCallCleared: '2017-01-02T23:29:27.987000',
  Call_Disposition: 'TP - Transported',
  Priority_Description: '4 Medical Non Emergency Events' }
  */

  // Basic parse
  let parsed = {
    filename: file.file,
    fileId: data.line_number,
    district: file.district,
    fileAgency: file.organization,
    dispatchType: file.type,
    localIncidentId: data.Master_Incident_Number,
    respondingAgency: utils.clean(data.Agency),
    respondingAgencyType: utils.cleanAgencyType(data.Agency, file.organization),
    officerInitiated: undefined,
    priorityRaw: utils.clean(data.Priority_Description),
    priority: utils.cleanPriority(data.Priority_Description.split(' ')[0]),
    dispositionRaw: utils.clean(data.Call_Disposition),
    dispositionCode: utils.clean(
      data.Call_Disposition ? data.Call_Disposition.split('-')[0] : ''
    ),
    incidentRaw: utils.clean(data.IncidentType),
    incidentCodeRaw: utils.clean(
      data.IncidentType ? data.IncidentType.split('-')[0] : ''
    ),
    incident: utils.cleanIncident(data.IncidentType),
    incidentGroupRaw: undefined,
    incidentGroup: undefined,
    locationRaw: utils.clean(data.LocationName),
    location: utils.cleanLocation(data.LocationName),
    locationGroup: utils.cleanLocationGroup(data.Location_Type),
    fullAddress: utils.clean(data.Address),
    address: utils.clean(data.Address),
    city: utils.clean(data.City),
    state: utils.clean(data.State),
    zip: utils.clean(data.PostalCode),
    incidentSourceRaw: undefined,
    incidentSource: undefined,
    latitude: utils.parseNoDecimalLatLon(data.Latitude),
    longitude: utils.parseNoDecimalLatLon(data.Longitude, 'longitude'),
    incidentTime: utils.cleanDate(data.Response_Date),
    firstKeystroke: utils.cleanDate(data.Time_FirstCallTakingKeystroke),
    incidentInQueue: utils.cleanDate(data.Fixed_Time_CallEnteredQueue),
    callComplete: utils.cleanDate(data.Fixed_Time_CallTakingComplete),
    incidentClosed: utils.cleanDate(data.Fixed_Time_CallClosed),
    firstUnitAssigned: utils.cleanDate(data.Time_First_Unit_Assigned),
    firstUnitEnroute: utils.cleanDate(data.Time_First_Unit_Enroute),
    firstUnitArrived: utils.cleanDate(data.Time_First_Unit_Arrived),
    notes: undefined
  };

  // The SPPD considers priority 2 - 0 to be emergency.
  if (file.organization === 'sppd' && parsed.priority) {
    parsed.priority = parsed.priority - 1;
  }

  // The SPFD uses the same code for different things
  /*
  1 Echo/Cardiac arrests	163
  2 Fire Emergent Events	104
  2 Medical Emergent Events	4555
  2 Structure fires	97
  3 Charlie/Delta medicals	7540
  3 Fire High Priority Events	3696
  3 Medical High Priority Events	3845
  4 EMERGENT FIRE TYPES	1
  4 Emergent fire types	397
  4 Fire Non Emergency Events	1676
  4 Medical Non Emergency Events	9629
  5 Other fire types	2922
  6 Structure codes/alarms	1437
  7 Alpha/Bravo medicals	9305
  8 Wires/Service	444
  9 keybox	334
  */
  if (file.organization === 'spfd' && parsed.priority) {
    parsed.priority = parsed.priority - 1;
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
