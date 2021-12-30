require('dotenv').config()
const Config = require('../../config')

module.exports = {
  // development: {
  //   url: 'postgres://mycontractdev:wh!teRoom39@127.0.0.1:5432/xdc-mycontract-dev',
  //   dialect: 'postgres',
  // },
  // test: {
  //   url: 'postgres://mycontractdev:wh!teRoom39@127.0.0.1:5432/xdc-mycontract-dev',
  //   dialect: 'postgres',
  // },
  // production: {
  //   url: 'postgres://mycontractdev:wh!teRoom39@127.0.0.1:5432/xdc-mycontract-dev',
  //   dialect: 'postgres',
  // },


  "development": {
  "username": Config.DB_USER,
      "password": Config.DB_PASSWORD,
      "database": Config.DB_DATABASE,
      "host": Config.DB_HOST,
      "logging": false,
      "freezeTableName": true,
      "operatorsAliases": false,
      "port": 5432,
      "dialect": "postgres"
  },
  "test": {
  "username": Config.DB_USER,
      "password": Config.DB_PASSWORD,
      "database": Config.DB_DATABASE,
      "host": Config.DB_HOST,
      "dialect": "postgres"
  },
  "production": {
  "username": Config.DB_USER,
      "password": Config.DB_PASSWORD,
      "database": Config.DB_DATABASE,
      "host": Config.DB_HOST,
      "dialect": "postgres"
  }


}

