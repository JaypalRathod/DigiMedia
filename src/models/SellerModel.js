import mongoose, { Schema } from 'mongoose';

const SellerSchema = new Schema({
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "", unique: true },
    image: { type: String, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    shopName: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    isDeactive: { type: Boolean, default: false },
}, { timestamps: true });

const Seller = mongoose.model("Seller", SellerSchema);
export default Seller;

