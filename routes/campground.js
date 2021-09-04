const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campground = require('../controller/campground')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage});

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campground.createCampground));

router.get('/new',isLoggedIn,campground.renderNewForm);

router.route('/:id')
    .get(catchAsync(campground.showCampgrounds))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.editCampground));

module.exports = router;