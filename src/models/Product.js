import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;

