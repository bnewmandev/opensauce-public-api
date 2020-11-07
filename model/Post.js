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
        required: true
    },
    date: {
        type: Number,
    },
    image: {
        type: String
    },
    comments: {
        type: [Buffer],
    }

});

module.exports = mongoose.model("Post", postSchema);