var express = require('express');
var path = require('path');
global.appRootDir = path.resolve(__dirname);

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport').init(passport);
//var parser = require('multer')();
var multer =require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var FileTool = require('./tools/FileTool');
var DBTool = require('./tools/DBTool');
var AWSTool = require('./tools/AWSTool');

var User = require('./models/User');
var PermitApplication = require('./models/PermitApplication');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());

//var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage });

app.use('/', routes);
app.use('/users', users);

/*************************************
 * Custom Routes                     *
 *************************************/


// Register page
app.get('/registerhere',function (req,res) {
    res.render("register.ejs")
});


// Form page
app.get('/form',function (req,res,next) {
    res.render('form.ejs')
});

// User page (home screen / admin dashboard)
app.get('/user', function (req, res) {
    DBTool.getAllPermitApplication(function(err, applications){
        if(err){
            console.log(err);
            res.redirect('/loginhere');
        } else {
            var jsonUser = {
                profileInfo: {
                    username: req.session.user.lastname + " " + req.session.user.firstname,
                    email: req.session.user.email
                },
                applicationList: applications
            };
            res.render('user.ejs', {
                title: 'Home',
                data: jsonUser
            });
        }
    });



});
app.get('/applications/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    PermitApplication.findById(id).exec(function(err, application){
        if (err){
            console.error(err);
        } else{
            console.log(application);
            res.render('details.ejs', {
                title: 'Details',
                data: application
            });
        }
    });
});
// Details page
app.post('/details', function (req, res) {
    // TODO: get the permit application from the
    // database, to set object values correctly
    var jsonDetails = {
        id: 'A001',
        status:'Pending',
        prediction_result:'TRUE',
        date: '2017-11-17 15:21:05',
        user: 'test1',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
        floor_to_ceiling_height:'8.8',
        natural_grade_of_floor: '0.6',
        opening_height: '39.4',
        opening_width: '24.8',
        opening_area: '20.8',
        area_of_window_well: '5.6',
        outdoor_emergency_exit: 'false',
        bottom_of_clear_opening: '9.4',
        distance_between_landing: '9.2',
        area_of_landing: '11.2',
        drainage_system_present: 'TRUE',
        window_cover_signage: 'TRUE'
    };

    res.render('details.ejs', {
        title: 'Details',
        data: jsonDetails
    });
});


// Save an application after an admin edits
app.post('/save', function (req, res) {
    // TODO: persist the application
    console.log(req.body);
    res.end();
});


// Submit the form
app.post('/formsubmission',function (req,res) {


    var data = req.body;
    var user = req.session.user;
    console.log(data);
    console.log(user);
    AWSTool.predict(data, function(result){
        var label = result.Prediction.predictedLabel;
        var score = result.Prediction.predictedScores;
        console.log(label);
        console.log(score);
        var prediction_result;
        if(label === '0'){
            prediction_result = 'false';
        } else{
            prediction_result = 'true';
        }
        var json = {};
        json.status = 'Pending';
        json.prediction_result = prediction_result;
        json.date = Date.now();
        json.user = user.email;
        json.comment = '';
        json.floor_to_celing_height = data.floor_to_ceiling_height;
        json.natural_grade_of_floor = data.natural_grade_of_floor;
        json.opening_height = data.opening_height;
        json.opening_width = data.opening_width;
        json.opening_area = data.opening_area;
        json.area_of_window_well = data.area_of_window_well;
        json.outdoor_emergency_exit = data.outdoor_emergency_exit;
        json.bottom_of_clear_opening = data.bottom_of_clear_opening;
        json.distance_between_landing = data.distance_between_landing;
        json.area_of_landing = data.area_of_landing;
        json.drainage_system_present = data.drainage_system_present;
        json.window_cover_signage = data.window_cover_signage;
        PermitApplication.create(json, function(err, newApplication){
            if (err) {
                console.log(err);
                res.redirect('/form');
            } else{
                res.redirect("/applications/"+newApplication._id);
            }
        });
    });
});


// Login page
app.get('/loginhere',function(req,res,next){
   res.render('login.ejs');
});


/*************************************/

app.post('/redirectHome',function (req, res) {
    // console.log("post /redirectHome, req.session.username = "+req.session.user);
    //Checks before redirecting whether the session is valid
    if(req.session.user) {
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        // res.render("homepage",{username:req.session.username});
        res.status(200).send({"status_code": 200, "username": req.session.user});
    } else {
        res.status(400).send({"status_code": 400});
        // res.redirect('http://localhost:3000/login');
    }
});

app.post('/logout', function(req,res) {
    // console.log(req.session.user);
    req.session.destroy();
    // console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/afterLogin', function(req, res) {
    // console.log("post /login");
    console.log(req.body);
    passport.authenticate('login', function(err, results) {
        // console.log("passport.authenticate(), results = "+ JSON.stringify(results));
        if(err) {
            res.redirect("/loginhere");
        }

        if (results.status_code == 200){
            req.session.user = results.user;
            // console.log("req.session.user = "+req.session.user);
            // console.log("session initilized, return status 200");
            res.redirect("/user");
        } else{
            res.redirect("/loginhere");
        }
    })(req, res);
});

app.post('/afterRegister',function (req, res) {
    console.log(req.body);
    /*{ firstname: 'Jiaqi',
    lastname: 'Qin',
    email: 'frank.qjq@outlook.com',
    password: '123',
    confirm_password: '123' }*/
    var data = req.body;
    var email = data.email;
    var password = data.password;
    var confirm_password = data.confirm_password;
    if(password !== confirm_password){
        res.redirect("/registerhere");
    } else{
        User.findOne({email: email}).exec(function(err, user){
            if(user){
                res.redirect("/registerhere");
            } else{
                var userInstance = new User(data);
                userInstance.save(function (err) {
                    if (err) {
                      console.log(err);
                        res.redirect("/registerhere");
                    } else{
                        res.redirect("/loginhere");
                    }
                });
            }
        });
    }
});

app.post('/files', upload.any(), function(req, res) {
    console.log("====>app.post(/files)");
    // console.dir(req.files);

    var file = req.files[0];
    // console.log("for each file:");

    var username = req.body.username;
    var path = req.body.path;
    var from = __dirname+'/'+file.path;
    var to = FileTool.getUserPath(username)+path;

    // console.log("move file from: "+from);
    console.log("created file in: "+to);

    if (!fs.existsSync(to)){
        // console.log("to folder not exist, create folder");
        mkdirp.sync(to);
    }
    fs.rename(from, to+file.originalname);

    // console.log("end uploading files");

    var json = {
        status_code: 200,
        files: FileTool.getFiles(username, path),
        message: 'successfully uploaded'
    }

    console.log(json);

    res.status(200).send(json);
});

var port = process.env.PORT || 8000;
var server = app.listen(port, function(){
    console.log('App listening on port %s', port);
});

function stop() {
    server.close();
}

module.exports = app;
module.exports.stop = stop;
