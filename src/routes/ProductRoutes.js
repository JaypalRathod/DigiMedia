import express from 'express';
import { isAuth } from '../utils/auth.js';
import { createProduct, deleteProduct, getMyProducts, updateProduct } from '../controllers/product/ProductController.js';

const router = express.Router();

router.post('/createProduct', isAuth, createProduct);
router.put('/update/:id', isAuth, updateProduct);
router.delete('/delete/:id', isAuth, deleteProduct);
router.get('/my-products', isAuth, getMyProducts);

export { router as ProductRoute }