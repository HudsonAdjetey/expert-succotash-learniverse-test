// EXPRESS
const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const authRouter = require("./router/authRouter");
const CORS = require("cors");
const corsOptions = require("./config/corsOptions");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { connDB } = require("./config/dbConfig");
const CourseRouter = require("./router/masterRouter");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5934;
if (process.env.NODE_ENV == "production") {
  console.log("Yep");
}
connDB();

const app = express();
app.use(CORS(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin"); // Adjust the policy based on your needs
  next();
});
app.use(cookieParser());

app.use(express.json());

app.use("/api/auth/", authRouter);
app.use("/api/course", CourseRouter);

if (process.env.NODE_ENV == "production") {
  // Serve static files from the 'dist' directory
  app.use(express.static(path.join(__dirname, "dist")));

  // Serve the index file for any other requests
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

if (process.env.NODE_ENV == "development") {
  app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      return res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      return res.json({ error: "Not found" });
    } else {
      return res.type("txt" || "text").send("Not found");
    }
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  if (
    process.env.NODE_ENV == "development" ||
    process.env.NODE_ENV == "Development" ||
    process.env.NODE_ENV == "DEVELOPMENT"
  ) {
    console.log(`Server running on Port ${PORT}`);
  } else if (
    process.env.NODE_ENV == "production" ||
    process.env.NODE_ENV == "Production" ||
    process.env.NODE_ENV == "PRODUCTION"
  ) {
    console.log("Server has started");
  }
});
