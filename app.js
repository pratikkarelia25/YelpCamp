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
const Review = require('./models/review'); 
const {campgroundSchema , reviewSchema} = require('./schemas.js')
const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews')
const campground = require('./models/campground');
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
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use(express.static('public'))

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went wrong'
    res.status(status).render('error',{err})
    
})

app.all('*',(req,res,next)=>{
    next(new expressError('Page not found',404))
})
app.listen(3000,()=>{
    console.log('On PORT 3000')
})