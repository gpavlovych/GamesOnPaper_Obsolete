/**
 * Created by pavlheo on 6/16/2016.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('GameDots', new Schema({
    player1: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    player2: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    state: {type: String, enum:['invited', 'accepted', 'declined', 'player1moved', 'player2moved', 'finished']},
    playerInTurn: {type: Number, enum:[1,2]},
    gameData: Schema.Types.Mixed
}, {
    timestamps: true
}));

