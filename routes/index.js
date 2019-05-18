const express = require("express");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user");

//Landing Page
router.get("/", (req, res) => {
    //res.send("this is landing page");
    res.render("landing");
});

//Register Route
router.get("/register", function(req, res) {
    res.render("register");
});

//Signup logic
router.post("/register", function(req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        req.flash("success", "Welcome to YelpCamp " + user.username);
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

//Login Route
router.get("/login", function(req, res) {
    res.render("login");
});

//Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {});

//Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You out Successfully!");
    res.redirect("/campgrounds");
});

module.exports = router;
