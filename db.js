const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URI;

const connectToMongo = () => {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connected to DB Successfully!");
    })
    .catch((err) => {
      console.log(`There was an error : ${err}`);
    });

  //Redundant code not needed as the task is already fulfilled by .then() and .catch()
  //   const db = mongoose.connection;
  //   db.on("error", console.error.bind(console, "connetion error : "));
  //   db.once("open", () => {
  //     console.log("Database connected!");
  //   });
};

module.exports = connectToMongo;
