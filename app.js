const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const { send } = require('process');
const bodyParser = require('body-parser')
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
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(methodOverride('_method'))
app.get('/',(req,res)=>{
    res.render('home')
});
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use(express.static(path.join(__dirname,'public')))
app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went wrong'
    res.status(status).render('error',{err})
    
})

const sessionConfig = {
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 1000*60*60*27*7,
        maxAge: 1000*60*60*27*7
    }
}

app.use(session(sessionConfig))

// app.all('*',(req,res,next)=>{
//     next(new expressError('Page not found',404))
// })

app.listen(3000,()=>{
    console.log('On PORT 3000')
})