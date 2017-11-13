
//Set up mongoose connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoURL = "mongodb://localhost:27017/login";
mongoose.connect(mongoURL, {
    useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

exports.mongoose = mongoose;