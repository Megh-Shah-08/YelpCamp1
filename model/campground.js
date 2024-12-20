const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = {toJSON :{virtuals:true}}

const ImageSchema = new Schema({
  url: String,
  filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_300');
})
const campgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates: {
      type:[Number],
      required:true
    }
  },
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Review
    }
  ]
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<strong><a href='/campgrounds/${this._id}'}>${this.title}</a></strong>
  <p>${this.description.substring(0,20)}...</p>`
})
campgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground) {
    const reviews = campground.reviews;
    const res = await Review.deleteMany({ _id: { $in: reviews } })
    console.log(res);
  }
})
module.exports = mongoose.model("Campground", campgroundSchema);
