if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const { send } = require('process');
const morgan = require('morgan')
const flash = require('connect-flash');
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require('./models/user');
const helmet = require('helmet');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected")
})

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'));
app.use(flash());
app.use(mongoSanitize());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went wrong'
    res.status(status).render('error',{err})  
})

const sessionConfig = {
    name: '_sess',
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
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dsdxhieag/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.render('home')
})
// app.all('*',(req,res,next)=>{
//     next(new expressError('Page not found',404))
// })

app.listen(3000,()=>{
    console.log('On PORT 3000')
})