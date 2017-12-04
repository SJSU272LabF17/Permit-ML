var mongoose = require('../db/mongoose').mongoose;

var Schema = mongoose.Schema;

var PermitApplicationSchema = Schema(
    {
        status: {type: String, required: true},
        prediction_result: {type: Boolean, required: true},
        date: {type: Date, required: true, default: Date.now()},
        user: {type: String, required: true},
        comment: {type: String, required: false},
        floor_to_ceiling_height: {type: String, required: false},
        natural_grade_of_floor: {type: String, required: false},
        opening_height: {type: String, required: false},
        opening_width: {type: String, required: false},
        opening_area: {type: String, required: false},
        area_of_window_well: {type: String, required: false},
        outdoor_emergency_exit: {type: String, required: false},
        bottom_of_clear_opening: {type: String, required: false},
        distance_between_landing: {type: String, required: false},
        area_of_landing: {type: String, required: false},
        drainage_system_present: {type: String, required: false},
        window_cover_signage: {type: String, required: false}
    }
);

//Export model
module.exports = mongoose.model('PermitApplication', PermitApplicationSchema, 'PermitApplications');