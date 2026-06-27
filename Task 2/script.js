var basketTotal = 0;

var priceMap = {
    'Sony': { c: '$349.00', o: '$399.00', s: 'Save $50' },
    'Bose': { c: '$359.00', o: '$419.00', s: 'Save $60' },
    'Sennheiser': { c: '$379.00', o: '$429.00', s: 'Save $50' }
};

function changeImage(url, thumbNode) {
    document.getElementById('mainImage').src = url;
    var allThumbs = document.querySelectorAll('.thumbnail');
    for(var i=0; i<allThumbs.length; i++) {
        allThumbs[i].classList.remove('active');
    }
    thumbNode.classList.add('active');
}

function selectBrand(bName, btnNode) {
    document.getElementById('brandName').innerHTML = bName;
    var allBtns = document.querySelectorAll('.brand-btn');
    for(var j=0; j<allBtns.length; j++) {
        allBtns[j].classList.remove('active');
    }
    btnNode.classList.add('active');
    
    var data = priceMap[bName];
    if(data) {
        document.querySelector('.current-price').innerHTML = data.c;
        document.querySelector('.original-price').innerHTML = data.o;
        document.querySelector('.discount-badge').innerHTML = data.s;
    }
}

function updateQuantity(diff) {
    var qBox = document.getElementById('qty');
    var val = parseInt(qBox.value) + diff;
    if (val > 0 && val <= 10) {
        qBox.value = val;
    }
}

function addToCart() {
    basketTotal += parseInt(document.getElementById('qty').value);
    document.querySelector('.cart-badge').innerHTML = basketTotal;
    
    var t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(function() {
        t.classList.remove('show');
    }, 2500);
}

function buyNow() {
    var brand = document.getElementById('brandName').innerHTML;
    var n = document.getElementById('qty').value;
    alert("Checking out " + n + " units of " + brand);
}

function openSupport(e) { if(e) e.preventDefault(); alert("Support chat is offline."); }
function openSearch() { alert("Search feature coming soon."); }
function openProfile() { alert("Please login first."); }
