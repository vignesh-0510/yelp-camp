const express = require("express");
const Campground = require("../models/campground");
const router = express.Router( /*{ mergeParams: true }*/ );
const middleware = require("../middleware/");

//Index Page
router.get("/", (req, res) => {

    //Get all campgrounds
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds });
        }
    });
});

//CREATE Campground Route
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username,
    };
    //Create new Campground and save it
    Campground.create({ name, image, description, author }, (err, camp) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
    //campgrounds.push({ name, image });

});

//NEW Campground Route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW Campground Route
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: found });
        }
    });

});

//EDIT CAMPGROUND
router.get("/:id/edit", middleware.isCampgroundAuthorised, (req, res) => {

    //is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {

            }
            res.render("campgrounds/edit", { campground });
        });
    }
});

//UPDATE CAMPGROUND
router.put("/:id", middleware.isCampgroundAuthorised, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE CAMPGROUND

router.delete("/:id/", middleware.isCampgroundAuthorised, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds");
    });
});


module.exports = router;
