const products = [
    { id: 1, name: 'Red Polo', color: 'red', type: 'polo', gender: 'male', price: 30, image: 'red_polo.jpg', quantity: 10 },
    { id: 2, name: 'Green Round', color: 'green', type: 'round', gender: 'female', price: 25, image: 'green_round.jpg', quantity: 15 },
    { id: 3, name: 'Blue Polo', color: 'blue', type: 'polo', gender: 'male', price: 35, image: 'blue_polo.jpg', quantity: 8 },
    { id: 4, name: 'Red Round', color: 'red', type: 'round', gender: 'female', price: 20, image: 'red_round.jpg', quantity: 12 }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    document.getElementById('searchBar').addEventListener('input', filterProducts);
    document.getElementById('genderFilter').addEventListener('change', filterProducts);
    document.getElementById('colorFilter').addEventListener('change', filterProducts);
    document.getElementById('typeFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('input', (e) => {
        document.getElementById('priceValue').textContent = e.target.value;
        filterProducts();
    });
    document.getElementById('cartButton').addEventListener('click', toggleCart);
});

function displayProducts(productList) {
    const productListEl = document.getElementById('productList');
    productListEl.innerHTML = '';
    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Color: ${product.color}</p>
            <p>Type: ${product.type}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productListEl.appendChild(productCard);
    });
}

function filterProducts() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const genderFilter = document.getElementById('genderFilter').value;
    const colorFilter = document.getElementById('colorFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;

    const filteredProducts = products.filter(product => {
        return (
            (product.name.toLowerCase().includes(searchQuery) || 
            product.color.toLowerCase().includes(searchQuery) || 
            product.type.toLowerCase().includes(searchQuery)) &&
            (genderFilter === '' || product.gender === genderFilter) &&
            (colorFilter === '' || product.color === colorFilter) &&
            (typeFilter === '' || product.type === typeFilter) &&
            product.price <= priceFilter
        );
    });

    displayProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.quantity) {
            cartItem.quantity++;
        } else {
            alert('Not enough stock available');
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    updateCartDisplay();
}

function toggleCart() {
    const cartSection = document.getElementById('cart');
    cartSection.classList.toggle('hidden');
}

function updateCartCount() {
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const totalAmountEl = document.getElementById('totalAmount');

    cartItemsEl.innerHTML = '';
    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <p>Quantity: 
                <input type="number" value="${item.quantity}" min="1" max="${item.quantity}" 
                onchange="updateQuantity(${item.id}, this.value)">
            </p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsEl.appendChild(cartItem);
    });

    totalAmountEl.textContent = totalAmount.toFixed(2);
}

function updateQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (newQuantity > product.quantity) {
        alert('Not enough stock available');
        newQuantity = product.quantity;
    }

    cartItem.quantity = parseInt(newQuantity, 10);
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}
