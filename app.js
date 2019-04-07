const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


// Yelp camp Schema Setup
const Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    SeedDB = require('./seeds');

//SeedDB();
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
            res.render("campgrounds/index", { campgrounds });
        }
    });
    //res.render("campgrounds", { campgrounds });
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    //Ctreate new Campground and save it
    Campground.create({ name, image, description }, (err, camp) => {
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
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: found });
        }
    });

});

//=================================
//    NEW COMMENT ROUTES
//=================================

app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', { campground });
        }
    });

});
app.post('/campgrounds/:id/comments', (req, res) => {
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
                    console.log(err);
                }
                else {
                    //link comment to object
                    campground.comments.push(comment);
                    campground.save();
                    //redirect
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    })

});
/*
app.get('/campgrounds/:id/comments/new',(req,res)=>{
    
});*/

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Yelpcamp Server has Started");
});
