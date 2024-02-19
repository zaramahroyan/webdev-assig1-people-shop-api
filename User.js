const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String, 
    fName: String,
    lName: String,
    password: String,
    admin: {type: Boolean, default: false},
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;