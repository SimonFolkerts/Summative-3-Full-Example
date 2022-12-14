// environment variables
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const mongoDb = process.env.DB_STRING;

// cors
const cors = require("cors");

// mongoose
const mongoose = require("mongoose");

// init app
const express = require("express");
const app = express();

// utility middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes go here

// ----

// init db connection and API http interface
try {
  // attempt to initiate connection
  mongoose.connect(mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (e) {
  // handle initial connection errors
  console.log("there was an error: " + e);
}

// handle errors on established connection
mongoose.connection.on("error", (e) => console.log(e));

// connection success handler
mongoose.connection.on("connected", (e) => {
  console.log("connected to db");
  // on connection success, start API
  app.listen(port, () => {
    console.log("listening on port " + port + "...");
  });
});
