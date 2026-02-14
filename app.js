// KodNest Premium Build System - Job Notification Tracker
// Hash-based routing implementation (works with file:// protocol)

// Route definitions
const routes = {
    '': 'landing',
    'landing': 'landing',
    'dashboard': 'dashboard',
    'settings': 'settings',
    'saved': 'saved',
    'digest': 'digest',
    'proof': 'proof',
    'jt/07-test': 'test',
    'jt/08-ship': 'ship'
};

// Page content templates
const pages = {
    landing: {
        type: 'landing',
        headline: 'Stop Missing The Right Jobs.',
        subtext: 'Precision-matched job discovery delivered daily at 9AM.',
        cta: 'Start Tracking',
        ctaLink: '#/settings'
    },
    dashboard: {
        type: 'dashboard',
        title: 'Dashboard'
    },
    settings: {
        type: 'settings',
        title: 'Settings',
        subtitle: 'Configure your job preferences'
    },
    saved: {
        type: 'saved',
        title: 'Saved Jobs'
    },
    digest: {
        type: 'digest',
        title: 'Daily Digest'
    },
    proof: {
        type: 'empty',
        title: 'Proof',
        emptyMessage: 'This section will collect artifacts and proof of work for completed applications.'
    },
    test: {
        type: 'test',
        title: 'System Verification',
        subtitle: 'Verify system integrity before shipping.'
    },
    ship: {
        type: 'ship',
        title: 'Ready to Ship',
        subtitle: 'System verified. Ready for deployment.'
    },
    notFound: {
        type: '404',
        title: 'Page Not Found',
        subtitle: 'The page you are looking for does not exist. Please check the URL or navigate back to the dashboard.'
    }
};

// Initialize app
function init() {
    setupNavigation();
    setupMobileMenu();
    handleRoute();

    // Handle hash changes (browser back/forward and direct navigation)
    window.addEventListener('hashchange', handleRoute);
}

// Setup navigation click handlers
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            window.location.hash = hash;
        });
    });
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link on mobile
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Handle current route
function handleRoute() {
    // Get hash without the # symbol
    let hash = window.location.hash.slice(1);

    // Remove all leading slashes
    while (hash.startsWith('/')) {
        hash = hash.slice(1);
    }

    // Remove trailing slash
    if (hash.endsWith('/')) {
        hash = hash.slice(0, -1);
    }

    // Default to landing page if no hash
    if (!hash) {
        hash = 'landing';
    }

    console.log('Navigating to:', hash);

    // Check if route exists, otherwise show 404
    const page = routes[hash];
    if (page) {
        renderPage(page);
        updateActiveNav(hash);
    } else {
        renderPage('notFound');
        updateActiveNav(''); // Clear active state for 404
    }
}

// Render page content
function renderPage(pageName) {
    const pageData = pages[pageName];
    const contentArea = document.getElementById('app-content');
    const navBar = document.querySelector('.app-nav');

    if (!contentArea || !pageData) return;

    // Handle 404 page
    if (pageData.type === '404') {
        if (navBar) navBar.style.display = 'none';
        contentArea.innerHTML = `
            <div class="page-container page-container--404">
                <h1 class="page-title">${pageData.title}</h1>
                <p class="page-subtitle">${pageData.subtitle}</p>
                <div class="button-group" style="margin-top: var(--space-lg);">
                    <a href="#/dashboard" class="button button--primary">Back to Dashboard</a>
                </div>
            </div>
        `;
        return;
    }

    // Handle landing page (hide navigation for full-screen hero)
    if (pageData.type === 'landing') {
        if (navBar) navBar.style.display = 'none';
        contentArea.innerHTML = `
            <div class="landing-hero">
                <h1 class="landing-hero__headline">${pageData.headline}</h1>
                <p class="landing-hero__subtext">${pageData.subtext}</p>
                <a href="${pageData.ctaLink}" class="button button--primary button--large">${pageData.cta}</a>
            </div>
        `;
        return;
    }

    // Show navigation for all other pages
    if (navBar) navBar.style.display = 'flex';

    // Handle settings page
    if (pageData.type === 'settings') {
        renderSettingsPage();
        return;
    }

    // Handle digest page
    if (pageData.type === 'digest') {
        renderDigestPage();
        return;
    }

    // Handle test page
    if (pageData.type === 'test') {
        renderTestPage();
        return;
    }

    // Handle ship page
    if (pageData.type === 'ship') {
        renderShipPage();
        return;
    }

    // Handle empty state pages
    if (pageData.type === 'empty') {
        contentArea.innerHTML = `
            <div class="page-container">
                <h1 class="page-title">${pageData.title}</h1>
                <div class="empty-state">
                    <p class="empty-state__message">${pageData.emptyMessage}</p>
                </div>
            </div>
        `;
        return;
    }

    // Handle dashboard page
    if (pageData.type === 'dashboard') {
        renderDashboard();
        return;
    }

    // Handle saved jobs page
    if (pageData.type === 'saved') {
        renderSavedJobs();
        return;
    }
}

