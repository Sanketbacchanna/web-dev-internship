// Image Gallery functionality
function changeImage(src, element) {
    // Update main image
    document.getElementById('mainImage').src = src;
    
    // Update active state on thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// Color Selection functionality
const colorPrices = {
    'Midnight Black': { current: '$349.00', original: '$399.00', save: 'Save $50' },
    'Lunar White': { current: '$359.00', original: '$419.00', save: 'Save $60' },
    'Ocean Blue': { current: '$379.00', original: '$429.00', save: 'Save $50' }
};

function selectColor(colorName, element) {
    // Update color text
    document.getElementById('colorName').innerText = colorName;
    
    // Update active state on buttons
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    // Update prices
    const prices = colorPrices[colorName];
    if (prices) {
        document.querySelector('.current-price').innerText = prices.current;
        document.querySelector('.original-price').innerText = prices.original;
        document.querySelector('.discount-badge').innerText = prices.save;
    }
}

// Quantity functionality
function updateQuantity(change) {
    const qtyInput = document.getElementById('qty');
    let currentVal = parseInt(qtyInput.value);
    let newVal = currentVal + change;
    
    if (newVal >= 1 && newVal <= 10) {
        qtyInput.value = newVal;
    }
}

// Add to Cart functionality
let cartCount = 0;

function addToCart() {
    const qty = parseInt(document.getElementById('qty').value);
    cartCount += qty;
    
    // Update cart badge
    const badge = document.querySelector('.cart-badge');
    badge.innerText = cartCount;
    
    // Add pop animation to badge
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);
    
    // Show toast notification
    showToast();
}

// Toast Notification
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Buy Now functionality
function buyNow() {
    const qty = parseInt(document.getElementById('qty').value);
    const color = document.getElementById('colorName').innerText;
    alert(`Proceeding to checkout! \\nYou are purchasing ${qty}x Aura Pro (${color}).`);
}
