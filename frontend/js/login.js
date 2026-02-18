// DOM elements for login
const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');

/**
 * Handle form submission for user login
 */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    // Extract credentials from fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = { email, password };

    // API call to authenticated login endpoint
    const result = await apiRequest('/auth/login', 'POST', data);

    if (result.success) {
        // Store session token and user profile in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        messageDiv.textContent = 'Login successful! Redirecting...';
        messageDiv.className = 'success';

        // Wait a second then go to the dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        // Show error returned by the backend global error handler
        messageDiv.textContent = result.error || 'Login failed';
        messageDiv.className = 'error';
    }
});
