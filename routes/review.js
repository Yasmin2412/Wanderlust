const express = require("express");
const app = express();
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js")
const {validateReview}=require("../middleware.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js")

//post review 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.NewReview))



// Route to delete a review
router.delete('/:reviewId', isLoggedIn,isReviewAuthor,reviewController.deleteReview);

module.exports=router;