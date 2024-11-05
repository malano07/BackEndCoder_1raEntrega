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
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server);


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api/products', productsRouter(io));  
app.use('/api/carts', cartsRouter);
app.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtime', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTime', { products });
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
