const mongoose = require('mongoose');

const spanSchema = new mongoose.Schema({
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, 
    visibility: { type: Map, of: Boolean, default: {} },
    details: {type: String}
});

const colorSchema = new mongoose.Schema({
    box: String,
    span: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    sections: [{type: Map, of: Boolean}],
    spans: [spanSchema],
    colors: [{type: Map, of: colorSchema}]
});

module.exports = mongoose.model('User', userSchema);