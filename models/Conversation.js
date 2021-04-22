
const {Schema, Types, model} = require("mongoose")

const schema = new Schema({
    members: [{
        member: {
            type: Types.ObjectId,
            ref: "User"
        }
    }],
    messages: [{
        value: {
            type: String
        },
        from: {
            type: Types.ObjectId
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    lastMessage: {
        type: String,
        default: ""
    }
})

module.exports = model("Conversation", schema)