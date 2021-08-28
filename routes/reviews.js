const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema ,reviewSchema } = require('../schemas.js')
const Review = require('../models/review'); 
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const review = require('../controller/reviews')

router.post('/',isLoggedIn,validateReview,catchAsync(review.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview));

module.exports = router;