const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '61023ec94de24b301c3333e5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '61023ec94de24b301c3333e5',
            description: 'eojvnwnbnrnoenbrenbnbonrebenbrnbe',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude,
                                cities[random1000].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dsdxhieag/image/upload/v1630748095/YelpCamp/aakzwtzqesasgtbfcfgg.jpg',
                  filename: 'YelpCamp/aakzwtzqesasgtbfcfgg'
                },
                {
                  url: 'https://res.cloudinary.com/dsdxhieag/image/upload/v1630748095/YelpCamp/z1iyjejmhf5hnei4p0tw.jpg',
                  filename: 'YelpCamp/z1iyjejmhf5hnei4p0tw'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})