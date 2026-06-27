(function() {
    function checkValid(node) {
        var val = node.value.trim();
        var isValid = true;
        
        if (val === '') {
            isValid = false;
        } else if (node.type === 'email' && val.indexOf('@') === -1) {
            isValid = false;
        }

        var wrapper = node.tagName === 'SELECT' ? node.parentNode.parentNode : node.parentNode;
        if (isValid) {
            wrapper.classList.remove('error');
        } else {
            wrapper.classList.add('error');
        }
        return isValid;
    }

    window.addEventListener('load', function() {
        var theForm = document.getElementById('contactForm');
        var fName = document.getElementById('fullName');
        var fEmail = document.getElementById('email');
        var fSubj = document.getElementById('subject');
        var fMsg = document.getElementById('message');

        var allFields = [fName, fEmail, fSubj, fMsg];

        for (var i = 0; i < allFields.length; i++) {
            allFields[i].oninput = function() {
                var p = this.tagName === 'SELECT' ? this.parentNode.parentNode : this.parentNode;
                if (p.classList.contains('error')) {
                    checkValid(this);
                }
            };
            if (allFields[i].tagName === 'SELECT') {
                allFields[i].onchange = allFields[i].oninput;
            }
        }

        theForm.onsubmit = function(ev) {
            ev.preventDefault();
            var ok1 = checkValid(fName);
            var ok2 = checkValid(fEmail);
            var ok3 = checkValid(fSubj);
            var ok4 = checkValid(fMsg);

            if (ok1 && ok2 && ok3 && ok4) {
                var btn = document.getElementById('submitBtn');
                var old = btn.innerHTML;
                btn.innerHTML = 'Sending...';
                
                setTimeout(function() {
                    theForm.classList.add('hidden');
                    document.getElementById('successState').classList.remove('hidden');
                    btn.innerHTML = old;
                }, 1200);
            }
        };

        document.getElementById('resetBtn').onclick = function() {
            theForm.reset();
            document.getElementById('successState').classList.add('hidden');
            theForm.classList.remove('hidden');
            
            var errs = document.querySelectorAll('.input-group');
            for(var k=0; k<errs.length; k++){
                errs[k].classList.remove('error');
            }
        };
    });
})();
