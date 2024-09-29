
const Listing = require("../models/listing.js");
const Review= require("../models/review.js");



module.exports.createReview = async (req, res,next ) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    
    // Adjust according to your review schema
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);


    await newReview.save();
    await listing.save();

    req.flash("success"," New Review added");

    res.redirect(`/listings/${req.params.id}`);
  };

  module.exports.destroyReview = async (req,res ) => {

    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
  };