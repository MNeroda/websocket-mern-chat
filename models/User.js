const {Schema, model, Types} = require("mongoose")

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    conversationList: [{
        type: Types.ObjectId,
        ref: "Conversation"
    }],
    socketId: {
        type: String,
        default: null
    }
})

module.exports = model("User", schema)