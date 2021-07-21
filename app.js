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
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const Review = require('./models/review'); 
const {campgroundSchema , reviewSchema} = require('./schemas.js')
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const campground = require('./models/campground');
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require('./models/user');
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
app.use(flash());
app.use(methodOverride('_method'))
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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use('/',userRoutes)

// app.all('*',(req,res,next)=>{
//     next(new expressError('Page not found',404))
// })

app.listen(3000,()=>{
    console.log('On PORT 3000')
})