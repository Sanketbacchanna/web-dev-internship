document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successState = document.getElementById('successState');
    const resetBtn = document.getElementById('resetBtn');

    // Input elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove error styling on input
    const inputs = [fullName, email, subject, message];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                validateField(input);
            }
        });
        
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                if (input.parentElement.parentElement.classList.contains('error')) {
                    validateField(input);
                }
            });
        }
    });

    function validateField(input) {
        const parent = input.tagName === 'SELECT' ? input.parentElement.parentElement : input.parentElement;
        let isValid = true;

        if (input.value.trim() === '') {
            isValid = false;
        } else if (input.type === 'email' && !emailPattern.test(input.value)) {
            isValid = false;
        }

        if (!isValid) {
            parent.classList.add('error');
        } else {
            parent.classList.remove('error');
        }

        return isValid;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(fullName);
        const isEmailValid = validateField(email);
        const isSubjectValid = validateField(subject);
        const isMessageValid = validateField(message);

        // If all valid, simulate submission
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = `
                <svg class="btn-icon" style="animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                <span>Sending...</span>
            `;
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                form.classList.add('hidden');
                successState.classList.remove('hidden');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        successState.classList.add('hidden');
        form.classList.remove('hidden');
        
        // Remove any error classes
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
        });
    });

    // Add spin animation to CSS dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
