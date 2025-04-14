import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "", unique: true },
    image: { type: String, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    isDeactive: { type: Boolean, default: false },
    isProfilePublic: { type: Boolean, default: true },
    notification: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;

