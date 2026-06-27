function changeImage(src, element) {
    document.getElementById('mainImage').src = src;
    
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

const brandPrices = {
    'Sony': { current: '$349.00', original: '$399.00', save: 'Save $50' },
    'Bose': { current: '$359.00', original: '$419.00', save: 'Save $60' },
    'Sennheiser': { current: '$379.00', original: '$429.00', save: 'Save $50' }
};

function selectBrand(brandName, element) {
    document.getElementById('brandName').innerText = brandName;
    
    const brandBtns = document.querySelectorAll('.brand-btn');
    brandBtns.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    const prices = brandPrices[brandName];
    if (prices) {
        document.querySelector('.current-price').innerText = prices.current;
        document.querySelector('.original-price').innerText = prices.original;
        document.querySelector('.discount-badge').innerText = prices.save;
    }
}

function updateQuantity(change) {
    const qtyInput = document.getElementById('qty');
    let currentVal = parseInt(qtyInput.value);
    let newVal = currentVal + change;
    
    if (newVal >= 1 && newVal <= 10) {
        qtyInput.value = newVal;
    }
}

let cartCount = 0;

function addToCart() {
    const qty = parseInt(document.getElementById('qty').value);
    cartCount += qty;
    
    const badge = document.querySelector('.cart-badge');
    badge.innerText = cartCount;
    
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);
    
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function buyNow() {
    const qty = parseInt(document.getElementById('qty').value);
    const brand = document.getElementById('brandName').innerText;
    alert(`Proceeding to checkout! \nYou are purchasing ${qty}x Aura Pro (${brand}).`);
}

function openSupport(event) {
    if (event) event.preventDefault();
    alert("Support center will be available soon.");
}

function openSearch() {
    alert("Search functionality is currently disabled.");
}

function openProfile() {
    alert("User profile is under construction.");
}
