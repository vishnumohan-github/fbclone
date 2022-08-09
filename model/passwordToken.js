const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const TokenSchema = new Schema({

    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

    token: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('TOKEN',TokenSchema);