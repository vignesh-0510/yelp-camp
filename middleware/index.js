const Campground = require("../models/campground"),
    Comment = require("../models/comment");
const middlewareObj = {};

middlewareObj.isCampgroundAuthorised = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                req.flash("error", "Sorry! Campground was not found");
                res.redirect("back");
            }
            else {
                //is author
                if (campground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be Logged In to do that");
        res.redirect("back");
    }
};

middlewareObj.isCommentAuthorised = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash("error", "Sorry! Comment was not found");
                res.redirect("back");
            }
            else {
                //is author
                if (comment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be Logged In to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You ned to be Logged In to do that");
    res.redirect("/login");
};


module.exports = middlewareObj;
