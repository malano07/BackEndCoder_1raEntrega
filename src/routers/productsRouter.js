const express = require('express');
const ProductManager = require('../managers/ProductManager');

module.exports = (io) => {
    const router = express.Router();
    const productManager = new ProductManager();

  
    router.get('/', async (req, res) => {
        const products = await productManager.getProducts();
        res.json(products);
    });

 
    router.get('/:pid', async (req, res) => {
        const product = await productManager.getProductById(parseInt(req.params.pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    });

 
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
        io.emit('updateProducts', await productManager.getProducts()); 
        res.status(201).json(addedProduct);
    });


    router.put('/:pid', async (req, res) => {
        const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
        if (updatedProduct) {
            io.emit('updateProducts', await productManager.getProducts());
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    });


    router.delete('/:pid', async (req, res) => {
        await productManager.deleteProduct(parseInt(req.params.pid));
        io.emit('updateProducts', await productManager.getProducts()); 
        res.status(204).send();
    });

    return router;
};
