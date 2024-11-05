const socket = io();


socket.on('updateProducts', (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $${product.price}`;

        li.setAttribute('data-id', product.id);
        productList.appendChild(li);
    });
});


document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    socket.emit('newProduct', { title, price: parseFloat(price) });
});


document.getElementById('delete-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = parseInt(document.getElementById('delete-product-id').value);
    socket.emit('deleteProduct', productId);
});