// Render dashboard with job cards and filters
function renderDashboard() {
    const contentArea = document.getElementById('app-content');
    const preferences = loadPreferences();
    const hasPreferences = preferences.roleKeywords || preferences.preferredLocations.length > 0 ||
        preferences.preferredMode.length > 0 || preferences.experienceLevel || preferences.skills;

    contentArea.innerHTML = `
        <div class="page-container">
            <h1 class="page-title">Dashboard</h1>
            
            ${!hasPreferences ? `
                <div class="preferences-banner">
                    <p>Set your preferences to activate intelligent matching.</p>
                    <a href="#/settings" class="button button--primary button--small">Go to Settings</a>
                </div>
            ` : ''}
            
            ${hasPreferences ? `
                <div class="match-toggle-container">
                    <label class="toggle-label">
                        <input type="checkbox" id="show-matches-only" class="toggle-checkbox">
                        <span>Show only jobs above my threshold (${preferences.minMatchScore})</span>
                    </label>
                </div>
            ` : ''}
            
            <div class="filter-bar">
                <input type="text" id="search-input" class="input filter-input" placeholder="Search by title or company...">
                
                <select id="location-filter" class="input filter-select">
                    <option value="">All Locations</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Noida">Noida</option>
                </select>
                
                <select id="mode-filter" class="input filter-select">
                    <option value="">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                </select>
                
                <select id="experience-filter" class="input filter-select">
                    <option value="">All Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                </select>
                
                <select id="source-filter" class="input filter-select">
                    <option value="">All Sources</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Indeed">Indeed</option>
                </select>
                
                <select id="status-filter" class="input filter-select">
                    <option value="">All Statuses</option>
                    <option value="Not Applied">Not Applied</option>
                    <option value="Applied">Applied</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                </select>
                
                <select id="sort-filter" class="input filter-select">
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    ${hasPreferences ? '<option value="match">Match Score</option>' : ''}
                    <option value="salary">Salary</option>
                </select>
            </div>
            
            <div id="jobs-grid" class="jobs-grid"></div>
        </div>
        
        <div id="job-modal" class="modal">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div id="modal-body"></div>
            </div>
        </div>
    `;

    // Setup filter listeners
    document.getElementById('search-input').addEventListener('input', filterJobs);
    document.getElementById('location-filter').addEventListener('change', filterJobs);
    document.getElementById('mode-filter').addEventListener('change', filterJobs);
    document.getElementById('experience-filter').addEventListener('change', filterJobs);
    document.getElementById('source-filter').addEventListener('change', filterJobs);
    document.getElementById('status-filter').addEventListener('change', filterJobs);
    document.getElementById('sort-filter').addEventListener('change', filterJobs);

    // Setup toggle listener if preferences exist
    if (hasPreferences) {
        document.getElementById('show-matches-only').addEventListener('change', filterJobs);
    }

    // Setup modal close
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('job-modal').addEventListener('click', (e) => {
        if (e.target.id === 'job-modal') closeModal();
    });

    // Initial render
    filterJobs();
}

