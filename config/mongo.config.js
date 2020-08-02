module.exports = {
  "connection": {
    "host": process.env.MONGO_HOST,
    "port": process.env.MONGO_PORT,
    "db": process.env.MONGO_DB,
    "user": process.env.MONGO_DB_USER,
    "pass": process.env.MONGO_DB_PASS,
    // fixme
    //TODO make get_mongo_url function to implement auth logic
    "url": "mongodb://" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DB
  },
  "get_tasks_limit": 20,
};
