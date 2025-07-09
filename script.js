// typewriter-and-darkmode.js (ou o seu script.js)

// --- VARIÁVEIS GLOBAIS ---
// Elas precisam de ser acessíveis por todas as funções.
const DARK_MODE_KEY = 'darkMode';
const THEME_TRANSITION_DURATION = 500; // ms

// Declare as referências aos elementos DOM que serão usadas por várias funções.
// Elas serão inicializadas dentro do DOMContentLoaded.
let header;
let themeToggle;
let mobileMenuBtn; // Para o menu hambúrguer
let mobileNav;     // Para o menu hambúrguer
let typewriterElement; // Para o efeito typewriter

// --- FUNÇÕES GLOBAIS ---
// Estas funções são definidas aqui para estarem disponíveis logo que o script carrega.

/**
 * Initialize theme based on user preference or system preference
 * with improved transition between states
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem(DARK_MODE_KEY);
        
    if (savedTheme === 'true') {
        document.body.classList.add('dark');
    } else if (savedTheme === 'false') {
        document.body.classList.remove('dark');
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
            localStorage.setItem(DARK_MODE_KEY, 'true');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem(DARK_MODE_KEY, 'false');
        }
    }
        
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem(DARK_MODE_KEY) === null) { 
                if (e.matches) {
                    document.body.classList.add('dark');
                } else {
                    document.body.classList.remove('dark');
                }
                // O texto do botão será atualizado no DOMContentLoaded ou no toggleDarkMode
            }
        });
    }
}

// <<< NOVA MUDANÇA IMPORTANTE >>>
// Chame initializeTheme() imediatamente após a sua definição.
initializeTheme();

/**
 * Handle scroll events for sticky header with improved animation
 * and performance optimization
 */
