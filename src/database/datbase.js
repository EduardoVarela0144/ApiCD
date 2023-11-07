const mongoose = require("mongoose");

const MONGO_DB_URI = process.env.MONGODB_URI 

mongoose
  .connect(MONGO_DB_URI, {})
  .then((db) => console.log("Conected! " + db.connection.host))
  .catch((err) => console.log(err));
