// Dependencies
const Sequelize = require('sequelize');
const _ = require('lodash');

// Define model
module.exports = (sequelize, DataTypes) => {
  let model = sequelize.define(
    'dispatch',
    snakeCaseFields({
      filename: {
        type: DataTypes.STRING(128),
        primaryKey: true,
        description: 'Name of file without extension.'
      },
      fileId: {
        type: DataTypes.STRING(128),
        primaryKey: true,
        description: 'The ID from the file, probably the row number by default.'
      },
      district: {
        type: DataTypes.STRING(128),
        description: 'Main district that provided this data.'
      },
      fileAgency: {
        type: DataTypes.STRING(128),
        description: 'Agency that provided this data.'
      },
      dispatchType: {
        type: DataTypes.ENUM(
          'police',
          'fire',
          'medical',
          'fire-medical',
          'other',
          'all'
        ),
        allowNull: false,
        description: 'Type of dispatch agency that provided this data.'
      },

      // Local ID
      localIncidentId: {
        type: DataTypes.STRING(128),
        description: 'Data ID for this incident.'
      },

      // Responding agency
      respondingAgency: {
        type: DataTypes.STRING(128),
        description: 'Agency that responded.'
      },
      respondingAgencyType: {
        type: DataTypes.ENUM(
          'police',
          'fire',
          'medical',
          'fire-medical',
          'other'
        ),
        allowNull: false,
        description: 'Type of agency that responded.'
      },
      officerInitiated: {
        type: DataTypes.BOOLEAN(),
        description: 'Whether the incident was officer initiated.'
      },

      // Priority
      priorityRaw: {
        type: DataTypes.STRING(128),
        description: 'Priority as it comes in from the data.'
      },
      priority: {
        type: DataTypes.INTEGER(),
        description: 'Standardized priority where 1 is most important.'
      },

      // Disposition
      dispositionRaw: {
        type: DataTypes.STRING(128),
        description: 'Disposition as it comes in from the data.'
      },
      dispositionCode: {
        type: DataTypes.STRING(32),
        description: 'Disposition standardized as a code.'
      },

      // Incident (robbery, etc)
      incidentRaw: {
        type: DataTypes.STRING(256),
        description: 'Raw incident description.'
      },
      incidentCodeRaw: {
        type: DataTypes.STRING(128),
        description: 'Incident code as comes in from the data.'
      },
      incident: {
        type: DataTypes.STRING(128),
        description: 'Standardized incident label.'
      },
      incidentGroupRaw: {
        type: DataTypes.STRING(128),
        description: 'Raw incident group or type.'
      },
      incidentGroup: {
        type: DataTypes.STRING(128),
        description: 'Standardized incident group or type.'
      },

      // Location (gas station)
      locationRaw: {
        type: DataTypes.STRING(256),
        description: 'Raw location description.'
      },
      location: {
        type: DataTypes.STRING(128),
        description: 'Standardized location'
      },
      locationGroup: {
        type: DataTypes.STRING(128),
        description: 'Standardized location group.'
      },

      // Address
      fullAddress: {
        type: DataTypes.STRING(256),
        description: 'Raw full address on incident.'
      },
      address: {
        type: DataTypes.STRING(256),
        description: 'Street address of incident.'
      },
      city: {
        type: DataTypes.STRING(128),
        description: 'City address of incident.'
      },
      state: {
        type: DataTypes.STRING(4),
        description: 'State address of incident.'
      },
      zip: {
        type: DataTypes.STRING(16),
        description: 'Zip address of incident.'
      },

      // Source
      incidentSourceRaw: {
        type: DataTypes.STRING(128),
        description: 'How did the incident get intitated.'
      },
      incidentSource: {
        type: DataTypes.STRING(128),
        description: 'Standardize source.'
      },

      // Geospatial
      latitude: {
        type: DataTypes.DECIMAL(),
        description: 'Latitude of incident.'
      },
      longitude: {
        type: DataTypes.DECIMAL(),
        description: 'Longitude of incident.'
      },
      geometryPoint: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        description: 'The geospatial point.'
      },

      // Times.  Unsure about the definition of these.
      incidentTime: {
        type: DataTypes.DATE(),
        description:
          'General incident time, not necessarily associate with a process event.'
      },
      firstKeystroke: {
        type: DataTypes.DATE(),
        description: 'When dispatcher picks up the phone.'
      },
      incidentInQueue: {
        type: DataTypes.DATE(),
        description: 'Incident gets put in queue.'
      },
      callComplete: {
        type: DataTypes.DATE(),
        description: 'Call complete (hangs up).'
      },
      incidentClosed: {
        type: DataTypes.DATE(),
        description: 'Incident is marked as closed.'
      },
      firstUnitAssigned: {
        type: DataTypes.DATE(),
        description: 'Incident first assigned to a unit.'
      },
      firstUnitEnroute: {
        type: DataTypes.DATE(),
        description: 'First assigned unit leaves.'
      },
      firstUnitArrived: {
        type: DataTypes.DATE(),
        description: 'First assigned unit arrives at incident.'
      },

      // Calculations
      responseTime: {
        type: DataTypes.DECIMAL(),
        description:
          'Number of seconds from firstKeystroke to firstUnitArrived.'
      },

      incidentHour: {
        type: DataTypes.INTEGER(),
        description: 'The 0-23 hour of the incident time'
      },
      incidentWeek: {
        type: DataTypes.INTEGER(),
        description: 'The 0-51 week of the incident time'
      },
      incidentWeekDay: {
        type: DataTypes.INTEGER(),
        description: 'The 0-6 week of the incident time, where 0 is Sunday'
      },
      incidentMonth: {
        type: DataTypes.INTEGER(),
        description: 'The 0-11 month of the incident time'
      },

      // Notes
      notes: {
        type: DataTypes.TEXT,
        description: 'General notes for this record.'
      },

      // Original data
      originalData: {
        type: DataTypes.TEXT,
        description: 'The raw data.'
      }
    }),
    {
      underscored: true,
      indexes: snakeCaseIndexes([
        { fields: ['filename'] },
        { fields: ['fileId'] },
        { fields: ['district'] },
        { fields: ['fileAgency'] },
        { fields: ['dispatchType'] },
        { fields: ['localIncidentId'] },
        { fields: ['respondingAgency'] },
        { fields: ['respondingAgencyType'] },
        { fields: ['officerInitiated'] },
        { fields: ['priorityRaw'] },
        { fields: ['priority'] },
        { fields: ['dispositionRaw'] },
        { fields: ['dispositionCode'] },
        { fields: ['fullAddress'] },
        { fields: ['address'] },
        { fields: ['city'] },
        { fields: ['zip'] },
        { fields: ['incident'] },
        { fields: ['incidentGroup'] },
        { fields: ['incidentSourceRaw'] },
        { fields: ['incidentSource'] },
        { fields: ['latitude'] },
        { fields: ['longitude'] },
        { fields: ['latitude', 'longitude'] },
        { fields: ['geometryPoint'] },
        { fields: ['incidentTime'] },
        { fields: ['firstKeystroke'] },
        { fields: ['incidentInQueue'] },
        { fields: ['callComplete'] },
        { fields: ['incidentClosed'] },
        { fields: ['firstUnitAssigned'] },
        { fields: ['firstUnitEnroute'] },
        { fields: ['firstUnitArrived'] },
        { fields: ['responseTime'] },
        { fields: ['incidentHour'] },
        { fields: ['incidentWeek'] },
        { fields: ['incidentWeekDay'] },
        { fields: ['incidentMonth'] }
      ]),
      hooks: {
        beforeSave: function(instance) {
          // Sequelize needs CRS defined
          // https://stackoverflow.com/questions/47795113/insert-update-postgis-geometry-with-sequelize-orm
          if (instance.geometryPoint && !instance.geometryPoint.crs) {
            instance.geometryPoint.crs = {
              type: 'name',
              properties: {
                name: 'EPSG:4326'
              }
            };
          }
        }
      }
    }
  );

  return model;
};

// Underscore fields
function snakeCaseFields(fields = {}) {
  return _.mapValues(fields, (f, i) => {
    f.field = f.field ? f.field : _.snakeCase(i);
    return f;
  });
}

// Sequelize doesn't seem to use the field name for a field in indexes
function snakeCaseIndexes(indexes = []) {
  return indexes.map(i => {
    if (i && i.fields && _.isArray(i.fields)) {
      i.fields = i.fields.map(_.snakeCase);
    }
    return i;
  });
}
