import { fail, success } from '../../utils/helper.js';
import Product from '../../models/Product.js'
import Seller from '../../models/SellerModel.js';

const createProduct = async (req, res) => {
    try {
        const sellerId = req.userId;
        const { title, description, originalPrice, discountedPrice, category, stock, images, isAvailable } = req.body;

        if (!title || !description || !originalPrice) {
            return fail(res, "Title, description, and original price are required.");
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return fail(res, "Unauthorized. Only sellers can create products.");
        }

        const product = new Product({
            sellerId,
            title,
            description,
            originalPrice,
            discountedPrice,
            category,
            stock,
            images,
            isAvailable
        });

        await product.save();

        return success(res, "Product created successfully.", product);
    } catch (error) {
        return fail(res, error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const sellerId = req.userId;
        const productId = req.params.id;
        const updates = req.body;

        const product = await Product.findById(productId);
        if (!product) return fail(res, "Product not found.");

        if (product.sellerId.toString() !== sellerId) {
            return fail(res, "Unauthorized. You can only update your own products.");
        }

        Object.assign(product, updates);
        await product.save();

        return success(res, "Product updated successfully.", product);
    } catch (error) {
        return fail(res, error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const sellerId = req.userId;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) return fail(res, "Product not found.");

        if (product.sellerId.toString() !== sellerId) {
            return fail(res, "Unauthorized. You can only delete your own products.");
        }

        await Product.findByIdAndDelete(productId);
        return success(res, "Product deleted successfully.");
    } catch (error) {
        return fail(res, error.message);
    }
};

const getMyProducts = async (req, res) => {
    try {
        const sellerId = req.userId;

        const products = await Product.find({ sellerId });
        return success(res, "Fetched your products.", products);
    } catch (error) {
        return fail(res, error.message);
    }
};


export {
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts
}