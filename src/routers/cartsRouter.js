const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

// Post nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

// Get de productos en carrito  por ID
router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

// Post para agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    const cart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }
});

module.exports = router;
