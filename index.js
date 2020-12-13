const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv/config");



//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true },

  () => {
    console.log("connected to db");
  }
);

//Route middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);


app.listen(3000, () => {
  console.log("listening on 3000");
});
