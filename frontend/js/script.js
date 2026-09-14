// Base URL for API
const API_BASE = 'https://backend-production-0c6b2.up.railway.app/api';

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initReportForm();
    initTracking();
    initAdminDashboard();
    initLiveMap();
    initAnimations();
});

// Category Map based on sample_data.sql
const categoryMap = {
    'Pothole': 1,
    'Road Damage': 2,
    'Drainage': 3,
    'Garbage': 4,
    'Streetlight': 5,
    'Water Leakage': 6,
    'Other': 1 // Default to 1
};

// --- 1. Report Form Logic ---
function initReportForm() {
    const issueForm = document.getElementById("issueForm");
    if (!issueForm) return;

    let currentLat = 23.3441; // Default
    let currentLng = 85.3096; // Default

    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            const locInput = document.getElementById("location");
            if(locInput) {
                locInput.value = `Lat: ${currentLat.toFixed(4)}, Lon: ${currentLng.toFixed(4)}`;
            }
        });
    }

    issueForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const issueType = document.getElementById('issueType').value;
        const priority = document.getElementById('priority').value;
        const description = document.getElementById('description').value;
        
        const category_id = categoryMap[issueType] || 1;
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        try {
            const response = await fetch(`${API_BASE}/issues`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1, // Demo user
                    category_id: category_id,
                    description: description,
                    latitude: currentLat,
                    longitude: currentLng,
                    priority: priority
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert(`✅ Your civic issue has been submitted successfully!\nReport ID: ${data.report_id}`);
                this.reset();
            } else {
                alert(`❌ Failed to submit: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('❌ Error connecting to server.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Report";
        }
    });

    const takePhotoBtn = document.getElementById("takePhoto");
    if (takePhotoBtn) {
        takePhotoBtn.addEventListener("click", function() {
            document.getElementById("photo").click();
        });
    }
}

// --- 2. Tracking Logic ---
function initTracking() {
    const reportInput = document.getElementById('reportInput');
    if (!reportInput) return;

    // Allow Enter key to trigger search
    reportInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchReport();
        }
    });
}

async function searchReport() {
    const input = document.getElementById('reportInput');
    const reportCard = document.getElementById('reportCard');
    
    if (input.value.trim() === '') {
        alert('Please enter a valid Report ID (e.g., JH-2026-001)');
        return;
    }
    
    // Clear previous error messages
    const existingError = document.getElementById('error-message');
    if (existingError) existingError.remove();

    reportCard.style.display = 'none'; // Ensure it's hidden while loading

    try {
        const response = await fetch(`${API_BASE}/issues/${input.value.trim()}`);
        const issue = await response.json();

        if (response.ok && issue) {
            reportCard.style.display = 'block';
            reportCard.style.opacity = '1';
            
            // Update UI with issue data
            reportCard.querySelector('.report-id').textContent = 'Report #' + issue.report_id;
            reportCard.querySelector('.status-badge').textContent = issue.current_status;
            
            // Set status badge color dynamically
            const badge = reportCard.querySelector('.status-badge');
            badge.className = 'status-badge'; // reset
            badge.classList.add('status-' + issue.current_status.toLowerCase().replace(' ', '-'));

            reportCard.querySelector('.report-title').textContent = issue.description;
            
            // Display category and priority
            let detailsDiv = reportCard.querySelector('.report-details');
            if (!detailsDiv) {
                detailsDiv = document.createElement('div');
                detailsDiv.className = 'report-details';
                detailsDiv.style.marginBottom = '15px';
                detailsDiv.style.color = '#6b7280';
                detailsDiv.style.fontSize = '0.9em';
                const titleElement = reportCard.querySelector('.report-title');
                titleElement.parentNode.insertBefore(detailsDiv, titleElement.nextSibling);
            }
            detailsDiv.innerHTML = `<strong>Category:</strong> ${issue.category_name || 'General'} &nbsp;|&nbsp; <strong>Priority:</strong> ${issue.priority || 'Normal'}`;

            // Highlight timeline based on status
            const statuses = ['Reported', 'Acknowledged', 'In Progress', 'Resolved'];
            let currentIndex = statuses.indexOf(issue.current_status);
            if (currentIndex === -1) currentIndex = 0;
            
            const statusTimes = {};
            statusTimes['Reported'] = new Date(issue.created_at);
            if (issue.history && issue.history.length > 0) {
                issue.history.forEach(h => {
                    statusTimes[h.status_to] = new Date(h.updated_at);
                });
            }
            
            const icons = { 'Reported': '!', 'Acknowledged': '✓', 'In Progress': '⟳', 'Resolved': '○' };
            const cssClasses = { 'Reported': 'reported', 'Acknowledged': 'acknowledged', 'In Progress': 'progress', 'Resolved': 'resolved' };
            
            const timelineContainer = reportCard.querySelector('.timeline');
            timelineContainer.innerHTML = ''; // Clear hardcoded timeline
            
            statuses.forEach((status, index) => {
                const isCompleted = index <= currentIndex;
                const timeObj = statusTimes[status];
                
                let timeString = 'Pending';
                if (timeObj) {
                    timeString = timeObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
                }

                const iconOpacity = isCompleted ? '1' : '0.4';
                const iconBg = isCompleted ? '#27ae60' : '#e1e8ed';
                const iconColor = isCompleted ? 'white' : '#7f8c8d';

                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-icon ${cssClasses[status]}" style="opacity: ${iconOpacity}; background: ${iconBg}; color: ${iconColor};">
                        ${icons[status]}
                    </div>
                    <div class="timeline-content">
                        <h4>${status}</h4>
                        <p>${timeString}</p>
                    </div>
                `;
                timelineContainer.appendChild(timelineItem);
            });
            
            const progressFill = reportCard.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = ((currentIndex + 1) / 4 * 100) + '%';
                // Retrigger animation
                const targetWidth = progressFill.style.width;
                progressFill.style.width = '0%';
                setTimeout(() => {
                    progressFill.style.width = targetWidth;
                }, 50);
            }
            
            const completionText = reportCard.querySelector('.completion-text');
            if (completionText) {
                if (issue.current_status === 'Resolved') {
                    completionText.textContent = 'Issue resolved successfully.';
                } else {
                    completionText.textContent = 'We are working on resolving this issue.';
                }
            }
        } else {
            // Not found or error
            reportCard.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.id = 'error-message';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.padding = '15px';
            errorMsg.style.marginTop = '20px';
            errorMsg.style.backgroundColor = '#fce5e5';
            errorMsg.style.borderRadius = '8px';
            errorMsg.style.textAlign = 'center';
            errorMsg.textContent = 'Report not found. Please check your Report ID and try again.';
            
            const searchContainer = document.querySelector('.search-container');
            searchContainer.parentNode.insertBefore(errorMsg, searchContainer.nextSibling);
        }
    } catch (error) {
        console.error(error);
        reportCard.style.display = 'none';
        alert('Error fetching report details. Please ensure backend is running.');
    }
}