// Filter and render jobs
function filterJobs() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value;
    const modeFilter = document.getElementById('mode-filter').value;
    const experienceFilter = document.getElementById('experience-filter').value;
    const sourceFilter = document.getElementById('source-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    const preferences = loadPreferences();
    const showMatchesOnlyCheckbox = document.getElementById('show-matches-only');
    const showMatchesOnly = showMatchesOnlyCheckbox ? showMatchesOnlyCheckbox.checked : false;

    console.log('Filter Jobs Called:', {
        showMatchesOnly,
        minMatchScore: preferences.minMatchScore,
        checkboxExists: !!showMatchesOnlyCheckbox
    });

    // Calculate match scores for all jobs
    let jobsWithScores = jobsData.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job, preferences)
    }));

    // Apply filters
    let filtered = jobsWithScores.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationFilter || job.location === locationFilter;
        const matchesMode = !modeFilter || job.mode === modeFilter;
        const matchesExperience = !experienceFilter || job.experience === experienceFilter;
        const matchesSource = !sourceFilter || job.source === sourceFilter;
        const matchesStatus = !statusFilter || getJobStatus(job.id) === statusFilter;
        const matchesThreshold = !showMatchesOnly || job.matchScore >= preferences.minMatchScore;

        return matchesSearch && matchesLocation && matchesMode && matchesExperience && matchesSource && matchesStatus && matchesThreshold;
    });

    console.log(`Filtered: ${filtered.length} jobs out of ${jobsData.length}`);

    // Sort
    if (sortFilter === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (sortFilter === 'oldest') {
        filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (sortFilter === 'match') {
        filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortFilter === 'salary') {
        // Extract numeric salary for sorting (take max value from range)
        filtered.sort((a, b) => {
            const extractSalary = (salaryStr) => {
                // Extract numbers from salary string (e.g., "₹6-10 LPA" -> 10, "₹30k-50k/month" -> 50)
                const numbers = salaryStr.match(/\d+/g);
                if (!numbers) return 0;
                // Take the maximum number found
                return Math.max(...numbers.map(n => parseInt(n)));
            };
            return extractSalary(b.salaryRange) - extractSalary(a.salaryRange);
        });
    }

    renderJobCards(filtered, showMatchesOnly, preferences.minMatchScore);
}

// ============================================
// TEST CHECKLIST & SHIP LOCK
// ============================================

const testChecklist = [
    { id: 'pref-persist', label: 'Preferences persist after refresh', tip: 'Reload page and check Settings' },
    { id: 'match-score', label: 'Match score calculates correctly', tip: 'Check math matching preferences' },
    { id: 'matches-toggle', label: '"Show only matches" toggle works', tip: 'Enable toggle, check non-matches hidden' },
    { id: 'save-job', label: 'Save job persists after refresh', tip: 'Save a job, reload, check Saved Jobs' },
    { id: 'apply-tab', label: 'Apply opens in new tab', tip: 'Click Apply, check new tab opens' },
    { id: 'status-persist', label: 'Status update persists after refresh', tip: 'Change status, reload, check persistence' },
    { id: 'status-filter', label: 'Status filter works correctly', tip: 'Filter by status, check results' },
    { id: 'digest-score', label: 'Digest generates top 10 by score', tip: 'Generate digest, check order' },
    { id: 'digest-persist', label: 'Digest persists for the day', tip: 'Reload page, check digest remains' },
    { id: 'no-errors', label: 'No console errors on main pages', tip: 'Open console (F12), browse pages' }
];

function loadTestStatus() {
    return JSON.parse(localStorage.getItem('jobTrackerTestStatus') || '{}');
}

function saveTestStatus(status) {
    localStorage.setItem('jobTrackerTestStatus', JSON.stringify(status));
}

function resetTestStatus() {
    if (confirm('Are you sure you want to reset all test progress?')) {
        localStorage.removeItem('jobTrackerTestStatus');
        renderTestPage();
    }
}

function renderTestPage() {
    const contentArea = document.getElementById('app-content');
    const status = loadTestStatus();
    const passedCount = Object.values(status).filter(Boolean).length;
    const totalCount = testChecklist.length;
    const allPassed = passedCount === totalCount;

    contentArea.innerHTML = `
        <div class="page-container">
            <h1 class="page-title">System Verification</h1>
            <p class="page-subtitle">Verify system integrity before shipping.</p>
            
            <div class="test-container">
                <div class="test-header">
                    <h2 class="test-progress">Tests Passed: ${passedCount} / ${totalCount}</h2>
                    ${!allPassed ? '<p class="test-warning">Resolve all issues before shipping.</p>' : '<p class="test-success">All tests passed. Ready to ship!</p>'}
                </div>
                
                <div class="test-list">
                    ${testChecklist.map(item => `
                        <div class="test-item">
                            <input type="checkbox" id="${item.id}" class="test-checkbox" ${status[item.id] ? 'checked' : ''}>
                            <label for="${item.id}" class="test-label">${item.label}</label>
                            <span class="tooltip-icon" title="${item.tip}">?</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="test-actions">
                    <button class="button button--secondary" id="reset-test-btn">Reset Test Status</button>
                    <button class="button button--secondary" id="diagnostic-btn">Run Diagnostic</button>
                    <a href="#/jt/08-ship" class="button button--primary ${!allPassed ? 'disabled ship-locked' : ''}" ${!allPassed ? 'disabled' : ''}>
                        Proceed to Ship
                    </a>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    document.querySelectorAll('.test-checkbox').forEach(box => {
        box.addEventListener('change', (e) => {
            status[e.target.id] = e.target.checked;
            saveTestStatus(status);
            renderTestPage(); // Re-render to update counters and buttons
        });
    });

    document.getElementById('reset-test-btn').addEventListener('click', resetTestStatus);
    document.getElementById('diagnostic-btn').addEventListener('click', runLogicDiagnostic);
}

function runLogicDiagnostic() {
    const originalState = localStorage.getItem('jobTrackerTestStatus');
    console.log('Starting Logic Diagnostic...');

    try {
        // Step 1: Reset
        localStorage.removeItem('jobTrackerTestStatus');
        let status = loadTestStatus();
        if (Object.keys(status).length !== 0) throw new Error('Reset failed');
        console.log('✓ Reset verified');

        // Step 2: Set One
        status['pref-persist'] = true;
        saveTestStatus(status);
        status = loadTestStatus();
        if (!status['pref-persist']) throw new Error('Persistence failed');
        console.log('✓ Persistence verified');

        // Step 3: Check Logic
        const allPassedBefore = Object.values(status).filter(Boolean).length === testChecklist.length;
        if (allPassedBefore) throw new Error('Premature pass');

        // Step 4: Set All
        testChecklist.forEach(item => status[item.id] = true);
        saveTestStatus(status);
        const allPassedAfter = Object.values(loadTestStatus()).filter(Boolean).length === testChecklist.length;
        if (!allPassedAfter) throw new Error('Full pass check failed');
        console.log('✓ Counting logic verified');

        alert('Diagnostic Passed! \n- Persistence: OK\n- Counters: OK\n- Ship Lock Logic: OK');

    } catch (e) {
        alert('Diagnostic FAILED: ' + e.message);
    } finally {
        // Restore State
        if (originalState) {
            localStorage.setItem('jobTrackerTestStatus', originalState);
        } else {
            localStorage.removeItem('jobTrackerTestStatus');
        }
        renderTestPage();
    }
}

function renderShipPage() {
    const status = loadTestStatus();
    const passedCount = Object.values(status).filter(Boolean).length;
    const totalCount = testChecklist.length;

    // Enforce Ship Lock
    if (passedCount < totalCount) {
        alert('Access Denied: You must pass all 10 tests before shipping.');
        window.location.hash = '#/jt/07-test';
        return;
    }

    const contentArea = document.getElementById('app-content');
    contentArea.innerHTML = `
        <div class="page-container ship-container">
            <h1 class="page-title">Ready to Ship 🚀</h1>
            <div class="success-message">
                <h2>System Verified Successfully</h2>
                <p>All ${totalCount} tests passed. The system is stable and ready for deployment.</p>
            </div>
            <a href="#/dashboard" class="button button--primary">Return to Dashboard</a>
        </div>
    `;
}

// ============================================
// STATUS TRACKING
// ============================================

// Get job status (default: "Not Applied")
function getJobStatus(jobId) {
    const statuses = getAllJobStatuses();
    return statuses[jobId] || "Not Applied";
}

// Get all job statuses
function getAllJobStatuses() {
    const saved = localStorage.getItem('jobTrackerStatus');
    return saved ? JSON.parse(saved) : {};
}

// Save job status
function setJobStatus(jobId, status) {
    const statuses = getAllJobStatuses();
    statuses[jobId] = status;
    localStorage.setItem('jobTrackerStatus', JSON.stringify(statuses));
}

// Change job status and show toast
function changeJobStatus(jobId, newStatus) {
    setJobStatus(jobId, newStatus);

    // Update UI
    const card = document.querySelector(`.job-card button[data-id="${jobId}"]`).closest('.job-card');
    if (card) {
        // Update buttons
        const buttons = card.querySelectorAll('.status-btn');
        buttons.forEach(btn => {
            if (btn.dataset.status === newStatus) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    showToast(`Status updated: ${newStatus}`);

    // If we are on the digest page, we might want to refresh the recent updates section
    // But since that requires a reload or complex logic, we'll let it update on next visit

    // Save history for digest page
    saveStatusHistory(jobId, newStatus);
}

// Save status history for digest
function saveStatusHistory(jobId, newStatus) {
    const history = JSON.parse(localStorage.getItem('jobTrackerStatusHistory') || '[]');
    const job = jobsData.find(j => j.id === jobId);

    if (job) {
        history.unshift({
            jobId,
            jobTitle: job.title,
            company: job.company,
            status: newStatus,
            changedAt: new Date().toISOString()
        });

        // Keep last 10 updates
        if (history.length > 10) history.pop();

        localStorage.setItem('jobTrackerStatusHistory', JSON.stringify(history));
    }
}

// Show toast notification
function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Render job cards
function renderJobCards(jobs, showMatchesOnly = false, minMatchScore = 40) {
    const grid = document.getElementById('jobs-grid');

    if (jobs.length === 0) {
        const preferences = loadPreferences();
        const hasPreferences = preferences.roleKeywords || preferences.preferredLocations.length > 0 ||
            preferences.preferredMode.length > 0 || preferences.experienceLevel || preferences.skills;

        let emptyMessage;
        if (hasPreferences) {
            // Premium empty state when preferences are set
            emptyMessage = 'No roles match your criteria. Adjust filters or lower threshold.';
        } else {
            // Generic empty state when no preferences
            emptyMessage = 'No jobs found matching your filters.';
        }

        grid.innerHTML = `<div class="empty-state"><p class="empty-state__message">${emptyMessage}</p></div>`;
        return;
    }

    grid.innerHTML = jobs.map(job => createJobCard(job)).join('');

    // Add event listeners
    document.querySelectorAll('.job-card__view').forEach(btn => {
        btn.addEventListener('click', () => viewJob(btn.dataset.id));
    });

    document.querySelectorAll('.job-card__save').forEach(btn => {
        btn.addEventListener('click', () => toggleSaveJob(btn.dataset.id));
    });

    document.querySelectorAll('.job-card__apply').forEach(btn => {
        btn.addEventListener('click', () => applyJob(btn.dataset.url));
    });

    // Add status button listeners
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = btn.dataset.id;
            const newStatus = btn.dataset.status;
            changeJobStatus(jobId, newStatus);
        });
    });
}

