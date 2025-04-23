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
    
    // Setup typewriter effect for the hero section
    setupTypewriterEffect();
    
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
            // If no saved preference, check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark');
                if (themeToggle) {
                    themeToggle.textContent = '🌞';
                    themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
                }
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
        // Add transition class to trigger smooth animation for all elements
        document.documentElement.classList.add('theme-transition');
        
        // Toggle dark mode class
        document.body.classList.toggle('dark');
        const isDarkMode = document.body.classList.contains('dark');
        
        // Update button icon and aria-label for accessibility
        if (themeToggle) {
            themeToggle.textContent = isDarkMode ? '🌞' : '🌙';
            themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
        
        // Save preference to localStorage
        localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
        
        // Add animation to theme toggle
        themeToggle.classList.add('theme-toggle-animation');
        
        // Flash effect on body background
        const flashElement = document.createElement('div');
        flashElement.className = 'theme-flash';
        document.body.appendChild(flashElement);
        
        // Clean up animations after transition completes
        setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-animation');
            document.documentElement.classList.remove('theme-transition');
            if (flashElement.parentNode) {
                flashElement.parentNode.removeChild(flashElement);
            }
        }, THEME_TRANSITION_DURATION);
    }
    
    /**
     * Setup project filtering functionality
     */
    function setupProjectFilters() {
        projectFilters.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                projectFilters.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter value
                const filterValue = button.getAttribute('data-filter');
                
                // Filter projects
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
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
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Create feedback element
            const feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            input.parentNode.appendChild(feedback);
            
            // Add event listeners for real-time validation
            input.addEventListener('blur', () => validateInput(input, feedback));
            input.addEventListener('input', () => validateInput(input, feedback));
        });
    }
    
    /**
     * Validate form input and show feedback
     */
    function validateInput(input, feedback) {
        // Reset feedback
        feedback.textContent = '';
        feedback.className = 'form-feedback';
        
        // Skip validation if empty (will be caught by required attribute)
        if (!input.value.trim()) return;
        
        // Validate by input type
        switch(input.id) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    feedback.textContent = 'Please enter a valid email address';
                    feedback.className = 'form-feedback error';
                } else {
                    feedback.textContent = 'Looks good!';
                    feedback.className = 'form-feedback success';
                }
                break;
                
            case 'name':
                if (input.value.trim().length < 2) {
                    feedback.textContent = 'Name must be at least 2 characters';
                    feedback.className = 'form-feedback error';
                } else {
                    feedback.textContent = 'Looks good!';
                    feedback.className = 'form-feedback success';
                }
                break;
                
            case 'message':
                if (input.value.trim().length < 10) {
                    feedback.textContent = 'Message must be at least 10 characters';
                    feedback.className = 'form-feedback error';
                } else {
                    feedback.textContent = 'Looks good!';
                    feedback.className = 'form-feedback success';
                }
                break;
        }
    }
    
    /**
     * Handle contact form submission with enhanced validation
     */
    function handleContactForm(e) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        // Validate all inputs
        inputs.forEach(input => {
            const feedback = input.parentNode.querySelector('.form-feedback');
            validateInput(input, feedback);
            
            // Check if input is invalid
            if (feedback.className.includes('error') || !input.value.trim()) {
                isValid = false;
            }
        });
        
        // If form is invalid, prevent submission
        if (!isValid) {
            e.preventDefault();
            
            // Scroll to first invalid input
            const firstInvalidInput = contactForm.querySelector('.form-feedback.error')?.parentNode.querySelector('input, textarea');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
                firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
                
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    /**
     * Setup scroll animations for elements with the animate-on-scroll class
     */
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // If no animated elements, exit early
        if (animatedElements.length === 0) return;
        
        // Setup intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all elements with animation classes
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * Setup typewriter effect for job titles on the hero section
     */
    function setupTypewriterEffect() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;
        
        const phrases = ['Marketer', 'Frontend Developer'];  // Separate job titles
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        typewriterElement.classList.add('blinking-cursor');
        
        function type() {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                // Removing characters
                currentCharIndex--;
                typingSpeed = 50; // Delete faster
            } else {
                // Adding characters
                currentCharIndex++;
                typingSpeed = 150; // Type slower
            }
            
            // Display current text
            typewriterElement.textContent = currentPhrase.substring(0, currentCharIndex);
            
            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                // Finished typing current phrase
                isDeleting = false;  // Don't delete - keep the full text
                typingSpeed = 2000;  // Wait 2 seconds before starting to delete
                setTimeout(() => {
                    isDeleting = true;  // Now delete to restart animation
                    type();
                }, typingSpeed);
                return;
            } else if (isDeleting && currentCharIndex === 0) {
                // Finished deleting
                isDeleting = false;
                // Move to next phrase
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next phrase
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start the typing effect
        setTimeout(type, 1000);
    }
});