function handleScroll() {
    // Agora 'header' é uma variável global e será definida no DOMContentLoaded
    if (!header) return; 
        
    const scrolled = window.scrollY > 10;
        
    if (scrolled && !header.classList.contains("scrolled")) {
        header.classList.add("scrolled");
        void header.offsetWidth;
    } else if (!scrolled && header.classList.contains("scrolled")) {
        header.classList.remove("scrolled");
    }
        
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
    // <<< NOVA MUDANÇA IMPORTANTE >>>
    // Adicionar esta classe na raiz do documento para transições suaves.
    document.documentElement.classList.add('theme-transition'); 
        
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
        
    // Atualizar os botões de toggle do tema (desktop e mobile)
    if (themeToggle) {
        themeToggle.textContent = isDarkMode ? '🌞' : '🌙';
        themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
    if (mobileThemeToggle) { // mobileThemeToggle também é global e será definido
        mobileThemeToggle.textContent = isDarkMode ? '🌞' : '🌙';
        mobileThemeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
        
    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
        
    if (themeToggle) {
        themeToggle.classList.add('theme-toggle-animation');
    }
        
    const flashElement = document.createElement('div');
    flashElement.className = 'theme-flash';
    document.body.appendChild(flashElement);
        
    setTimeout(() => {
        if (themeToggle) {
            themeToggle.classList.remove('theme-toggle-animation');
        }
        document.documentElement.classList.remove('theme-transition'); 
        if (flashElement.parentNode) {
            flashElement.parentNode.removeChild(flashElement);
        }
    }, THEME_TRANSITION_DURATION);
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @returns {boolean} - True if element is in viewport
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

// --- FIM DAS FUNÇÕES GLOBAIS ---


// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // <<< NOVA MUDANÇA IMPORTANTE >>>
    // Inicialize as variáveis globais aqui, onde os elementos DOM já existem.
    header = document.getElementById("header");
    themeToggle = document.getElementById("theme-toggle");
    mobileMenuBtn = document.getElementById('mobile-menu-btn'); // Inicializa o botão do menu móvel
    mobileNav = document.getElementById('mobile-nav');         // Inicializa a navegação móvel
    typewriterElement = document.getElementById('typewriter'); // Inicializa o elemento typewriter

    // Outros elementos que são usados apenas localmente dentro de DOMContentLoaded
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');

    console.log("Typewriter element found:", typewriterElement);
        
    // Sticky header shadow on scroll with debounce for performance
    const debouncedHandleScroll = debounce(handleScroll, 10);
    window.addEventListener("scroll", debouncedHandleScroll);
        
    // Initial scroll check (in case page is loaded scrolled down)
    setTimeout(handleScroll, 100);
        
    // Dark mode toggle functionality with improved animation
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleDarkMode);
            
        // Atualiza o texto do botão do tema inicial (desktop)
        const isDarkModeInitial = document.body.classList.contains('dark');
        themeToggle.textContent = isDarkModeInitial ? '🌞' : '🌙';
        themeToggle.setAttribute('aria-label', isDarkModeInitial ? 'Switch to Light Mode' : 'Switch to Dark Mode');

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

    // <<< NOVA MUDANÇA IMPORTANTE >>>
    // Configuração do Mobile menu toggle
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            // <<< NOVA MUDANÇA IMPORTANTE >>>
            // Atualiza o ícone do botão do menu hambúrguer para indicar se está aberto/fechado (opcional, se tiver CSS para isso)
            mobileMenuBtn.classList.toggle('active'); 
        });
            
        // Close menu when clicking on a link
        mobileNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active'); // Garante que o botão também volta ao normal
            }
        });

        // Atualiza o texto do botão do tema inicial (mobile)
        const isDarkModeInitial = document.body.classList.contains('dark');
        // Assumindo que o mobileThemeToggle tem o mesmo ID ou uma classe, como '.mobile-theme-toggle'
        const currentMobileThemeToggle = mobileNav.querySelector('.mobile-theme-toggle'); 
        if (currentMobileThemeToggle) { // Se houver um toggle dentro do menu mobile
            currentMobileThemeToggle.textContent = isDarkModeInitial ? '🌞' : '🌙';
            currentMobileThemeToggle.setAttribute('aria-label', isDarkModeInitial ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            // Adicione o event listener aqui se o botão estiver dentro do mobileNav
            currentMobileThemeToggle.addEventListener('click', toggleDarkMode);
        }
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
        
    // Setup typewriter effect for the hero section - run immediately
    if (typewriterElement) {
        console.log("Setting up typewriter effect");
        setupTypewriterEffect();
    } else {
        console.error("Typewriter element not found!");
    }

    // --- Funções Auxiliares (mantidas dentro de DOMContentLoaded se não forem usadas globalmente) ---

    /**
     * Setup project filtering functionality
     */
    function setupProjectFilters() {
        projectFilters.forEach(button => {
            button.addEventListener('click', () => {
                projectFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'grid';
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
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'form-feedback';
            input.parentNode.appendChild(feedbackElement);
            input.addEventListener('blur', () => validateInput(input, feedbackElement));
            input.addEventListener('input', () => {
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
        if (!input.required && !value) {
            feedback.textContent = '';
            return true;
        }
        if (input.required && !value) {
            input.classList.add('invalid');
            feedback.textContent = 'This field is required';
            feedback.classList.add('error');
            return false;
        }
        if (name === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                input.classList.add('invalid');
                feedback.textContent = 'Please enter a valid email address';
                feedback.classList.add('error');
                return false;
            }
        }
        feedback.textContent = '';
        return true;
    }
        
    /**
     * Handle contact form submission with enhanced validation
     */
    function handleContactForm(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : '';
        const message = document.getElementById('message').value.trim();
        let isValid = true;
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            const feedbackElement = input.parentNode.querySelector('.form-feedback');
            if (!validateInput(input, feedbackElement)) {
                isValid = false;
            }
        });
        if (!isValid) {
            const invalidField = contactForm.querySelector('.invalid');
            if (invalidField) invalidField.focus();
            return;
        }
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you for your message, ${name}!</p>
            <p>I'll get back to you soon.</p>
        `;
        contactForm.style.opacity = '0';
        setTimeout(() => {
            const formContainer = contactForm.parentNode;
            formContainer.innerHTML = '';
            formContainer.appendChild(successMessage);
            setTimeout(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 50);
            contactForm.reset();
        }, 300);
    }
        
    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerOffset - 20;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
        
    /**
     * Setup scroll animations
     */
    function setupScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.project-card, .skill-category, .section-heading');
        elementsToAnimate.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
        handleScroll();
    }
    
    /**
     * Setup typewriter effect for the hero section
     * Modified to be faster and write-only - won't erase text
     */
    function setupTypewriterEffect() {
        const phrases = ['Marketeer', 'Front-End Developer'];
        let index = 0;
        let charIndex = 0;
        // let isDeleting = false; // Removido pois o efeito é apenas de escrita, não apaga
        
        function typeNextCharacter() {
            if (!typewriterElement) { // Garante que o elemento existe antes de tentar manipulá-lo
                console.error("Typewriter element not available for effect.");
                return;
            }

            const currentPhrase = phrases[index % phrases.length];
                
            if (charIndex < currentPhrase.length) {
                typewriterElement.textContent = currentPhrase.slice(0, charIndex + 1);
                charIndex++;
                setTimeout(typeNextCharacter, 50); // Velocidade de digitação
            } else {
                // Chegou ao fim da frase, espera um pouco e depois "reseta" para a próxima
                setTimeout(() => {
                    index++;
                    charIndex = 0;
                    typewriterElement.textContent = ''; // Limpa o texto para a próxima frase
                    typeNextCharacter();
                }, 2000); // Tempo de espera entre frases
            }
        }
            
        typeNextCharacter(); // Inicia o efeito
    }
});
