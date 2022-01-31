import APP from 'express'
import DBConnection from './config/dbConnection'
import Utils from './app/utils'
import Config from './config'
import routes from './routes'
import { httpConstants } from './app/common/constants'

const app = new APP()
require('./config/express')(app)
// global.lhtWebLog = Utils.lhtLog

class Server {
  static async listen() {
    Promise.all([await DBConnection.connect()]).then(() => {
      app.listen(Config.PORT)
      Utils.lhtLog('listen', `Server Started on port ${Config.PORT}`, {}, 'Shivani', httpConstants.LOG_LEVEL_TYPE.INFO)
      routes(app)
      require('./config/jobInitializer')
    }).catch(error => Utils.lhtLog('listen', 'failed to connect', {err: error}, 'Shivani', httpConstants.LOG_LEVEL_TYPE.ERROR))
  }
}

Server.listen()
