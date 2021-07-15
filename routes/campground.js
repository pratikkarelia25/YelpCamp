const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const expressError = require('../utils/expressError');
const {campgroundSchema } = require('../schemas.js')

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
 
router.get('/new',(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',validateCampground,catchAsync(async(req,res)=>{
    // if(!req.body.campground) throw new expressError('Invalid Campground data',400);
    const newCampground = await Campground(req.body.campground)
    newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show',{campground})
}));

router.get('/:id/edit',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
}));

router.put('/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`)
}));

router.delete('/:id',catchAsync(async(req,res)=>{
    const {id}= req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));


module.exports = router;