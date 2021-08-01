const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const expressError = require('../utils/expressError');
const {campgroundSchema } = require('../schemas.js')
const {isLoggedIn} = require('../middleware');
const campground = require('../models/campground');

const validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next();
    }
}

router.get('/', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}));
 
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
    const newCampground = await Campground(req.body.campground);
    campground.author = req.body._id;
    newCampground.save();
    req.flash('success','Sucessfully made a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash("error","Cannot find the campground");
        res.redirect('/campgrounds')
    } 
    res.render('campgrounds/show',{campground})
}));

router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash("error","Cannot find the campground");
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}));

router.put('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Sucessfully updated campground')
    res.redirect(`/campgrounds/${campground.id}`)
}));

router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}= req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a campground")

    res.redirect('/campgrounds')
}));


module.exports = router;