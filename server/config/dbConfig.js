// Configuring DATABASE
const mongoose = require("mongoose");

const connDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONN_STR, {
      useNewUrlParser: true,
    });
    if (process.env.NODE_ENV == "development") {
      console.log(`MongoDB connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = { connDB };
