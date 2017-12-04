var mongoose = require('../db/mongoose').mongoose;

var Schema = mongoose.Schema;

var PermitApplicationSchema = Schema(
    {
        status: {type: String, required: true},
        prediction_result: {type: Boolean, required: true},
        date: {type: Date, required: true, default: Date.now()},
        user: {type: String, required: true},
        comment: {type: String, required: false},
        floor_to_ceiling_height: {type: Number, required: false},
        natural_grade_of_floor: {type: Number, required: false},
        opening_height: {type: Number, required: false},
        opening_width: {type: Number, required: false},
        opening_area: {type: Number, required: false},
        area_of_window_well: {type: Number, required: false},
        outdoor_emergency_exit: {type: Boolean, required: false},
        bottom_of_clear_opening: {type: Number, required: false},
        distance_between_landing: {type: Number, required: false},
        area_of_landing: {type: Number, required: false},
        drainage_system_present: {type: Boolean, required: false},
        window_cover_signage: {type: Boolean, required: false}
    }
);

//Export model
module.exports = mongoose.model('PermitApplication', PermitApplicationSchema, 'PermitApplications');