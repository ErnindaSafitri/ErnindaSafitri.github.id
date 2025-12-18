// Product Data
const products = [
    {
        id: 1,
        name: "Vitamin C 500mg",
        price: 45000,
     // Ganti nama file gambar sesuai dengan yang ada di folder 'images'
        image: "images/1.jpg",
        description: "Menjaga daya tahan tubuh, isi 30 tablet."
    },
    {
        id: 2,
        name: "Thermometer Digital",
        price: 120000,
        image: "images/2.jpg",
        description: "Pengukur suhu tubuh akurat dan cepat."
    },
    {
        id: 3,
        name: "Masker Medis 3-Ply",
        price: 35000,
        image: "images/3.jpg",
        description: "Masker pelindung sekali pakai, isi 50 pcs."
    },
    {
        id: 4,
        name: "Hand Sanitizer 500ml",
        price: 25000,
        image: "images/4.jpg",
        description: "Membunuh 99.9% kuman tanpa dibilas."
    },
    {
        id: 5,
        name: "Kotak P3K Lengkap",
        price: 150000,
        image: "images/5.jpg",
        description: "Paket pertolongan pertama lengkap untuk di rumah."
    },
    {
        id: 6,
        name: "Minyak Kayu Putih",
        price: 18000,
        image: "images/6.jpg",
        description: "Menghangatkan tubuh, 60ml."
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('healthEaseCart')) || [];

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const productsList = document.getElementById('products-list');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Format Currency
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Toggle Cart
const toggleCart = () => {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
};

if (cartBtn) cartBtn.addEventListener('click', toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if (overlay) overlay.addEventListener('click', toggleCart);

// Render Products
const renderProducts = () => {
    if (!productsList) return;

    productsList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">${formatRupiah(product.price)}</div>
                <button class="btn btn-block" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
};

// Add to Cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    // Open cart to show feedback
    if (!cartSidebar.classList.contains('open')) {
        toggleCart();
    }
};

// Remove from Cart
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
};

// Update Cart (UI & Storage)
const updateCart = () => {
    localStorage.setItem('healthEaseCart', JSON.stringify(cart));

    // Update Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;

    // Update Items List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Keranjang Anda kosong.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.quantity} x ${formatRupiah(item.price)}</span>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Hapus
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatRupiah(totalPrice);
};

// Checkout
const checkout = () => {
    if (cart.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
    }

    const phoneNumber = "6287767371272"; // 0877-6737-1272
    let message = "Halo Health Ease, saya ingin memesan:\n\n";

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.quantity} pcs) - ${formatRupiah(item.price * item.quantity)}\n`;
    });

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ${formatRupiah(totalPrice)}\n\nMohon info selanjutnya.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
};

if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
});
