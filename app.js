var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require('connect-flash'),
    passport   = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
 
// requring routes
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");


console.log("this is the process env: " + process.env.YELPDATABASEURL) //mongodb://localhost:27017/yelp_camp
mongoose.connect(process.env.YELPDATABASEURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log(err);
    } 
});

app.use(bodyParser.urlencoded({extended: true})) 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));// using custom css and js files
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database
 
//PASSPORT CONFIG
app.use(require("./node_modules/express-session")({
    secret:"hell no",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// a middlewear to handle the satutes of logged in user in the nav bar
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//using the routers 
app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


var port_number = process.env.PORT || 3000;
app.listen(port_number, function(){
    console.log("THE YELPCAMP SERVER HAS STARTED!!!!")
    console.log("this is the process env port: " +process.env.PORT)

});
// app.listen(3000, function(){
//     console.log("THE YELPCAMP SERVER HAS STARTED!!!!")
// });