// Create job card HTML
function createJobCard(job) {
    const savedJobs = getSavedJobs();
    const isSaved = savedJobs.includes(job.id);
    const currentStatus = getJobStatus(job.id);
    const daysText = job.postedDaysAgo === 0 ? 'Today' :
        job.postedDaysAgo === 1 ? '1 day ago' :
            `${job.postedDaysAgo} days ago`;

    // Determine match score badge class
    let matchBadgeClass = 'badge--grey';
    if (job.matchScore >= 80) matchBadgeClass = 'badge--green';
    else if (job.matchScore >= 60) matchBadgeClass = 'badge--amber';
    else if (job.matchScore >= 40) matchBadgeClass = 'badge--neutral';

    const hasMatchScore = job.matchScore !== undefined;

    return `
        <div class="job-card">
            <div class="job-card__header">
                <h3 class="job-card__title">${job.title}</h3>
                <div class="job-card__badges">
                    ${hasMatchScore ? `<span class="badge badge--match ${matchBadgeClass}">${job.matchScore}% Match</span>` : ''}
                    <span class="badge badge--${job.source.toLowerCase()}">${job.source}</span>
                </div>
            </div>
            
            <div class="job-card__company">${job.company}</div>
            
            <div class="job-card__details">
                <span class="job-card__detail">
                    <span class="detail-icon">📍</span> ${job.location}
                </span>
                <span class="job-card__detail">
                    <span class="detail-icon">💼</span> ${job.mode}
                </span>
                <span class="job-card__detail">
                    <span class="detail-icon">⏱️</span> ${job.experience}
                </span>
            </div>
            
            <div class="job-card__status-group">
                <div class="job-status-group">
                    <button class="status-btn status-btn--not-applied ${currentStatus === 'Not Applied' ? 'active' : ''}" data-id="${job.id}" data-status="Not Applied">Not Applied</button>
                    <button class="status-btn status-btn--applied ${currentStatus === 'Applied' ? 'active' : ''}" data-id="${job.id}" data-status="Applied">Applied</button>
                    <button class="status-btn status-btn--rejected ${currentStatus === 'Rejected' ? 'active' : ''}" data-id="${job.id}" data-status="Rejected">Rejected</button>
                    <button class="status-btn status-btn--selected ${currentStatus === 'Selected' ? 'active' : ''}" data-id="${job.id}" data-status="Selected">Selected</button>
                </div>
            </div>

            <div class="job-card__salary">${job.salaryRange}</div>
            
            <div class="job-card__footer">
                <span class="job-card__posted">${daysText}</span>
                <div class="job-card__actions">
                    <button class="button button--secondary button--small job-card__view" data-id="${job.id}">View</button>
                    <button class="button ${isSaved ? 'button--primary' : 'button--secondary'} button--small job-card__save" data-id="${job.id}">
                        ${isSaved ? 'Saved ✓' : 'Save'}
                    </button>
                    <button class="button button--primary button--small job-card__apply" data-url="${job.applyUrl}">Apply</button>
                </div>
            </div>
        </div>
    `;
}

