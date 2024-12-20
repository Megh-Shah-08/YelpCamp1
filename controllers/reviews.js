const Campground = require('../model/campground');
const Review = require('../model/review');

//create review
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    const res1 = await review.save();
    const res2 = await campground.save();
    req.flash('success','Succesfully made a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
};

//delete review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Succesfully deleted a campground!');
    res.redirect(`/campgrounds/${id}`)
};