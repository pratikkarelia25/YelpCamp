// const campground = require('../models/campground');
const Campground = require('../models/campground');

module.exports.index = async(req,res)=>{

    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next)=>{
    console.log(JSON.stringify(req.body, null, 4));
    const newCampground = await Campground(req.body.campground);
    // newCampground.image = req.files.map(f=>{url: f.path, filename: f.filename});
    // console.log("hi")
    newCampground.author = req.user._id;
    newCampground.save();
    console.log(newCampground)
    req.flash('success','Sucessfully made a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`);

    // next();
}

module.exports.showCampgrounds = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash("error","Cannot find the campground");
        res.redirect('/campgrounds')
    } 
    res.render('campgrounds/show',{campground})
}

module.exports.editCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash("error","Cannot find the campground");
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Sucessfully updated campground')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const {id}= req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a campground")
    res.redirect('/campgrounds')
}