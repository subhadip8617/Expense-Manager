const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Name is required']
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'Password is required']
    }
}, {timestamps: true});

const userModel = mongoose.model('users', UserSchema);

module.exports = userModel;