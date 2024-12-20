const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../model/campground");
const Review = require("../model/review.js");
const {isLoggedIn, validateReview ,isReviewAuthor} = require('../middleware.js');
const reviews  = require('../controllers/reviews.js');




//POST Request to create a new review for a campground
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));

//DELETE Request to delete the review from both the reviews model and campground's array reference
router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,catchAsync(reviews.deleteReview));

module.exports = router;
