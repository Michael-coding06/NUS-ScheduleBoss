const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender:{ type: String, required: true, enum: ['user', 'bot']},
    text: {type: String, required: true},

}, 
)

const userSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    chatActive: {type: Boolean},
    messages: {
        type: Map,
        of: [messageSchema]
    }
})

module.exports = mongoose.model('User_chat', userSchema)