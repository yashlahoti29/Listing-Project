const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4"
    }
  },
  price: Number,
  location: String,
  country: String,
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;