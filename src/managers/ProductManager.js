const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/products.json');
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(prod => prod.id === id);
        } catch (error) {
            console.error(`Error obteniendo el producto con ID ${id}:`, error);
            return null;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            product.id = products.length ? products[products.length - 1].id + 1 : 1;
            products.push(product);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            console.error('Error agregando producto:', error);
            
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(prod => prod.id === id);
            if (index === -1) return null;

            products[index] = { ...products[index], ...updatedFields };
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error(`Error actualizando producto con ID ${id}:`, error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const filteredProducts = products.filter(prod => prod.id !== id);
            await fs.promises.writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2));
        } catch (error) {
            console.error(`Error eliminando producto con ID ${id}:`, error);
        }
    }
}

module.exports = ProductManager;
