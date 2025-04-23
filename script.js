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
            // If no saved preference, check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark');
                if (themeToggle) {
                    themeToggle.textContent = '🌞';
                    themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
                }
                localStorage.setItem(DARK_MODE_KEY, 'true');
            } else {
                if (themeToggle) {
                    themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
                }
            }
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (localStorage.getItem(DARK_MODE_KEY) === null) {
                    // Only auto-switch if user hasn't set a preference
                    if (e.matches) {
                        document.body.classList.add('dark');
                        if (themeToggle) {
                            themeToggle.textContent = '🌞';
                            themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
                        }
                    } else {
                        document.body.classList.remove('dark');
                        if (themeToggle) {
                            themeToggle.textContent = '🌙';
                            themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
                        }
                    }
                }
            });
        }
    }
    
    /**
     * Handle scroll events for sticky header with improved animation
     * and performance optimization
     */
    function handleScroll() {
        if (!header) return;
        
        // Add shadow and transform effect to header when scrolled
        const scrolled = window.scrollY > 10;
        
        if (scrolled && !header.classList.contains("scrolled")) {
            header.classList.add("scrolled");
            // Trigger a reflow to ensure smooth animation
            void header.offsetWidth;
        } else if (!scrolled && header.classList.contains("scrolled")) {
            header.classList.remove("scrolled");
        }
        
        // Check for elements that should animate on scroll
        const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
    }
    
    /**
     * Toggle dark mode with enhanced animation and accessibility
     */
    function toggleDarkMode() {
        console.log('Toggle dark mode clicked');
        
        // Add transition class to trigger smooth animation for all elements
        document.documentElement.classList.add('theme-transition');
        
        // Toggle dark mode class
        document.body.classList.toggle('dark');
        const isDarkMode = document.body.classList.contains('dark');
        
        console.log('Dark mode toggled to:', isDarkMode);
        
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
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'grid';
                        // Add animation
                        item.classList.add('fade-in');
                        setTimeout(() => {
                            item.classList.remove('fade-in');
                        }, 500);
                    } else {
                        item.style.display = 'none';
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
        
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // Create feedback element
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'form-feedback';
            input.parentNode.appendChild(feedbackElement);
            
            // Add event listeners for validation
            input.addEventListener('blur', () => validateInput(input, feedbackElement));
            input.addEventListener('input', () => {
                // Clear error when user starts typing again
                if (input.classList.contains('invalid')) {
                    input.classList.remove('invalid');
                    feedbackElement.textContent = '';
                    feedbackElement.classList.remove('error');
                }
            });
        });
    }
    
    /**
     * Validate form input and show feedback
     */
    function validateInput(input, feedback) {
        const value = input.value.trim();
        const name = input.name;
        
        // Don't validate empty optional fields
        if (!input.required && !value) {
            feedback.textContent = '';
            return true;
        }
        
        // Check for required fields
        if (input.required && !value) {
            input.classList.add('invalid');
            feedback.textContent = 'This field is required';
            feedback.classList.add('error');
            return false;
        }
        
        // Email validation
        if (name === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                input.classList.add('invalid');
                feedback.textContent = 'Please enter a valid email address';
                feedback.classList.add('error');
                return false;
            }
        }
        
        // Clear feedback if valid
        feedback.textContent = '';
        return true;
    }
    
    /**
     * Handle contact form submission with enhanced validation
     */
    function handleContactForm(e) {
        if (!contactForm) return;
        
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        
        // Validate all fields
        let isValid = true;
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            const feedbackElement = input.parentNode.querySelector('.form-feedback');
            if (!validateInput(input, feedbackElement)) {
                isValid = false;
            }
        });
        
        // If the form is valid, submit it
        if (isValid) {
            // Here you would typically send the form data to your server
            // Display success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
            contactForm.appendChild(successMessage);
            
            // Clear form
            contactForm.reset();
            
            // Remove success message after a delay
            setTimeout(() => {
                successMessage.classList.add('fade-out');
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        successMessage.parentNode.removeChild(successMessage);
                    }
                }, 500);
            }, 3000);
        }
    }
    
    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate the offset from the top of the page for the target element
                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight - 20;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Setup scroll animations for elements with the animate-on-scroll class
     */
    function setupScrollAnimations() {
        // Add animation classes to elements when they come into view
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Initial check for elements in viewport
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animated');
            }
        });
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
