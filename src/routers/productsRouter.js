const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// get de todos los productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

// Get producto por ID
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Get post 1 producto
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };
    const addedProduct = await productManager.addProduct(newProduct);
    res.status(201).json(addedProduct);
});

// Put 1 producto por ID
router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Delete producto por ID
router.delete('/:pid', async (req, res) => {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.status(204).send();
});

module.exports = router;
