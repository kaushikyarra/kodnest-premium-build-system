// KodNest Premium Build System - Job Notification Tracker
// Hash-based routing implementation (works with file:// protocol)

// Route definitions
const routes = {
    '': 'dashboard',
    'dashboard': 'dashboard',
    'settings': 'settings',
    'saved': 'saved',
    'digest': 'digest',
    'proof': 'proof'
};

// Page content templates
const pages = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'This section will be built in the next step.'
    },
    settings: {
        title: 'Settings',
        subtitle: 'This section will be built in the next step.'
    },
    saved: {
        title: 'Saved',
        subtitle: 'This section will be built in the next step.'
    },
    digest: {
        title: 'Digest',
        subtitle: 'This section will be built in the next step.'
    },
    proof: {
        title: 'Proof',
        subtitle: 'This section will be built in the next step.'
    },
    notFound: {
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

    // Default to dashboard if no hash
    if (!hash) {
        hash = 'dashboard';
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

    if (contentArea && pageData) {
        contentArea.innerHTML = `
            <div class="page-container">
                <h1 class="page-title">${pageData.title}</h1>
                <p class="page-subtitle">${pageData.subtitle}</p>
            </div>
        `;
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
