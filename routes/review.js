// const express = require("express");
// const app = express();
// const wrapAsync = require("../utils/WrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Listing = require("../models/listing.js");
// const {validateReview}=require("../middleware.js")
// const Review = require("../models/review.js");


// router.post("/", validateReview ,wrapAsync(async (req, res) => {
//     try {

// let listing = await Listing.findById(req.params.id);
// if (!listing) {
//     return res.status(404).send("Listing not found");
// }
// let newReview = new Review(req.body.review);
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();
// req.flash("Done","New Review Added!")
// console.log("Listing details after adding new review:", listing);
// console.log("New review details:", newReview);
// res.redirect(`listings/${listing._id}`)
// } catch (error) {
// console.error("Error saving review:", error);
// res.status(500).send("Internal Server Error");
// }
// }));
// //delete reviews
// // router.delete("/:reviewId",wrapAsync(async(req,res)=>{
// // let {id,reviewId}=req.params;
// // await Listing.findByIdAndUpdate(id,{$pull :{ reviews: reviewId}})
// // await Review.findByIdAndDelete(reviewId)
// // res.redirect(`/listings/${id}`);
// // }))