// View job in modal
function viewJob(jobId) {
    const job = jobsData.find(j => j.id === parseInt(jobId));
    if (!job) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2 class="modal-title">${job.title}</h2>
        <div class="modal-company">${job.company}</div>
        
        <div class="modal-details">
            <span><strong>Location:</strong> ${job.location}</span>
            <span><strong>Mode:</strong> ${job.mode}</span>
            <span><strong>Experience:</strong> ${job.experience}</span>
            <span><strong>Salary:</strong> ${job.salaryRange}</span>
            <span><strong>Source:</strong> ${job.source}</span>
        </div>
        
        <div class="modal-section">
            <h3>Description</h3>
            <p>${job.description}</p>
        </div>
        
        <div class="modal-section">
            <h3>Required Skills</h3>
            <div class="skills-list">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="button button--secondary" onclick="closeModal()">Close</button>
            <button class="button button--primary" onclick="window.open('${job.applyUrl}', '_blank')">Apply Now</button>
        </div>
    `;

    document.getElementById('job-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('job-modal').classList.remove('active');
}

// Toggle save job
function toggleSaveJob(jobId) {
    const savedJobs = getSavedJobs();
    const id = parseInt(jobId);

    if (savedJobs.includes(id)) {
        const index = savedJobs.indexOf(id);
        savedJobs.splice(index, 1);
    } else {
        savedJobs.push(id);
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    filterJobs(); // Re-render to update button state
}

// Get saved jobs from localStorage
function getSavedJobs() {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
}

// Apply to job
function applyJob(url) {
    window.open(url, '_blank');
}

// Render saved jobs page
function renderSavedJobs() {
    const contentArea = document.getElementById('app-content');
    const savedJobIds = getSavedJobs();

    if (savedJobIds.length === 0) {
        contentArea.innerHTML = `
            <div class="page-container">
                <h1 class="page-title">Saved Jobs</h1>
                <div class="empty-state">
                    <p class="empty-state__message">You haven't saved any jobs yet. When you find interesting opportunities, save them here for later review.</p>
                </div>
            </div>
        `;
        return;
    }

    const savedJobs = jobsData.filter(job => savedJobIds.includes(job.id));

    contentArea.innerHTML = `
        <div class="page-container">
            <h1 class="page-title">Saved Jobs</h1>
            <p class="page-subtitle">You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}</p>
            <div id="jobs-grid" class="jobs-grid"></div>
        </div>
        
        <div id="job-modal" class="modal">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div id="modal-body"></div>
            </div>
        </div>
    `;

    // Setup modal close
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('job-modal').addEventListener('click', (e) => {
        if (e.target.id === 'job-modal') closeModal();
    });

    renderJobCards(savedJobs);
}

// Render settings page with preferences
function renderSettingsPage() {
    const contentArea = document.getElementById('app-content');
    const preferences = loadPreferences();

    contentArea.innerHTML = `
        <div class="page-container">
            <h1 class="page-title">Settings</h1>
            <p class="page-subtitle">Configure your job preferences for intelligent matching</p>
            
            <div class="settings-form">
                <div class="form-group">
                    <label class="form-label" for="role-keywords">Role Keywords</label>
                    <input type="text" id="role-keywords" class="input" placeholder="e.g., React, Frontend, JavaScript" value="${preferences.roleKeywords || ''}">
                    <p class="form-hint">Comma-separated keywords to match in job titles and descriptions</p>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Preferred Locations</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Bangalore" ${preferences.preferredLocations.includes('Bangalore') ? 'checked' : ''}>
                            <span>Bangalore</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Pune" ${preferences.preferredLocations.includes('Pune') ? 'checked' : ''}>
                            <span>Pune</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Hyderabad" ${preferences.preferredLocations.includes('Hyderabad') ? 'checked' : ''}>
                            <span>Hyderabad</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Chennai" ${preferences.preferredLocations.includes('Chennai') ? 'checked' : ''}>
                            <span>Chennai</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Mumbai" ${preferences.preferredLocations.includes('Mumbai') ? 'checked' : ''}>
                            <span>Mumbai</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Gurgaon" ${preferences.preferredLocations.includes('Gurgaon') ? 'checked' : ''}>
                            <span>Gurgaon</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="location" value="Noida" ${preferences.preferredLocations.includes('Noida') ? 'checked' : ''}>
                            <span>Noida</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Preferred Work Mode</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="mode" value="Remote" ${preferences.preferredMode.includes('Remote') ? 'checked' : ''}>
                            <span>Remote</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="mode" value="Hybrid" ${preferences.preferredMode.includes('Hybrid') ? 'checked' : ''}>
                            <span>Hybrid</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="mode" value="Onsite" ${preferences.preferredMode.includes('Onsite') ? 'checked' : ''}>
                            <span>Onsite</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="experience-level">Experience Level</label>
                    <select id="experience-level" class="input">
                        <option value="">Any</option>
                        <option value="Fresher" ${preferences.experienceLevel === 'Fresher' ? 'selected' : ''}>Fresher</option>
                        <option value="0-1" ${preferences.experienceLevel === '0-1' ? 'selected' : ''}>0-1 years</option>
                        <option value="1-3" ${preferences.experienceLevel === '1-3' ? 'selected' : ''}>1-3 years</option>
                        <option value="3-5" ${preferences.experienceLevel === '3-5' ? 'selected' : ''}>3-5 years</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="skills">Required Skills</label>
                    <input type="text" id="skills" class="input" placeholder="e.g., React, Node.js, MongoDB" value="${preferences.skills || ''}">
                    <p class="form-hint">Comma-separated skills to match with job requirements</p>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="min-match-score">Minimum Match Score: <span id="score-value">${preferences.minMatchScore}</span></label>
                    <input type="range" id="min-match-score" class="slider" min="0" max="100" value="${preferences.minMatchScore}" step="5">
                    <p class="form-hint">Only show jobs with match score above this threshold</p>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="button button--primary">Save Preferences</button>
                </div>
            </form>
            
            <div style="margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); text-align: center;">
                <p style="color: var(--color-text-tertiary); font-size: var(--font-size-small); margin-bottom: var(--space-sm);">System Status</p>
                <a href="#/jt/07-test" class="button button--secondary button--small" style="opacity: 0.7;">Go to System Verification</a>
            </div>
        </div>
    `;

    // Setup slider value display
    const slider = document.getElementById('min-match-score');
    const scoreValue = document.getElementById('score-value');
    slider.addEventListener('input', () => {
        scoreValue.textContent = slider.value;
    });

    // Setup save button
    document.getElementById('save-preferences').addEventListener('click', savePreferences);
}

// Save preferences to localStorage
function savePreferences() {
    const roleKeywords = document.getElementById('role-keywords').value;
    const skills = document.getElementById('skills').value;
    const experienceLevel = document.getElementById('experience-level').value;
    const minMatchScore = parseInt(document.getElementById('min-match-score').value);

    const preferredLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
        .map(cb => cb.value);

    const preferredMode = Array.from(document.querySelectorAll('input[name="mode"]:checked'))
        .map(cb => cb.value);

    const preferences = {
        roleKeywords,
        preferredLocations,
        preferredMode,
        experienceLevel,
        skills,
        minMatchScore
    };

    localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));

    // Show success message
    alert('Preferences saved successfully!');
}

// ============================================
// DIGEST PAGE FUNCTIONS
// ============================================

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Load digest from localStorage
function loadDigest(date) {
    const key = `jobTrackerDigest_${date}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
}

