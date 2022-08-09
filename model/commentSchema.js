const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const User = require('../model/loginSchema');
const Post = require('../model/postSchema');

const commentSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: ObjectId,
        required: true,
        ref: 'Post'
    },
    comments: [{
        text: {
            type: String,
            trim: true,
         }, 
    }]
},{
    timestamps: true

});

module.exports = mongoose.model('Comment', commentSchema);