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
    req.flash("Done","new review Added");
    res.redirect(`/listings/${req.params.id}`);
}))



// Route to delete a review
router.delete('/:reviewId', isLoggedIn,async (req, res) => {
    const { id, reviewId } = req.params;
    
    try {
        await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        
        req.flash('Done', 'Review deleted!');
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect(`/listings/${id}`);
    }
});

module.exports=router;