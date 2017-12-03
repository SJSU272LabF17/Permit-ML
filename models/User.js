var mongoose = require('../db/mongoose').mongoose;

var Schema = mongoose.Schema;

var UserSchema = Schema(
    {
        firstname: {type: String, required: false, max: 100},
        lastname: {type: String, required: false, max: 100},
        email: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100},
        confirm_password: {type: String, required: true, max: 100},
    }
);

module.exports = mongoose.model('User', UserSchema);