const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const { send } = require('process');
const {campgroundSchema} = require('./schemas.js')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected")
})

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded(extended=true))
app.use(methodOverride('_method'))
app.get('/',(req,res)=>{
    res.render('home')
});

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

app.get('/campgrounds', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}));
 
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',validateCampground,catchAsync(async(req,res)=>{
    // if(!req.body.campground) throw new expressError('Invalid Campground data',400);
    const newCampground = await Campground(req.body.campground)
    newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground})
}));

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
}));

app.put('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`)
}));

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id}= req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));

app.all('*',(req,res,next)=>{
    next(new expressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went wrong'
    res.status(status).render('error',{err})
    
})

app.listen(3000,()=>{
    console.log('On PORT 3000')
})