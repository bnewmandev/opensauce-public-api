const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 8,
        max: 32
    },
    user: {
        type: String,
    },
    body: {
        type: String,
        required: true,
        max: 4096,
        min: 8
    },
    date: {
        type: Number,
    },
    image: {
        type: String
    },
    comments: {
        type: [Object],
    },
    ingredients: {
        type: [Object]
    }

});

module.exports = mongoose.model("Post", postSchema);