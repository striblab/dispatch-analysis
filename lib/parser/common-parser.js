/**
 * Similar functions
 */

// Dependencies
const moment = require('moment-timezone');
const _ = require('lodash');
const utils = require('../parser-utils.js');

// Check if incident is officer initiated based on timestamps
function officerInitiated(incident) {
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
      incident[test[0]] &&
      incident[test[1]] &&
      Math.abs(incident[test[0]].getTime() - incident[test[1]].getTime()) <
        3 * 1000
    ) {
      incident.officerInitiated = true;
      incident.notes = `${
        incident.notes ? incident.notes + '  ' : ''
      }Assumed officer initiated since ${[test[0]]} and ${[
        test[1]
      ]} are a few seconds apart.`;
      return true;
    }
  });

  return incident;
}

// Make geo point
function makeGeoPoint(incident) {
  incident.geometryPoint = utils.makeGeoJSONPoint(
    incident.latitude,
    incident.longitude
  );

  return incident;
}

// Calculate response time
function responseTime(incident) {
  if (
    incident.firstKeystroke &&
    incident.firstUnitArrived &&
    incident.firstKeystroke.getTime() !== incident.firstUnitArrived.getTime()
  ) {
    incident.responseTime =
      (incident.firstUnitArrived.getTime() -
        incident.firstKeystroke.getTime()) /
      1000;
  }

  return incident;
}

// Calculate call time
function callTime(incident) {
  if (
    incident.firstKeystroke &&
    incident.callComplete &&
    incident.firstKeystroke.getTime() !== incident.callComplete.getTime()
  ) {
    incident.callTime =
      (incident.callComplete.getTime() - incident.firstKeystroke.getTime()) /
      1000;
  }

  return incident;
}

// Calculate to queue time
function toQueueTime(incident) {
  if (
    incident.firstKeystroke &&
    incident.incidentInQueue &&
    incident.firstKeystroke.getTime() !== incident.incidentInQueue.getTime()
  ) {
    incident.toQueueTime =
      (incident.incidentInQueue.getTime() - incident.firstKeystroke.getTime()) /
      1000;
  }

  return incident;
}

// Calculate in queue time
function inQueueTime(incident) {
  if (incident.incidentInQueue && incident.firstUnitAssigned) {
    incident.inQueueTime =
      (incident.firstUnitAssigned.getTime() -
        incident.incidentInQueue.getTime()) /
      1000;
  }

  return incident;
}

// Calculate drive time
function driveTime(incident) {
  if (
    incident.firstUnitArrived &&
    incident.firstUnitAssigned &&
    incident.firstUnitArrived.getTime() !== incident.firstUnitAssigned.getTime()
  ) {
    incident.driveTime =
      (incident.firstUnitArrived.getTime() -
        incident.firstUnitAssigned.getTime()) /
      1000;
  }

  return incident;
}

// Calculate some buckets based on time of incient
function incidentTimeParts(incident) {
  // Incident time buckets
  if (incident.incidentTime) {
    let m = moment(incident.incidentTime);
    incident.incidentHour = m.hour();
    incident.incidentWeek = m.week();
    incident.incidentWeekDay = m.day();
    incident.incidentMonth = m.month() + 1;
  }

  return incident;
}

// Export
module.exports = {
  officerInitiated,
  makeGeoPoint,
  responseTime,
  callTime,
  toQueueTime,
  inQueueTime,
  driveTime,
  incidentTimeParts
};
