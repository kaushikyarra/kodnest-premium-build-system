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
        renderSettingsPage();
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
        const matchesThreshold = !showMatchesOnly || job.matchScore >= preferences.minMatchScore;

        return matchesSearch && matchesLocation && matchesMode && matchesExperience && matchesSource && matchesThreshold;
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
}

// Create job card HTML
function createJobCard(job) {
    const savedJobs = getSavedJobs();
    const isSaved = savedJobs.includes(job.id);
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
                
                <div class="button-group">
                    <button class="button button--primary" id="save-preferences">Save Preferences</button>
                </div>
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
