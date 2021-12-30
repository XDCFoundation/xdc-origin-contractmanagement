import Config from '.'
import mongoose from 'mongoose'
import { Pool, Client } from "pg"

export default class DBConnection {
  static async connect() {

    const DBConnection = {
      db: {
        host: Config.DB_HOST,
        port: Config.DB_PORT,
        user: Config.DB_USER,
        password: Config.DB_PASSWORD,
        database: Config.DB_DATABASE,
      },
      listPerPage: 10,
    };

    // global.pool = await new Pool(DBConnection.db);
    // console.log("global.pool ====", global.pool);
    // return await pool.query("SELECT NOW()");
    global.client = new Client(DBConnection.db)
    return await client.connect();
    // const now = await client.query("SELECT NOW()");
    // await client.end();
    // console.log("now ---===", now);
    // return now;

    // console.log('DB trying to connect on ' + new Date() + ' to url' + Config.DB)
    //
    // const options = {
    //   keepAlive: 1,
    //   autoReconnect: true,
    //   poolSize: 10,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // }
    // return mongoose.connect(Config.DB, options)

  }
}



// module.exports = DBConnection;