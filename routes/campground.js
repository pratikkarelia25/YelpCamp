const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');

router.get('/', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}));
 
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
    const newCampground = await Campground(req.body.campground)
    newCampground.author = req.user._id;
    newCampground.save();
    req.flash('success','Sucessfully made a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash("error","Cannot find the campground");
        res.redirect('/campgrounds')
    } 
    res.render('campgrounds/show',{campground})
}));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash("error","Cannot find the campground");
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}));

router.put('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Sucessfully updated campground')
    res.redirect(`/campgrounds/${campground.id}`)
}));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}= req.params;
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a campground")

    res.redirect('/campgrounds')
}));


module.exports = router;