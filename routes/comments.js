const express = require("express"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");
const router = express.Router({ mergeParams: true });

const middleware = require("../middleware/");

//New Comments form
router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', { campground });
        }
    });

});

// Create Comment

router.post('/', isLoggedIn, (req, res) => {
    //lookup campground
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Sorry! Unable to create comment");
                    console.log(err);
                }
                else {
                    req.flash("success", "Successfully created comment");
                    //link comment to object
                    // add username and ref
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    //redirect
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });

});

router.get("/:comment_id/edit", middleware.isCommentAuthorised, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment });
        }
    });
});
//UPDATE COMMENT
router.put("/:comment_id", middleware.isCommentAuthorised, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, newcomment) => {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id + "/");
        }
    });
});

//DESTROY COMMENT
router.delete("/:comment_id", middleware.isCommentAuthorised, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// function isCommentAuthorised(req, res, next) {
//     if (req.isAuthenticated()) {
//         Comment.findById(req.params.comment_id, (err, comment) => {
//             if (err) {
//                 res.redirect("back");
//             }
//             else {
//                 //is author
//                 if (comment.author.id.equals(req.user._id)) {
//                     next();
//                 }
//                 else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     }
//     else {
//         res.redirect("back");
//     }
// }

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
