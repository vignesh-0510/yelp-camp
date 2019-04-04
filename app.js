const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
// Yelp camp Schema Setup
let CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
});
let Campground = mongoose.model("Campground", CampgroundSchema);

/*Campground.create({
    name: "Granite Mountain",
    image: "https://res.cloudinary.com/simplotel/image/upload/x_0,y_0,w_2592,h_1458,r_0,c_crop,q_60,fl_progressive/w_960,f_auto,c_fit/youreka/Camp-Kambre_hcemsr"

}, (err, camp) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("newly created campground");
        console.log(camp);
    }
});*/


app.get("/", (req, res) => {
    //res.send("this is landing page");
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {

    //Get all campgrounds
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds", { campgrounds });
        }
    });
    //res.render("campgrounds", { campgrounds });
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    //Ctreate new Campground and save it
    Campground.create({ name, image }, (err, camp) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
    //campgrounds.push({ name, image });

});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Yelpcamp Server has Started");
});