function toggleNotifications() {
    const btn = document.querySelector('.notification-btn');
    if (!btn) return;
    const isEnabled = btn.textContent.includes('Enable');
    
    if (isEnabled) {
        btn.innerHTML = `<i class="fas fa-bell-slash"></i> Disable Notifications`;
        btn.style.borderColor = '#27ae60';
        btn.style.color = '#27ae60';
    } else {
        btn.innerHTML = `<i class="fas fa-bell"></i> Enable Notifications`;
        btn.style.borderColor = '#e1e8ed';
        btn.style.color = '#7f8c8d';
    }
}

// --- 3. Admin Dashboard Logic ---
async function initAdminDashboard() {
    const totalReportsEl = document.getElementById('totalReports');
    if (!totalReportsEl) return;

    try {
        // Fetch stats
        const statsRes = await fetch(`${API_BASE}/admin/stats`);
        const stats = await statsRes.json();
        
        totalReportsEl.textContent = stats.total_issues;
        document.getElementById('resolvedReports').textContent = stats.resolved_issues;
        document.getElementById('avgResolution').textContent = '2.5 days'; // Demo value
        document.getElementById('activeUsers').textContent = stats.total_users;

        // Fetch issues for table
        const issuesRes = await fetch(`${API_BASE}/admin/issues`);
        const issues = await issuesRes.json();

        const tableBody = document.getElementById('reportsTableBody');
        tableBody.innerHTML = ''; 
        
        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.className = 'report-row';
            row.innerHTML = `
                <td class="report-cell">
                    <div class="report-id">${issue.report_id}</div>
                    <div class="report-title">${issue.category_name || 'Issue'}</div>
                    <div class="report-location">Reported by: ${issue.citizen_name || 'Anonymous'}</div>
                </td>
                <td class="report-cell">
                    <span class="category-tag">${issue.category_name || 'General'}</span>
                    <span class="priority-tag priority-${issue.priority.toLowerCase()}">${issue.priority}</span>
                </td>
                <td class="report-cell">
                    <span class="status-badge status-${issue.current_status.toLowerCase().replace(' ', '-')}">${issue.current_status}</span>
                </td>
                <td class="report-cell">
                    <select onchange="updateIssueStatus('${issue.report_id}', this.value)" style="padding:5px; border-radius:4px; border:1px solid #ddd; background: #fff; cursor: pointer;">
                        <option value="Reported" ${issue.current_status === 'Reported' ? 'selected' : ''}>Reported</option>
                        <option value="Acknowledged" ${issue.current_status === 'Acknowledged' ? 'selected' : ''}>Acknowledged</option>
                        <option value="In Progress" ${issue.current_status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${issue.current_status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Rejected" ${issue.current_status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Initialize Charts if Chart.js is loaded
        if (typeof Chart !== 'undefined') {
            const ctxCategory = document.getElementById('categoryChart');
            const ctxStatus = document.getElementById('statusChart');
            
            if (ctxCategory) {
                new Chart(ctxCategory, {
                    type: 'doughnut',
                    data: {
                        labels: ['Issues'],
                        datasets: [{
                            data: [stats.total_issues], 
                            backgroundColor: ['#3498db']
                        }]
                    }
                });
            }
            
            if (ctxStatus) {
                new Chart(ctxStatus, {
                    type: 'bar',
                    data: {
                        labels: ['Resolved', 'Pending'],
                        datasets: [{
                            label: 'Issues',
                            data: [stats.resolved_issues, stats.pending_issues], 
                            backgroundColor: '#3498db'
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
                });
            }
        }
    } catch (error) {
        console.error("Error loading admin dashboard data:", error);
    }
}

// Make updateIssueStatus available globally so the inline HTML onchange can call it
window.updateIssueStatus = async function(reportId, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/issues/${reportId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Status updated successfully');
            initAdminDashboard(); // refresh
        } else {
            alert('Failed to update status: ' + data.error);
        }
    } catch (error) {
        console.error(error);
        alert('Error updating status');
    }
}

// --- 4. Live Map Logic ---
async function initLiveMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;

    // Initialize Leaflet Map centered on Jharkhand
    const map = L.map('map').setView([23.4, 85.8], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    try {
        const response = await fetch(`${API_BASE}/issues`);
        const issues = await response.json();

        // Add Issue Markers
        issues.forEach(issue => {
            if (issue.current_status !== 'Resolved' && issue.latitude && issue.longitude) {
                const markerColor = issue.priority === 'Critical' ? 'red' : 
                                    issue.priority === 'High' ? 'orange' : 
                                    issue.priority === 'Medium' ? 'blue' : 'gray';
                                    
                const circleMarker = L.circleMarker([issue.latitude, issue.longitude], {
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: 0.7,
                    radius: 10
                }).addTo(map);
                
                circleMarker.bindPopup(`
                    <b>${issue.category_name || 'Issue'}</b><br>
                    ID: ${issue.report_id}<br>
                    Status: ${issue.current_status}<br>
                    Priority: ${issue.priority}
                `);
            }
        });

        // Populate Recent Issues sidebar
        const issuesList = document.getElementById('recentIssuesList');
        if (issuesList) {
            issuesList.innerHTML = '';
            issues.forEach(issue => {
                const div = document.createElement('div');
                div.className = 'issue-item';
                // formatting date
                const dateObj = new Date(issue.created_at);
                const dateStr = dateObj.toLocaleDateString();

                div.innerHTML = `
                    <div class="issue-status ${issue.current_status.toLowerCase().replace(' ', '-')}">${issue.current_status}</div>
                    <div class="issue-content">
                        <h3 class="issue-title">${issue.category_name || 'Issue'}</h3>
                        <p class="issue-location">📍 Lat: ${issue.latitude}, Lng: ${issue.longitude}</p>
                        <p class="issue-category">${issue.dept_name || 'Department'}</p>
                        <p class="issue-time">${dateStr}</p>
                    </div>
                    <div class="priority-badge ${issue.priority.toLowerCase()}">${issue.priority}</div>
                `;
                issuesList.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error loading map data:", error);
    }
}

// --- 5. Shared Animations ---
function initAnimations() {
    const progressBars = document.querySelectorAll('.progress-fill, .rewards-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width || bar.offsetWidth;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}
