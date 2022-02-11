module.exports = {
  DB: process.env.DB || '',
  PORT: process.env.PORT || '3001',
  IS_CONSOLE_LOG: process.env.IS_CONSOLE_LOG || 'true',
  DB_USER: process.env.DB_USER || 'mycontractprod',
  DB_HOST: process.env.DB_HOST || 'xdc-mycontract-prod.ckjj5obhzs40.us-east-2.rds.amazonaws.com',
  DB_DATABASE: process.env.DB_DATABASE || 'xdc-mycontract-prod',
  DB_PASSWORD: process.env.DB_PASSWORD || 'coldengine47',
  DB_PORT: process.env.DB_PORT || '5432',
  OBSERVATORY_X_API_KEY: process.env.OBSERVATORY_X_API_KEY || 'UYIQSLAYpd1i6aOAXL1okajcWJhoDQJr5KX82Zlu',
}