// Save digest to localStorage
function saveDigest(date, digest) {
    const key = `jobTrackerDigest_${date}`;
    localStorage.setItem(key, JSON.stringify(digest));
}

// Generate daily digest
function generateDailyDigest() {
    const preferences = loadPreferences();
    const today = getTodayDate();

    // Calculate match scores for all jobs
    const jobsWithScores = jobsData.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job, preferences)
    }));

    // Filter jobs that meet the user's minimum match score threshold
    // This ensures we only show jobs that are truly relevant
    const matchingJobs = jobsWithScores.filter(job => job.matchScore >= preferences.minMatchScore);

    // Sort by matchScore (desc) then postedDaysAgo (asc)
    matchingJobs.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
        }
        return a.postedDaysAgo - b.postedDaysAgo;
    });

    // Take top 10
    const topJobs = matchingJobs.slice(0, 10);

    const digest = {
        date: today,
        generatedAt: new Date().toISOString(),
        jobs: topJobs
    };

    // Only save if there are jobs
    if (topJobs.length > 0) {
        saveDigest(today, digest);
    }

    return digest;
}

// Render digest page
function renderDigestPage() {
    const contentArea = document.getElementById('app-content');
    const preferences = loadPreferences();
    const hasPreferences = preferences.roleKeywords || preferences.preferredLocations.length > 0 ||
        preferences.preferredMode.length > 0 || preferences.experienceLevel || preferences.skills;

    const today = getTodayDate();
    const existingDigest = loadDigest(today);

    // No preferences set
    if (!hasPreferences) {
        contentArea.innerHTML = `
            <div class="page-container">
                <h1 class="page-title">Daily Digest</h1>
                <div class="blocking-message">
                    <p>Set preferences to generate a personalized digest.</p>
                    <a href="#/settings" class="button button--primary">Go to Settings</a>
                </div>
            </div>
        `;
        return;
    }

    // Show digest if exists, otherwise show generate button
    if (existingDigest) {
        renderDigestContent(existingDigest);
    } else {
        contentArea.innerHTML = `
            <div class="page-container">
                <h1 class="page-title">Daily Digest</h1>
                <div class="digest-generate-section">
                    <p class="digest-intro">Generate your personalized job digest for today.</p>
                    <button class="button button--primary button--large" id="generate-digest-btn">
                        Generate Today's 9AM Digest (Simulated)
                    </button>
                    <p class="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
                </div>
            </div>
        `;

        document.getElementById('generate-digest-btn').addEventListener('click', () => {
            const digest = generateDailyDigest();
            if (digest.jobs.length === 0) {
                contentArea.innerHTML = `
                    <div class="page-container">
                        <h1 class="page-title">Daily Digest</h1>
                        <div class="empty-state">
                            <p class="empty-state__message">No matching roles today. Check again tomorrow.</p>
                        </div>
                    </div>
                `;
            } else {
                renderDigestContent(digest);
            }
        });
    }
}

