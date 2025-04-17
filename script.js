// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Store theme preference in localStorage
    const DARK_MODE_KEY = 'darkMode';
    const THEME_TRANSITION_DURATION = 500; // ms
    
    // Elements
    const header = document.getElementById("header");
    const themeToggle = document.getElementById("theme-toggle");
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');
    
    // Initialize theme based on user preference
    initializeTheme();
    
    // Debounce function for performance optimization
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Sticky header shadow on scroll with debounce for performance
    const debouncedHandleScroll = debounce(handleScroll, 10);
    window.addEventListener("scroll", debouncedHandleScroll);
    
    // Initial scroll check (in case page is loaded scrolled down)
    setTimeout(handleScroll, 100);
    
    // Dark mode toggle functionality with improved animation
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleDarkMode);
        
        // Add tooltip to theme toggle
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Toggle Dark Mode';
        themeToggle.appendChild(tooltip);
        
        // Show tooltip on hover
        themeToggle.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        
        themeToggle.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        });
    }
    
    // Project filtering (on projects page)
    if (projectFilters.length > 0 && projectItems.length > 0) {
        setupProjectFilters();
    }
    
    // Contact form handling with improved validation
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        setupFormValidation();
    }
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Add animation classes when elements come into view
    setupScrollAnimations();
    
    /**
     * Initialize theme based on user preference or system preference
     * with improved transition between states
     */
    function initializeTheme() {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem(DARK_MODE_KEY);
        
        // Prepare body for smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        if (savedTheme === 'true') {
            document.body.classList.add('dark');
            if (themeToggle) {
                themeToggle.textContent = '🌞';
                themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
            }
        } else if (savedTheme === 'false') {
            document.body.classList.remove('dark');
            if (themeToggle) {
                themeToggle.textContent = '🌙';
                themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
            }
        } else {
