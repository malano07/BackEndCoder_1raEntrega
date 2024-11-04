
    const socket = io();

    
    const addProductToList = (product) => {
        const productList = document.getElementById('product-list');
        const li = document.createElement('li');
        li.id = `product-${product.id}`;
        li.innerText = `${product.title} - $${product.price}`;
        productList.appendChild(li);
    };

    // Recibir y agregar producto nuevo en tiempo real
    socket.on('updateProductList', (product) => {
        addProductToList(product);
    });

    // Eliminar producto de la lista en tiempo real
    socket.on('removeProduct', (productId) => {
        const productElement = document.getElementById(`product-${productId}`);
        if (productElement) productElement.remove();
    });

    // Enviar nuevo producto al servidor vía socket
    document.getElementById('add-product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const product = {
            title: formData.get('title'),
            price: parseFloat(formData.get('price')),
        };
        socket.emit('product:created', product);
        e.target.reset();
    });
