const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const profileSchema = new Schema({

    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String, 
    }

});



module.exports = mongoose.model('Profile',profileSchema);