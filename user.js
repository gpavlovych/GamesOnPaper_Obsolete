/**
 * Created by pavlheo on 6/16/2016.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    firstName: String,
    lastName: String,
    username: {type:String, unique:true},
    password: String
}));

