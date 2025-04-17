document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Add event listeners
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Set up project filters if on projects page
    if (document.querySelector('.project-filters')) {
        setupProjectFilters();
    }
    
    // Set up form validation if on contact page
    if (document.getElementById('contact-form')) {
        setupFormValidation();
    }
    
    // Set up smooth scrolling
    setupSmoothScrolling();
    
    // Set up scroll animations
    setupScrollAnimations();
});

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Initialize theme based on user preference or system preference
 * with improved transition between states
 */
function initializeTheme() {
    const darkModeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark theme if saved or system prefers it
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '☀️';
        darkModeToggle.setAttribute('aria-label', 'Toggle Light Mode');
    } else {
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
    }
    
    // Add tooltip for first-time users
    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip');
    tooltip.textContent = document.body.classList.contains('dark') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    darkModeToggle.appendChild(tooltip);
    
    // Show tooltip briefly on first visit
    if (!localStorage.getItem('tooltipShown')) {
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateX(-50%) translateY(10px)';
                localStorage.setItem('tooltipShown', 'true');
            }, 3000);
        }, 1000);
    }
    
    // Add hover effect for tooltip
    darkModeToggle.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    darkModeToggle.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(-50%) translateY(10px)';
    });
}

/**
 * Handle scroll events for sticky header with improved animation
 * and performance optimization
 */
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

/**
 * Toggle dark mode with enhanced animation and accessibility
 */
function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('theme-toggle');
    const tooltip = darkModeToggle.querySelector('.tooltip');
    
    // Add transition class for smooth transition
    body.classList.add('theme-transition');
    
    // Create flash effect
    const flash = document.createElement('div');
    flash.classList.add('theme-flash');
    body.appendChild(flash);
    
    // Toggle dark mode class and update button
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
        localStorage.setItem('theme', 'light');
        
        if (tooltip) {
            tooltip.textContent = 'Switch to Dark Mode';
        }
    } else {
        body.classList.add('dark');
        darkModeToggle.innerHTML = '☀️';
        darkModeToggle.setAttribute('aria-label', 'Toggle Light Mode');
        localStorage.setItem('theme', 'dark');
        
        if (tooltip) {
            tooltip.textContent = 'Switch to Light Mode';
        }
    }
    
    // Add animation to button
    darkModeToggle.classList.add('theme-toggle-animation');
    
    // Clean up after transition
    setTimeout(() => {
        darkModeToggle.classList.remove('theme-toggle-animation');
        body.removeChild(flash);
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 500);
    }, 500);
    
    // Re-append tooltip after changing button content
    if (tooltip) {
        darkModeToggle.appendChild(tooltip);
    }
}

/**
 * Setup project filtering functionality
 */
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item, .modern-project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active button
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                const parent = item.closest('.project-link-wrapper') || item;
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    parent.style.display = 'block';
                    setTimeout(() => {
                        parent.style.opacity = '1';
                        parent.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    parent.style.opacity = '0';
                    parent.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        parent.style.display = 'none';
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
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const nameFeedback = document.getElementById('name-feedback');
    const emailFeedback = document.getElementById('email-feedback');
    const messageFeedback = document.getElementById('message-feedback');
    
    // Set up real-time validation
    nameInput.addEventListener('input', () => validateInput(nameInput, nameFeedback));
    emailInput.addEventListener('input', () => validateInput(emailInput, emailFeedback));
    messageInput.addEventListener('input', () => validateInput(messageInput, messageFeedback));
    
    // Handle form submission
    contactForm.addEventListener('submit', handleContactForm);
}

/**
 * Validate form input and show feedback
 * @param {HTMLElement} input - Input element to validate
 * @param {HTMLElement} feedback - Element to show feedback in
 */
function validateInput(input, feedback) {
    const value = input.value.trim();
    
    // Clear previous validation
    input.classList.remove('invalid');
    feedback.textContent = '';
    feedback.classList.remove('error');
    
    if (input.id === 'name') {
        if (value.length < 2) {
            input.classList.add('invalid');
            feedback.textContent = 'Name must be at least 2 characters';
            feedback.classList.add('error');
            return false;
        }
    } else if (input.id === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            input.classList.add('invalid');
            feedback.textContent = 'Please enter a valid email address';
            feedback.classList.add('error');
            return false;
        }
    } else if (input.id === 'message') {
        if (value.length < 10) {
            input.classList.add('invalid');
            feedback.textContent = 'Message must be at least 10 characters';
            feedback.classList.add('error');
            return false;
        }
    }
    
    return true;
}

/**
 * Handle contact form submission with enhanced validation
 * @param {Event} e - Form submit event
 */
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const nameFeedback = document.getElementById('name-feedback');
    const emailFeedback = document.getElementById('email-feedback');
    const messageFeedback = document.getElementById('message-feedback');
    
    // Validate all inputs
    const nameValid = validateInput(nameInput, nameFeedback);
    const emailValid = validateInput(emailInput, emailFeedback);
    const messageValid = validateInput(messageInput, messageFeedback);
    
    if (nameValid && emailValid && messageValid) {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('form-success');
        successMessage.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            <p>Thanks for your message, ${nameInput.value}!</p>
            <p>I'll get back to you soon.</p>
        `;
        
        // Hide form and show success message
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            form.parentNode.appendChild(successMessage);
            setTimeout(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 100);
        }, 300);
        
        // Optional: Send form data to server
        // fetch('/api/contact', {
        //     method: 'POST',
        //     body: new FormData(form)
        // });
    }
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Setup animations for elements when they come into view
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport
    animatedElements.forEach(el => {
        if (isElementInViewport(el)) {
            el.classList.add('animated');
        }
    });
    
    // Add scroll listener
    window.addEventListener('scroll', debounce(() => {
        animatedElements.forEach(el => {
            if (isElementInViewport(el) && !el.classList.contains('animated')) {
                el.classList.add('animated');
            }
        });
    }, 50));
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
        rect.top <= windowHeight * 0.85 &&
        rect.bottom >= 0
    );
}
