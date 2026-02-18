// DOM elements
const registerForm = document.getElementById('register-form');
const messageDiv = document.getElementById('message');

/**
 * Handle form submission for new user registration
 */
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    // Extract values from form fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const data = { name, email, password, role };

    // API call to register endpoint
    const result = await apiRequest('/auth/register', 'POST', data);

    if (result.success) {
        // Show success and redirect after a short delay
        messageDiv.textContent = 'Registration successful! Redirecting to login...';
        messageDiv.className = 'success';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        // Display error message from server
        messageDiv.textContent = result.error || 'Registration failed';
        messageDiv.className = 'error';
    }
});
