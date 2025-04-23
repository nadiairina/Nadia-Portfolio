// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded successfully');
    
    // Store theme preference in localStorage
    const DARK_MODE_KEY = 'darkMode';
    const THEME_TRANSITION_DURATION = 500; // ms
    
    // Elements
    const header = document.getElementById("header");
    const themeToggle = document.getElementById("theme-toggle");
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');
    
    console.log('Theme toggle button found:', themeToggle);
    
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
    } else {
        console.error('Theme toggle button not found!');
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
    
    // Setup typewriter effect for the hero section
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        setupTypewriterEffect();
    }
    
    /**
     * Initialize theme based on user preference or system preference
     * with improved transition between states
     */
    function initializeTheme() {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem(DARK_MODE_KEY);
        
        console.log('Saved theme preference:', savedTheme);
        
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
            // If no preference is saved, check system preference
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkMode) {
                document.body.classList.add('dark');
                if (themeToggle) {
                    themeToggle.textContent = '🌞';
                    themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
                }
                localStorage.setItem(DARK_MODE_KEY, 'true');
            } else {
                localStorage.setItem(DARK_MODE_KEY, 'false');
            }
        }
    }
    
    /**
     * Handle scroll events for sticky header with improved animation
     * and performance optimization
     */
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
    
    /**
     * Toggle dark mode with enhanced animation and accessibility
     */
    function toggleDarkMode() {
        console.log('Toggle dark mode clicked');
        
        // Create flash effect for theme change
        const flash = document.createElement('div');
        flash.className = 'theme-flash';
        document.body.appendChild(flash);
        
        // Add animation class to toggle button
        themeToggle.classList.add('theme-toggle-animation');
        
        // Add transition class to body for smooth transition
        document.body.classList.add('theme-transition');
        
        // Toggle dark mode class
        document.body.classList.toggle('dark');
        
        // Update localStorage
        const isDarkMode = document.body.classList.contains('dark');
        localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
        
        // Update toggle button text and aria-label
        if (isDarkMode) {
            themeToggle.textContent = '🌞';
            themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
        }
        
        // Remove animation and transition classes after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-animation');
            document.body.classList.remove('theme-transition');
            document.body.removeChild(flash);
        }, THEME_TRANSITION_DURATION);
    }
    
    /**
     * Setup project filtering functionality
     */
    function setupProjectFilters() {
        projectFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remove active class from all filters
                projectFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to current filter
                filter.classList.add('active');
                
                // Get filter value
                const filterValue = filter.getAttribute('data-filter');
                
                // Show/hide projects based on filter
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        // Add animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    /**
     * Setup form validation with real-time feedback
     */
    function setupFormValidation() {
        if (!contactForm) return;
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                validateInput(input, document.getElementById(`${input.id}-feedback`));
            });
            
            // Clear error on focus
            input.addEventListener('focus', () => {
                input.classList.remove('invalid');
                const feedback = document.getElementById(`${input.id}-feedback`);
                if (feedback) {
                    feedback.textContent = '';
                    feedback.classList.remove('error');
                }
            });
        });
    }
    
    /**
     * Validate form input and show feedback
     */
    function validateInput(input, feedback) {
        if (!input || !feedback) return;
        
        // Reset
        input.classList.remove('invalid');
        feedback.textContent = '';
        feedback.classList.remove('error');
        
        // Validate based on input type
        if (input.value.trim() === '') {
            input.classList.add('invalid');
            feedback.textContent = 'This field is required';
            feedback.classList.add('error');
            return false;
        }
        
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            input.classList.add('invalid');
            feedback.textContent = 'Please enter a valid email address';
            feedback.classList.add('error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Handle contact form submission with enhanced validation
     */
    function handleContactForm(e) {
        e.preventDefault();
        
        // Validate all inputs
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            const feedback = document.getElementById(`${input.id}-feedback`);
            if (!validateInput(input, feedback)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Normally you would send the form data to a server here
        // Since this is a demo, we'll just show a success message
        
        // Hide the form
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(20px)';
        
        // Show success message
        const successMessage = document.getElementById('form-success');
        if (successMessage) {
            setTimeout(() => {
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 50);
            }, 300);
        }
    }
    
    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    /**
     * Setup scroll animations for elements with the animate-on-scroll class
     */
    function setupScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const checkViewport = debounce(() => {
            elements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('animated');
                }
            });
        }, 100);
        
        // Initial check
        setTimeout(checkViewport, 100);
        
        // Check on scroll
        window.addEventListener('scroll', checkViewport);
    }
    
    /**
     * Check if an element is in the viewport
     * @param {Element} el - The element to check
     * @returns {boolean} - True if the element is in the viewport
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }
    
    /**
     * Setup typewriter effect for job titles on the hero section
     */
    function setupTypewriterEffect() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;
        
        // Job titles with Marketeer first, Front-end Developer second
        const jobTitles = ['Marketeer', 'Front-end Developer'];
        
        let currentTitleIndex = 0;
        let typingSpeed = 80; // Faster typing speed (was 150)
        
        function showNextTitle() {
            // Clear previous content
            typewriterElement.textContent = '';
            
            // Get current title
            const currentTitle = jobTitles[currentTitleIndex];
            
            // Change to the next title index for the next cycle
            currentTitleIndex = (currentTitleIndex + 1) % jobTitles.length;
            
            // Set up character-by-character display
            let charIndex = 0;
            
            function typeNextChar() {
                if (charIndex < currentTitle.length) {
                    // Add next character
                    typewriterElement.textContent += currentTitle[charIndex];
                    charIndex++;
                    
                    // Continue typing
                    setTimeout(typeNextChar, typingSpeed);
                } else {
                    // Finished typing the current title
                    // Wait longer before switching to the next title
                    setTimeout(showNextTitle, 2000);
                }
            }
            
            // Start typing the current title
            typeNextChar();
        }
        
        // Start the typing effect
        showNextTitle();
    }
});
