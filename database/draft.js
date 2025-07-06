const mongoose = require('mongoose');

const spanSchema = new mongoose.Schema({
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, 
    visibility: { type: Map, of: Boolean, default: {} },
});

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    visibility: { type: Map, of: Boolean, default: {} },
    display: {type: Map, of: Boolean, default: {}},
    spans: [spanSchema],
});

const userSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    sections: [sectionSchema],
});

module.exports = mongoose.model('User', userSchema);