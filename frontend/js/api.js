// Base URL for the backend API - ensure this matches your server port
const API_URL = 'http://localhost:5000/api';

/**
 * Universal helper for making Fetch API requests to the backend
 * @param {string} endpoint - API route (e.g., '/auth/login')
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object|null} data - Payload for POST/PUT requests
 * @param {string|null} token - JWT for authorized requests
 * @returns {Promise<Object>} JSON response from server
 */
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Include JWT in Authorization header if provided
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    // Attach body if data exists
    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const result = await response.json();

        // Log non-ok responses for easier debugging
        if (!response.ok) {
            console.warn(`API Error [${response.status}]:`, result.error || 'Unknown error');
        }

        return result;
    } catch (error) {
        console.error('Network or Server Error:', error);
        return { success: false, error: 'Could not connect to server. Please ensure the backend is running.' };
    }
}
