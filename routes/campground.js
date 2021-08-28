const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campground = require('../controller/campground')

router.get('/', catchAsync(campground.index));
 
router.get('/new',isLoggedIn,campground.renderNewForm);

router.post('/',isLoggedIn,validateCampground,catchAsync(campground.createCampground));

router.get('/:id',catchAsync(campground.showCampgrounds));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.editCampground));

router.put('/:id',isLoggedIn,isAuthor,catchAsync(campground.updateCampground));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campground.deleteCampground));


module.exports = router;