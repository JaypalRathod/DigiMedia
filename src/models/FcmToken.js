import mongoose, { Schema } from 'mongoose';

const FcmTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
        index: true
    },
    token: {
        type: String,
        require: true
    },
    platform: {
        type: String,
        enum: ["android", "ios", "web"],
        required: true,
    },
}, { timestamps: true });

const FcmToken = mongoose.model("FcmToken", FcmTokenSchema);
export default FcmToken;

