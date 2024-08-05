const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const ReviewModel = require("./models/review.js");

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews;
// "https://unsplash.com/photos/blue-outdoor-pool-hDbCjHNdF48"
const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url :String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner : {
      type: Schema.Types.ObjectId,
    ref: "User"
  }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Reviews.deleteMany({_id: {$in: listing.reviews}})
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;