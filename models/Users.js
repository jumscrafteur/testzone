var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    pseudo: {
        type: String,
        required: 'Need User pseudo'
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;