const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/carts.json');
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo carritos:', error);
            return [];
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === id);
        } catch (error) {
            console.error(`Error obteniendo el carrito con ID ${id}:`, error);
            return null;
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
            carts.push(newCart);
            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error creando un nuevo carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) return null;

            const existingProduct = cart.products.find(p => p.product === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error(`Error agregando el producto ${productId} al carrito ${cartId}:`, error);
            return null;
        }
    }
}

module.exports = CartManager;
