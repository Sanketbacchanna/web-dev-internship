(function() {
    // Unique data store
    var budgetManager = {
        records: JSON.parse(localStorage.getItem('my_unique_budget_data')) || [],
        
        save: function() {
            localStorage.setItem('my_unique_budget_data', JSON.stringify(this.records));
        },
        
        addRecord: function(desc, val, isIncome) {
            this.records.push({
                desc: desc,
                val: isIncome ? Math.abs(val) : -Math.abs(val),
                stamp: new Date().getTime()
            });
            this.save();
            refreshUI();
        },
        
        wipe: function() {
            this.records = [];
            this.save();
            refreshUI();
        },
        
        removeById: function(stamp) {
            this.records = this.records.filter(function(r) { return r.stamp !== stamp; });
            this.save();
            refreshUI();
        }
    };

    function formatM(num) {
        var parts = num.toFixed(2).split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "$" + parts.join(".");
    }

    function refreshUI() {
        var bal = 0, inc = 0, exp = 0;
        var ul = document.getElementById('list');
        ul.innerHTML = '';
        
        if (budgetManager.records.length === 0) {
            document.getElementById('emptyState').classList.remove('hidden');
        } else {
            document.getElementById('emptyState').classList.add('hidden');
        }

        for (var i = budgetManager.records.length - 1; i >= 0; i--) {
            var r = budgetManager.records[i];
            bal += r.val;
            if (r.val > 0) inc += r.val;
            else exp += r.val;

            var li = document.createElement('li');
            li.className = r.val < 0 ? 'exp' : 'inc';
            li.innerHTML = "<span>" + r.desc + "</span><span class='amount-box'>" + (r.val < 0 ? "-" : "+") + formatM(Math.abs(r.val)) + "</span><button class='delete-btn' data-id='" + r.stamp + "'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' width='16' height='16'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg></button>";
            ul.appendChild(li);
        }

        document.getElementById('totalBalance').innerText = (bal < 0 ? "-" : "") + formatM(Math.abs(bal));
        document.getElementById('totalIncome').innerText = formatM(inc);
        document.getElementById('totalExpense').innerText = formatM(Math.abs(exp));
        
        // attach events to buttons
        var btns = ul.getElementsByClassName('delete-btn');
        for (var j = 0; j < btns.length; j++) {
            btns[j].onclick = function() {
                budgetManager.removeById(parseInt(this.getAttribute('data-id')));
            };
        }
    }

    window.addEventListener('load', function() {
        refreshUI();
        
        document.getElementById('transactionForm').onsubmit = function(ev) {
            ev.preventDefault();
            var desc = document.getElementById('text').value;
            var amt = parseFloat(document.getElementById('amount').value);
            var isInc = document.querySelector('input[name="type"]:checked').value === 'income';
            
            if (desc && !isNaN(amt)) {
                budgetManager.addRecord(desc, amt, isInc);
                document.getElementById('text').value = '';
                document.getElementById('amount').value = '';
            }
        };

        document.getElementById('clearBtn').onclick = function() {
            if (confirm("Clear everything?")) budgetManager.wipe();
        };
    });
})();
