var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
    pseudo: {
        type: String,
        required: 'Need pseudo'
    },
    message: {
        type: String,
        required: 'Need message'
    }
});

var Messages = mongoose.model('User', MessagesSchema);

module.exports = Messages;