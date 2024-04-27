const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      return cb(null, true);
    } else {
      console.log(`Origin ${origin} not allowed`);
      return cb("Not Allowed by CORS");
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 20
};

module.exports = corsOptions;
