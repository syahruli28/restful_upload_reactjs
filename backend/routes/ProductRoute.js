import express from "express";
import { getProducts, getProductById, saveProduct, updateProduct, deleteProduct } from "../controllers/ProductController.js";


const router = express.Router(); // inisiasi routernya

router.get('/products', getProducts); // arahkan ke getProducts
router.get('/products/:id', getProductById); // arahkan ke getProductById
router.post('/products', saveProduct); // arahkan ke saveProduct
router.patch('/products/:id', updateProduct); // arahkan ke updateProduct
router.delete('/products/:id', deleteProduct); // arahkan ke deleteProduct

export default router;