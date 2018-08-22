/**
 * Connect to database
 */

// Dependencies
const _ = require('lodash');
const Sequelize = require('sequelize');
const sqlString = require('sequelize/lib/sql-string');
const argv = require('yargs').argv;
require('dotenv').load();

// Database object
class Database {
  constructor(options = {}) {
    this.Sequelize = Sequelize;
    this.sequelize = new Sequelize(process.env.DISPATCH_DB_URI, {
      logging: argv.dbLogging ? console.error : false,
      dialectOptions: {
        multipleStatements: true
      }
    });
    this.options = options;

    // Fix for output of decimal as strings
    // https://github.com/sequelize/sequelize/issues/8019
    Sequelize.postgres.DECIMAL.parse = function(value) {
      return parseFloat(value);
    };

    // Import models
    this.importModels();
  }

  // Import models
  // https://sequelize.readthedocs.io/en/v3/docs/models-definition/#import
  importModels() {
    if (this.models) {
      return;
    }

    this.models = {
      dispatch: this.sequelize.import('./model.js')
    };
  }

  // Authenticate (test connection)
  async connect() {
    return await this.sequelize.authenticate();
  }

  // Sync
  async sync(options = {}) {
    await this.connect();
    return await this.sequelize.sync(options);
  }

  // Close DB
  async close() {
    return await this.sequelize.close();
  }

  // Generic bulkUpsert method
  async bulkUpsert(model, data, options = {}) {
    let dialect = this.sequelize.options.dialect;

    if (dialect.match(/^mysql/i)) {
      return await this.bulkUpsertMySQL(model, data, options);
    }
    if (dialect.match(/^(pgsql|postgres)/i)) {
      return await this.bulkUpsertPostgres(model, data, options);
    }
  }

  // MySQL builkupsert
  async bulkUpsertMySQL(model, data, options) {
    options = options || {};
    options.updateOnDuplicate = _.keys(data[0]);
    return await model.bulkCreate(data, options);
  }

  // Postgres bulk upsert
  async bulkUpsertPostgres(model, data, options) {
    let queries = [];

    // Transform data
    data.forEach(d => {
      d.updatedAt = new Date();
      d.createdAt = new Date();

      let query = `INSERT INTO ${model.tableName} (${_.keys(d)
        .map(_.snakeCase)
        .join(', ')}) VALUES (${_.map(d, v => {
        return this.sqlEscape(v, 'postgres');
      }).join(', ')}) ON CONFLICT (${model.primaryKeyAttributes
        .map(_.snakeCase)
        .join(', ')}) DO UPDATE SET ${_.filter(
        _.map(d, (v, k) => {
          return k === 'createdAt'
            ? ''
            : _.snakeCase(k) + ' = ' + this.sqlEscape(v, 'postgres');
        })
      ).join(', ')}`;
      queries.push(query);
    });

    return await this.sequelize.query(queries.join('; '), {
      type: this.sequelize.QueryTypes.INSERT,
      model,
      raw: true
    });
  }

  // Custom escape SQL to handle geometry
  sqlEscape(value, db) {
    if (!_.isDate(value) && _.isPlainObject(value) && value.coordinates) {
      return `ST_GeomFromGeoJSON('${JSON.stringify(value)}')`;
    }

    return sqlString.escape(value, undefined, db);
  }
}

// Use a global to stor a single database instance
global.db = global.db || new Database();

// Export
module.exports = global.db;
