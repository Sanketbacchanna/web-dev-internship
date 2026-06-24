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
function selectColor(colorName, element) {
    // Update color text
    document.getElementById('colorName').innerText = colorName;
    
    // Update active state on buttons
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
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
