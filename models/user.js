var mongoose = require('../db/mongoose').mongoose;

var Schema = mongoose.Schema;

var UserSchema = Schema(
    {
        username: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100}
    }
);

//Export model
module.exports = mongoose.model('User', UserSchema);