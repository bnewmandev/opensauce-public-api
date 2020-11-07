const mongoose = require('mongoose');

const commentScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 8,
        max: 32
    },
    user: {
        type: String
    },
    body: {
        type: String,
        required: true,
        max: 2048,
        min: 8
    },
    date: {
        type: Number,
    },
    postid: {
        type: String
    }

})

module.exports = mongoose.model("Comment", commentScheme);