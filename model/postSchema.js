const string = require('joi/lib/types/string');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const User = require('../model/loginSchema');

const PostSchema = new Schema({

    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
    comments:[
        {
            type:ObjectId,
             ref:'Comment'
        }
    ]
},{
    timestamps: true
    
});

module.exports = mongoose.model('Post', PostSchema);