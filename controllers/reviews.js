const Review = require("../models/review.js");
const Listing=require("../models/listing.js")
module.exports.NewReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview =new Review (req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("Done","new review Added");
    res.redirect(`/listings/${req.params.id}`);
}
module.exports.deleteReview=async (req, res) => {
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
}