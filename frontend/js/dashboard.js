/**
 * Dashboard Logic - Handles Campaign management and user session verification
 */
document.addEventListener('DOMContentLoaded', () => {
    // Session Verification
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Redirect to login if no active session
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Display basic user information
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-role').textContent = user.role;

    // Cache DOM elements
    const brandSection = document.getElementById('brand-section');
    const campaignForm = document.getElementById('campaign-form');
    const campaignMessage = document.getElementById('campaign-message');
    const campaignList = document.getElementById('campaign-list');
    const listTitle = document.getElementById('list-title');

    // UI State Management based on Role
    if (user.role === 'brand') {
        brandSection.style.display = 'block';
        listTitle.textContent = 'Your Campaigns';
    } else {
        listTitle.textContent = 'Available Campaigns';
    }

    // Load Campaigns
    const loadCampaigns = async () => {
        const result = await apiRequest('/campaign', 'GET', null, token);
        if (result.success) {
            displayCampaigns(result.data);
        } else {
            campaignList.innerHTML = `<p class="error">${result.error}</p>`;
        }
    };

    /**
     * Render the campaign cards into the grid
     */
    const displayCampaigns = (campaigns) => {
        campaignList.innerHTML = '';

        // Filter for brand's own campaigns if role is brand
        const filteredCampaigns = user.role === 'brand'
            ? campaigns.filter(c => c.createdBy._id === user.id)
            : campaigns;

        if (filteredCampaigns.length === 0) {
            campaignList.innerHTML = '<p>No campaigns found.</p>';
            return;
        }

        filteredCampaigns.forEach(campaign => {
            const card = document.createElement('div');
            card.className = 'campaign-card';

            const hasApplied = campaign.applicants.includes(user.id);

            let actionHtml = '';
            if (user.role === 'influencer') {
                actionHtml = hasApplied
                    ? '<p class="success">You have applied!</p>'
                    : `<button class="apply-btn" onclick="applyToCampaign('${campaign._id}')">Apply Now</button>`;
            } else {
                actionHtml = `
                    <div class="applicants-count">Applicants Tracking: ${campaign.applicants.length} registered</div>
                    <button onclick="viewApplicants('${campaign._id}')" style="background: var(--secondary-color); margin-top: 10px;">View Applicant List</button>
                    <div id="applicants-${campaign._id}" class="applicants-list" style="display:none;"></div>
                `;
            }

            card.innerHTML = `
                <h3>${campaign.title}</h3>
                <p>${campaign.description}</p>
                <p class="budget">Budget allocation: $${campaign.budget}</p>
                <p><small>By: ${campaign.createdBy.name}</small></p>
                ${actionHtml}
            `;
            campaignList.appendChild(card);
        });
    };

    // Sign out logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // Create Campaign logic
    if (campaignForm) {
        campaignForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const budget = document.getElementById('budget').value;

            const result = await apiRequest('/campaign', 'POST', { title, description, budget }, token);
            if (result.success) {
                campaignMessage.textContent = 'Campaign created successfully!';
                campaignMessage.className = 'success';
                campaignForm.reset();
                loadCampaigns();
            } else {
                campaignMessage.textContent = result.error;
                campaignMessage.className = 'error';
            }
        });
    }

    const dashboardMessage = document.getElementById('dashboard-message');

    /**
     * Display a temporary feedback message to the user
     */
    const showMessage = (msg, isError = false) => {
        dashboardMessage.textContent = msg;
        dashboardMessage.className = isError ? 'error' : 'success';
        setTimeout(() => {
            dashboardMessage.textContent = '';
            dashboardMessage.className = '';
        }, 3000);
    };

    // Global functions for buttons
    window.applyToCampaign = async (id) => {
        const result = await apiRequest(`/campaign/${id}/apply`, 'POST', null, token);
        if (result.success) {
            showMessage('Application sent successfully!');
            loadCampaigns();
        } else {
            showMessage(result.error, true);
        }
    };

    window.viewApplicants = async (id) => {
        const applicantsDiv = document.getElementById(`applicants-${id}`);
        if (applicantsDiv.style.display === 'block') {
            applicantsDiv.style.display = 'none';
            return;
        }

        const result = await apiRequest(`/campaign/${id}/applicants`, 'GET', null, token);
        if (result.success) {
            applicantsDiv.style.display = 'block';
            if (result.data.length === 0) {
                applicantsDiv.innerHTML = 'No applications received yet.';
            } else {
                applicantsDiv.innerHTML = '<strong>Reviewing Applicants:</strong><ul>' +
                    result.data.map(a => `<li>${a.name} (${a.email})</li>`).join('') +
                    '</ul>';
            }
        } else {
            showMessage(result.error, true);
        }
    };

    loadCampaigns();
});
