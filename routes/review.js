const express = require("express");
const app = express();
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js")
const {validateReview}=require("../middleware.js");
const {isLoggedIn}=require("../middleware.js")


//post review 
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview =new Review (req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("Done","new review Added")
}))
module.exports=router;