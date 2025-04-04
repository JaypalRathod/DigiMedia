import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "", unique: true },
    image: { type: String, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;

