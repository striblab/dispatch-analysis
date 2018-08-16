// Dependencies
const Sequelize = require('sequelize');

//
module.exports = (sequelize, DataTypes) => {
  let model = sequelize.define(
    'dispatch',
    {
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
        type: DataTypes.ENUM('police', 'fire', 'medical', 'other'),
        allowNull: false,
        description: 'Agency that provided this data.'
      },

      respondingAgency: {
        type: DataTypes.STRING(128),
        description: 'Agency that responded.'
      },

      // Incident (robbery, etc)
      incidentDescription: {
        type: DataTypes.STRING(256),
        description: 'Raw incident description.'
      },
      incidentLabel: {
        type: DataTypes.STRING(128),
        description: 'Standardized incident label used for grouping.'
      },
      incidentCode: {
        type: DataTypes.STRING(128),
        description: 'Incident code, specific to agency?.'
      },

      // Location (gas station)
      locationDescription: {
        type: DataTypes.STRING(256),
        description: 'Raw location description.'
      },
      locationLabel: {
        type: DataTypes.STRING(128),
        description: 'Standardized incident label used for grouping.'
      },
      locationGroup: {
        type: DataTypes.STRING(128),
        description: 'Incident code, specific to agency?.'
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

      // Geospatial
      latitude: {
        type: DataTypes.DECIMAL(),
        description: 'Latitude of incident.'
      },
      longitutde: {
        type: DataTypes.DECIMAL(),
        description: 'Longitude of incident.'
      },
      coordX: {
        type: DataTypes.DECIMAL(),
        description:
          'If original data has it, the originally project X coordinate.'
      },
      coordY: {
        type: DataTypes.DECIMAL(),
        description:
          'If original data has it, the originally project Y coordinate.'
      },

      // Times.  Unsure about the definition of these.
      incidentTime: {
        type: DataTypes.DATE(),
        description:
          'General incident time, not necessarily associate with a process event.'
      },
      firstKeystroke: {
        type: DataTypes.DATE(),
        description: 'When dispatcher picks up the phone?.'
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

      notes: {
        type: DataTypes.TEXT,
        description: 'General notes for this record.'
      }
    },
    {
      underscored: true,
      indexes: []
    }
  );

  return model;
};
