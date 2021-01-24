const { query } = require("express");
var mysql = require("mysql");

class Db {
  constructor() {
    this.initConnection();
    this.connect();
  }

  // init vars for up connection with Amazon DB
  initConnection = () => {
    this.connection = mysql.createConnection({
      host: process.env.RDS_HOSTNAME,
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      port: process.env.RDS_PORT,
      database: process.env.RDS_DB_NAME,
    });
  };

  // Connect to Db
  connect = () => {
    console.log("started");
    this.connection.connect(function (err) {
      if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
      }
      console.log("Connected to database.");
    });

    //execute the param query on the DB and pass response to callback
  };

  //Execute query on DB
  executeQuery = (query, callback) => {
    this.connection.query(query, (err, data, fields) => {
      callback(err, data, fields);
    });
  };

  executeQueryWithParams = (query, params, callback) => {
    this.connection.query(query, params, (err, data, fields) => {
      callback(err, data, fields);
    });
  };

  //Execute post query on DB (with vars)
  executePostQuery = (query, post, callback) => {
    this.connection.query(query, post, (err, data, fields) => {
      callback(err, data, fields);
    });
  };
}

//https://medium.com/@maheshkumawat_83392/node-js-design-patterns-singleton-pattern-series-1-1e0ab71e3edf
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new Db();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}
module.exports = Singleton;
