document.addEventListener('DOMContentLoaded', () => {
    const balance = document.getElementById('totalBalance');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const list = document.getElementById('list');
    const form = document.getElementById('transactionForm');
    const textInput = document.getElementById('text');
    const amountInput = document.getElementById('amount');
    const emptyState = document.getElementById('emptyState');
    const clearBtn = document.getElementById('clearBtn');

    // Local Storage setup
    const localStorageTransactions = JSON.parse(localStorage.getItem('aura_transactions'));
    let transactions = localStorage.getItem('aura_transactions') !== null ? localStorageTransactions : [];

    // Format currency dynamically with animation
    const formatCurrency = (amount) => {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    // Add transaction
    const addTransaction = (e) => {
        e.preventDefault();

        if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
            alert('Please add a description and amount');
            return;
        }

        const type = document.querySelector('input[name="type"]:checked').value;
        const amountValue = parseFloat(amountInput.value);

        const transaction = {
            id: generateID(),
            text: textInput.value,
            amount: type === 'expense' ? -Math.abs(amountValue) : Math.abs(amountValue)
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        textInput.value = '';
        amountInput.value = '';
    };

    // Generate random ID
    const generateID = () => {
        return Math.floor(Math.random() * 100000000);
    };

    // Add transactions to DOM list
    const addTransactionDOM = (transaction) => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');

        item.classList.add(transaction.amount < 0 ? 'exp' : 'inc');

        item.innerHTML = `
            <span>${transaction.text}</span>
            <span class="amount-box">${sign}${formatCurrency(Math.abs(transaction.amount))}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Prepend to show newest first
        list.insertBefore(item, list.firstChild);
        
        checkEmptyState();
    };

    // Update the balance, income and expense with counting animation
    const updateValues = () => {
        const amounts = transactions.map(transaction => transaction.amount);

        const total = amounts.reduce((acc, item) => (acc += item), 0);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
        const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

        // Animate numbers
        animateValue(balance, total, true);
        animateValue(totalIncome, income);
        animateValue(totalExpense, expense);
    };

    const animateValue = (obj, end, isTotal = false) => {
        // Simple counter animation
        const duration = 500;
        let startTimestamp = null;
        
        // Extract current value if possible, else start from 0
        let start = 0;
        const currentText = obj.innerText.replace(/[$,]/g, '');
        if(!isNaN(parseFloat(currentText))) {
            start = parseFloat(currentText);
            // If the change is very small, just set it to prevent weird flickering
            if(Math.abs(start - end) < 0.1) {
                obj.innerText = (isTotal && end < 0 ? '-' : '') + formatCurrency(Math.abs(end));
                return;
            }
        }

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeProgress;
            
            obj.innerText = (isTotal && current < 0 ? '-' : '') + formatCurrency(Math.abs(current));
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerText = (isTotal && end < 0 ? '-' : '') + formatCurrency(Math.abs(end));
            }
        };
        window.requestAnimationFrame(step);
    };

    // Remove transaction by ID
    window.removeTransaction = (id) => {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        init();
    };

    // Clear all
    clearBtn.addEventListener('click', () => {
        if(transactions.length > 0 && confirm('Are you sure you want to clear all history?')) {
            transactions = [];
            updateLocalStorage();
            init();
        }
    });

    // Update local storage
    const updateLocalStorage = () => {
        localStorage.setItem('aura_transactions', JSON.stringify(transactions));
    };

    const checkEmptyState = () => {
        if (transactions.length === 0) {
            emptyState.classList.remove('hidden');
            list.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            list.classList.remove('hidden');
        }
    };

    // Init app
    const init = () => {
        list.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
        checkEmptyState();
    };

    init();
    form.addEventListener('submit', addTransaction);
});
