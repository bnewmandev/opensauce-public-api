const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    referenceid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Search", searchSchema);