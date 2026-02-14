// KodNest Premium Build System - Job Notification Tracker
// Hash-based routing implementation (works with file:// protocol)

// Route definitions
const routes = {
    '': 'landing',
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
        type: 'empty',
        title: 'Dashboard',
        emptyMessage: 'No jobs yet. In the next step, you will load a realistic dataset.'
    },
    settings: {
        type: 'settings',
        title: 'Settings',
        subtitle: 'Configure your job preferences'
    },
    saved: {
        type: 'empty',
        title: 'Saved Jobs',
        emptyMessage: 'You haven\'t saved any jobs yet. When you find interesting opportunities, save them here for later review.'
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
