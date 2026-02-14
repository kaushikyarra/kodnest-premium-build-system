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
    'proof': 'proof'
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
        type: 'empty',
        title: 'Daily Digest',
        emptyMessage: 'Your personalized job digest will be delivered daily at 9AM. Configure your preferences in Settings to get started.'
    },
    proof: {
        type: 'empty',
        title: 'Proof',
        emptyMessage: 'This section will collect artifacts and proof of work for completed applications.'
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

    // Remove leading slash if present
    if (hash.startsWith('/')) {
        hash = hash.slice(1);
    }

    // Default to landing page if no hash
    if (!hash) {
        hash = 'landing';
    }

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
        contentArea.innerHTML = `
            <div class="page-container">
                <h1 class="page-title">${pageData.title}</h1>
                <p class="page-subtitle">${pageData.subtitle}</p>
                
                <div class="settings-form">
                    <div class="form-group">
                        <label class="form-label" for="role-keywords">Role Keywords</label>
                        <input type="text" id="role-keywords" class="input" placeholder="e.g., Product Manager, UX Designer">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="locations">Preferred Locations</label>
                        <input type="text" id="locations" class="input" placeholder="e.g., San Francisco, New York, Remote">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Work Mode</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="work-mode" value="remote" checked>
                                <span>Remote</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="work-mode" value="hybrid">
                                <span>Hybrid</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="work-mode" value="onsite">
                                <span>Onsite</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="experience-level">Experience Level</label>
                        <select id="experience-level" class="input">
                            <option value="">Select experience level</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (3-5 years)</option>
                            <option value="senior">Senior Level (6-10 years)</option>
                            <option value="lead">Lead/Principal (10+ years)</option>
                        </select>
                    </div>
                    
                    <div class="button-group">
                        <button class="button button--primary">Save Preferences</button>
                    </div>
                </div>
            </div>
        `;
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

    contentArea.innerHTML = `
        <div class="page-container">
            <h1 class="page-title">Dashboard</h1>
            
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
                
                <select id="sort-filter" class="input filter-select">
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
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
    document.getElementById('sort-filter').addEventListener('change', filterJobs);

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
    const sortFilter = document.getElementById('sort-filter').value;

    let filtered = jobsData.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationFilter || job.location === locationFilter;
        const matchesMode = !modeFilter || job.mode === modeFilter;
        const matchesExperience = !experienceFilter || job.experience === experienceFilter;
        const matchesSource = !sourceFilter || job.source === sourceFilter;

        return matchesSearch && matchesLocation && matchesMode && matchesExperience && matchesSource;
    });

    // Sort
    if (sortFilter === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else {
        filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    }

    renderJobCards(filtered);
}

// Render job cards
function renderJobCards(jobs) {
    const grid = document.getElementById('jobs-grid');

    if (jobs.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p class="empty-state__message">No jobs found matching your filters.</p></div>';
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
}

// Create job card HTML
function createJobCard(job) {
    const savedJobs = getSavedJobs();
    const isSaved = savedJobs.includes(job.id);
    const daysText = job.postedDaysAgo === 0 ? 'Today' :
        job.postedDaysAgo === 1 ? '1 day ago' :
            `${job.postedDaysAgo} days ago`;

    return `
        <div class="job-card">
            <div class="job-card__header">
                <h3 class="job-card__title">${job.title}</h3>
                <span class="badge badge--${job.source.toLowerCase()}">${job.source}</span>
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
