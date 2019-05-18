const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require("connect-flash-plus"),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(flash());


// Yelp camp Schema Setup
const Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    SeedDB = require('./seeds');

//Routes Setup
let commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "Once again Rusty wins Cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Making Currentuser available to all
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//Requiring Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//SeedDB();

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Yelpcamp Server has Started");
});
