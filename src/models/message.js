import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
    id: {
        type: String,
        index: true,
    },
    chatId: {
        type: String,
        index: true,
    },
    msg: {
        type: String
    },
    type: {
        type: String,
        enum: ['text', 'image', 'audio', 'video'],
        required: true,
        index: true,
    },
    audioDuration: {
        type: String,
        default: ""
    },
    user: {
        _id: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        Image: {
            type: String,
            default: "",
        },
    },
    image: {
        type: String,
        default: ""
    },
    members: {
        type: Array,
        default: []
    },
    receivers: {
        type: Array,
        default: []
    },
    seenBy: {
        type: Array,
        default: []
    },
    date: { type: String }

}, { timestamps: true })

const Messages = mongoose.model("Messages", MessageSchema);
export default Messages;