// Render digest content
function renderDigestContent(digest) {
    const contentArea = document.getElementById('app-content');

    contentArea.innerHTML = `
        <div class="page-container">
            <h1 class="page-title">Daily Digest</h1>
            
            <div class="digest-container">
                <div class="digest-header">
                    <h2 class="digest-title">Top 10 Jobs For You — 9AM Digest</h2>
                    <p class="digest-date">${formatDate(digest.date)}</p>
                </div>
                
                <div class="digest-jobs">
                    ${digest.jobs.map(job => createDigestJobCard(job)).join('')}
                </div>
                
                <div class="digest-footer">
                    <p>This digest was generated based on your preferences.</p>
                    <p class="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
                </div>
            </div>
            
            ${renderStatusUpdates()}
            
            <div class="digest-actions">
                <button class="button button--secondary" id="copy-digest-btn">Copy Digest to Clipboard</button>
                <button class="button button--secondary" id="regenerate-digest-btn">Regenerate Digest</button>
                <button class="button button--primary" id="email-digest-btn">Create Email Draft</button>
            </div>
        </div>
    `;

    // Setup action buttons
    document.getElementById('copy-digest-btn').addEventListener('click', () => copyDigestToClipboard(digest));
    document.getElementById('email-digest-btn').addEventListener('click', () => createEmailDraft(digest));

    // Setup regenerate button
    document.getElementById('regenerate-digest-btn').addEventListener('click', () => {
        if (confirm('Regenerate today\'s digest with current preferences?')) {
            const newDigest = generateDailyDigest();
            if (newDigest.jobs.length === 0) {
                const contentArea = document.getElementById('app-content');
                contentArea.innerHTML = `
                    <div class="page-container">
                        <h1 class="page-title">Daily Digest</h1>
                        <div class="empty-state">
                            <p class="empty-state__message">No matching roles today. Check again tomorrow.</p>
                        </div>
                    </div>
                `;
            } else {
                renderDigestContent(newDigest);
            }
        }
    });

    // Setup apply buttons
    document.querySelectorAll('.digest-job-card__apply').forEach(btn => {
        btn.addEventListener('click', () => applyJob(btn.dataset.url));
    });
}

