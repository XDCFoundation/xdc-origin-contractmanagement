module.exports = {
  DB: process.env.DB || '',
  PORT: process.env.PORT || '3001',
  IS_CONSOLE_LOG: process.env.IS_CONSOLE_LOG || 'true',
  DB_USER: process.env.DB_USER || 'mycontractdev',
  DB_HOST: process.env.DB_HOST || 'xdc-mycontract-dev.cscjrof24gyr.us-east-1.rds.amazonaws.com',
  DB_DATABASE: process.env.DB_DATABASE || 'xdc-mycontract-dev',
  DB_PASSWORD: process.env.DB_PASSWORD || 'wh!teRoom39',
  DB_PORT: process.env.DB_PORT || '5432',
  OBSERVATORY_X_API_KEY: process.env.OBSERVATORY_X_API_KEY || 'UYIQSLAYpd1i6aOAXL1okajcWJhoDQJr5KX82Zlu',
  OBSERVATORY_BASE_URL: process.env.OBSERVATORY_BASE_URL || 'https://1lzur2qul1.execute-api.us-east-2.amazonaws.com/prod'
}
