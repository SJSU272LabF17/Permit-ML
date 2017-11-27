var mongoose = require('../db/mongoose').mongoose;

var Schema = mongoose.Schema;

var PermitApplicationSchema = Schema(
    {
        status: {type: String, required: true},
        prediction_result: {type: Boolean, required: true},
        date: {type: Date, required: true, default: Date.now()},
        user: {type: String, required: true},
        comment: {type: String, required: true},
        floor_to_celing_height: {type: Number, required: false},
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


// {
//     id: 'A002',
//     status:'Accepted',
//     prediction_result:'TRUE',
//     date: '2017-11-17 16:22:00',
//     user: 'test2',
//     comment: 'test2',
//     floor_to_ceiling_height:'8.0',
//     natural_grade_of_floor: '0.5',
//     opening_height: '39.0',
//     opening_width: '24.0',
//     opening_area: '20.0',
//     area_of_window_well: '5.0',
//     outdoor_emergency_exit: 'FALSE',
//     bottom_of_clear_opening: '9.0',
//     distance_between_landing: '9.0',
//     area_of_landing: '11.0',
//     drainage_system_present: 'FALSE',
//     window_cover_signage: 'FALSE'
// }
//Export model
module.exports = mongoose.model('PermitApplication', PermitApplicationSchema, 'PermitApplications');