// Create digest job card HTML
function createDigestJobCard(job) {
    return `
        <div class="digest-job-card">
            <h3 class="digest-job-card__title">${job.title}</h3>
            <p class="digest-job-card__company">${job.company} • ${job.location}</p>
            <p class="digest-job-card__details">${job.experience} • ${job.matchScore}% Match</p>
            <button class="button button--primary button--small digest-job-card__apply" data-url="${job.applyUrl}">
                Apply Now →
            </button>
        </div>
    `;
}

// Copy digest to clipboard
function copyDigestToClipboard(digest) {
    const text = `Top 10 Jobs For You — 9AM Digest
${formatDate(digest.date)}

${digest.jobs.map((job, index) => `${index + 1}. ${job.title}
   ${job.company} • ${job.location}
   ${job.experience} • ${job.matchScore}% Match
   Apply: ${job.applyUrl}
`).join('\n')}

This digest was generated based on your preferences.`;

    navigator.clipboard.writeText(text).then(() => {
        alert('Digest copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy digest. Please try again.');
    });
}

// Create email draft
function createEmailDraft(digest) {
    const subject = 'My 9AM Job Digest';
    const body = `Top 10 Jobs For You — 9AM Digest
${formatDate(digest.date)}

${digest.jobs.map((job, index) => `${index + 1}. ${job.title}
   ${job.company} • ${job.location}
   ${job.experience} • ${job.matchScore}% Match
   Apply: ${job.applyUrl}
`).join('\n')}

This digest was generated based on your preferences.`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}


// Render status updates section
function renderStatusUpdates() {
    const history = JSON.parse(localStorage.getItem('jobTrackerStatusHistory') || '[]');

    if (history.length === 0) return '';

    return `
        <div class="status-updates-section">
            <h3 class="status-updates-title">Recent Status Updates</h3>
            <div class="status-updates-list">
                ${history.map(item => `
                    <div class="status-update-item">
                        <div class="status-update-info">
                            <h4 class="status-update-job">${item.jobTitle}</h4>
                            <p class="status-update-company">${item.company}</p>
                        </div>
                        <div class="status-update-right">
                            <span class="status-badge status-badge--${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span>
                            <span class="status-update-date">${formatTimeAgo(item.changedAt)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Format time ago
function formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Load preferences from localStorage
function loadPreferences() {
    const saved = localStorage.getItem('jobTrackerPreferences');
    if (saved) {
        return JSON.parse(saved);
    }

    // Default preferences
    return {
        roleKeywords: '',
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: '',
        skills: '',
        minMatchScore: 40
    };
}

// Calculate match score for a job
function calculateMatchScore(job, preferences) {
    let score = 0;

    // +25 if any roleKeyword in job.title (case-insensitive)
    if (preferences.roleKeywords) {
        const keywords = preferences.roleKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
        const titleLower = job.title.toLowerCase();
        if (keywords.some(keyword => titleLower.includes(keyword))) {
            score += 25;
        }

        // +15 if any roleKeyword in job.description
        const descLower = job.description.toLowerCase();
        if (keywords.some(keyword => descLower.includes(keyword))) {
            score += 15;
        }
    }

    // +15 if job.location matches preferredLocations
    if (preferences.preferredLocations.length > 0 && preferences.preferredLocations.includes(job.location)) {
        score += 15;
    }

    // +10 if job.mode matches preferredMode
    if (preferences.preferredMode.length > 0 && preferences.preferredMode.includes(job.mode)) {
        score += 10;
    }

    // +10 if job.experience matches experienceLevel
    if (preferences.experienceLevel && job.experience === preferences.experienceLevel) {
        score += 10;
    }

    // +15 if overlap between job.skills and user.skills
    if (preferences.skills) {
        const userSkills = preferences.skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const hasOverlap = userSkills.some(skill => jobSkills.some(js => js.includes(skill) || skill.includes(js)));
        if (hasOverlap) {
            score += 15;
        }
    }

    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') {
        score += 5;
    }

    // Cap at 100
    return Math.min(score, 100);
}

// Update active navigation link
function updateActiveNav(currentHash) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href').slice(1); // Remove #
        const linkRoute = linkHash.startsWith('/') ? linkHash.slice(1) : linkHash;

        if (linkRoute === currentHash || (!currentHash && linkRoute === 'dashboard')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
