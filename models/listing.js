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
    filename: { type: String, default: "defaultimage" },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
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