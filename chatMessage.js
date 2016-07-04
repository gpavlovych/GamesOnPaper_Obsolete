/**
 * Created by pavlheo on 7/4/2016.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ChatMessage', new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: String
}, { timestamps: true }));