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

var AWS = require('aws-sdk');
var machinelearning = new AWS.MachineLearning({
    endpoint: 'machinelearning.us-east-1.amazonaws.com', // (String) — The endpoint URI to send requests to. The default endpoint is built from the configured region. The endpoint should be a string like 'https://{service}.{region}.amazonaws.com'.
    accessKeyId: '',  // (String) — your AWS access key ID.
    secretAccessKey: '' // (String) — your AWS secret access key.
});
// console.log(machinelearning);


// - Get Model information
// var params = {
//   MLModelId: 'STRING_VALUE', /* required */
//   Verbose: true
// };
// machinelearning.getMLModel(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


// - Predict
// var params = {
//   MLModelId: 'STRING_VALUE', /* required */
//   PredictEndpoint: 'STRING_VALUE', /* required */
//   Record: { /* required */
//     '<VariableName>': 'STRING_VALUE',
//     /* '<VariableName>': ... */
//   }
// };
// machinelearning.predict(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:8004',
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
    res.render('temp.ejs')
});

// User page (home screen / admin dashboard)
app.get('/user', function (req, res) {
    // TODO: get permit applications from the
    // database, to create this object correctly
    var jsonUser = {

        profileInfo: {
            username: 'admin',//req.params.username,
            email: 'test@gmail.com'
        },

        applicationList: [
            {
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
            },
            {
                id: 'A002',
                status:'Accepted',
                prediction_result:'TRUE',
                date: '2017-11-17 16:22:00',
                user: 'test2',
                comment: 'test2',
                floor_to_ceiling_height:'8.0',
                natural_grade_of_floor: '0.5',
                opening_height: '39.0',
                opening_width: '24.0',
                opening_area: '20.0',
                area_of_window_well: '5.0',
                outdoor_emergency_exit: 'FALSE',
                bottom_of_clear_opening: '9.0',
                distance_between_landing: '9.0',
                area_of_landing: '11.0',
                drainage_system_present: 'FALSE',
                window_cover_signage: 'FALSE'
            },
            {
                id: 'A003',
                status:'Denied',
                prediction_result:'FALSE',
                date: '2017-11-18 10:10:10',
                user: 'test3',
                comment: 'test3',
                floor_to_ceiling_height:'8.5',
                natural_grade_of_floor: '0.5',
                opening_height: '39.5',
                opening_width: '24.5',
                opening_area: '20.5',
                area_of_window_well: '5.5',
                outdoor_emergency_exit: 'FALSE',
                bottom_of_clear_opening: '9.5',
                distance_between_landing: '9.5',
                area_of_landing: '11.5',
                drainage_system_present: 'TRUE',
                window_cover_signage: 'TRUE'
            },
            {id:'A004'},
            {id:'A005'},
            {id:'A006'},
            {id:'A007'},
            {id:'A008'},
            {id:'A009'},
            {id:'A010'},
            {id:'A011'},
            {id:'A012'},
            {id:'A013'},
            {id:'A014'},
            {id:'A015'},
            {id:'A016'},
        ]
    };

    res.render('user.ejs', {
        title: 'Home',
        data: jsonUser
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
    console.log(req.body);
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
    console.log(req.body);
    passport.authenticate('login', function(err, results) {
        // console.log("passport.authenticate(), results = "+ JSON.stringify(results));
        if(err) {
            return res.status(500).send({"status_code": 500, "message": "server error when login"});
        }

        if (results.status_code == 200){
            req.session.user = results.username;
            req.session.current_path = '/';
            res.redirect('/user')
            // console.log("req.session.user = "+req.session.user);
            // console.log("session initilized, return status 200");

        } else{
           return res.status(400).send(results);

        }
    })(req, res);

});

app.post('/afterRegister',function (req, res) {
    console.log(req.body);
 /*   passport.authenticate('signup', function(err, results) {
        // console.log("passport.authenticate('signup'), results = "+JSON.stringify(results));
        if(err) {
            return res.status(500).send({"statusCode": 500, "message": "server error when signup"});
        }
        return res.status(results.status_code).send(results);*

    })(req, res);*/
/*var jsonUser={
    applicationList: [
        {
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
        },
        {
            id: 'A002',
            status:'Accepted',
            prediction_result:'TRUE',
            date: '2017-11-17 16:22:00',
            user: 'test2',
            comment: 'test2',
            floor_to_ceiling_height:'8.0',
            natural_grade_of_floor: '0.5',
            opening_height: '39.0',
            opening_width: '24.0',
            opening_area: '20.0',
            area_of_window_well: '5.0',
            outdoor_emergency_exit: 'FALSE',
            bottom_of_clear_opening: '9.0',
            distance_between_landing: '9.0',
            area_of_landing: '11.0',
            drainage_system_present: 'FALSE',
            window_cover_signage: 'FALSE'
        },
        {
            id: 'A003',
            status:'Denied',
            prediction_result:'FALSE',
            date: '2017-11-18 10:10:10',
            user: 'test3',
            comment: 'test3',
            floor_to_ceiling_height:'8.5',
            natural_grade_of_floor: '0.5',
            opening_height: '39.5',
            opening_width: '24.5',
            opening_area: '20.5',
            area_of_window_well: '5.5',
            outdoor_emergency_exit: 'FALSE',
            bottom_of_clear_opening: '9.5',
            distance_between_landing: '9.5',
            area_of_landing: '11.5',
            drainage_system_present: 'TRUE',
            window_cover_signage: 'TRUE'
        },
        {id:'A004'},
        {id:'A005'},
        {id:'A006'},
        {id:'A007'},
        {id:'A008'},
        {id:'A009'},
        {id:'A010'},
        {id:'A011'},
        {id:'A012'},
        {id:'A013'},
        {id:'A014'},
        {id:'A015'},
        {id:'A016'},
    ]
};*/

res.redirect('/user');
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

var port = process.env.PORT || 8004;
var server = app.listen(port, function(){
    console.log('App listening on port %s', port);
});

function stop() {
    server.close();
}

module.exports = app;
module.exports.stop = stop;
