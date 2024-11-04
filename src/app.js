// app.js
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');

const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();


const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Rutas de productos y carritos
app.use('/api/products', productsRouter(io));  // Pasamos 'io' al router de productos
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});



io.on('connection', (socket) => {
    console.log('Cliente conectado');
    
    socket.on('newProduct', async (productData) => {
        await productManager.addProduct(productData);
        io.emit('updateProducts', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        io.emit('updateProducts', await productManager.getProducts());
    });
});




server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);

});
