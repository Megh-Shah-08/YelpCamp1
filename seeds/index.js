const mongoose = require("mongoose");
require("dotenv").config();
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../model/campground");

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
};

connectToMongo();
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: 'https://res.cloudinary.com/deegp8go4/image/upload/v1734516694/YelpCamp/ernd7w6tct9r9lk9llrm.jpg',
          filename: 'YelpCamp/ernd7w6tct9r9lk9llrm',
        },
      ],
      geometry:{
        type:"Point",
        coordinates:[
          cities[random1000].longitude,
          cities[random1000].latitude
        ],
      },
      author:'67602637d1594ba40815127b',
      description: "A nice campground!",
      price: Math.floor(Math.random() * 100),
    });

    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
  console.log("Disconnected to DB Successfully!");
});
console.log("executed!");
