var express = require("../node_modules/express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");



// INDEX ROUTE = show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE ROUTE = add new campground in DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campground array
    var name  = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc  = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            //redirect to /campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW ROUTE = show form to creat new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

//SHOW ROUTE = SHOWS DETAILS OF A CAMPGROUND
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground });
        }
    });
});
// EDIT CAMPGROUND ROUTES
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        req.flash("error", "Campground not found");
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE CAMPROUND ROUTES
router.put("/:id", middleware.checkCampgroundOwnership,  function(req, res){
    //find and update the corect campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            //redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
});

// function checkCampgroundOwnership (req, res, next){
//     //is user logged in
// if(req.isAuthenticated()){
//     Campground.findById(req.params.id, function(err, foundCampground){
//             if(err){
//                 res.redirect("back");
//             } else{
//             //does the user own the campround?
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }    
//             }
//         });
//     }else{
//         res.redirect("back");
//     }
// }

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;