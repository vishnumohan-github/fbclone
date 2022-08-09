const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required: true
    },
    emailToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: { 
        type: String, 
        enum: ["admin", "user"], 
        required: false ,
        default: 'user' 
    },

})



module.exports = mongoose.model('User',loginSchema);