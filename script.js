// typewriter-and-darkmode.js (ou o seu script.js)

// 1. CHAME A FUNÇÃO initializeTheme AQUI MESMO, NO INÍCIO DO FICHEIRO!
// Isso faz com que o tema seja aplicado o mais cedo possível, mal o navegador carrega este script.
initializeTheme(); 

// 2. A DEFINIÇÃO COMPLETA DA FUNÇÃO initializeTheme DEVE ESTAR AQUI TAMBÉM
// (E foi removida de dentro do document.addEventListener('DOMContentLoaded'))
function initializeTheme() {
    // Definimos a chave para o localStorage UMA VEZ AQUI
    const DARK_MODE_KEY = 'theme'; // <-- MUDANÇA AQUI: Usa 'theme' para consistência

    // Tenta obter a preferência guardada no localStorage
    const savedTheme = localStorage.getItem(DARK_MODE_KEY); 
    
    // Verifica a preferência do sistema operativo
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Aplica o tema
    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
        document.body.classList.add('dark');
        // Se o botão de tema já existir (porque este script é defer ou no final do body),
        // atualize-o. Se não, ele será atualizado quando o DOM estiver pronto.
        const themeToggleElement = document.getElementById("theme-toggle");
        if (themeToggleElement) {
            themeToggleElement.textContent = '🌞';
            themeToggleElement.setAttribute('aria-label', 'Switch to Light Mode');
        }
        // Se a preferência for dark por sistema e não houver preferência anterior, guarda-a
        if (savedTheme === null) { 
            localStorage.setItem(DARK_MODE_KEY, 'true');
        }
    } else {
        document.body.classList.remove('dark'); // Garante que é light mode
        const themeToggleElement = document.getElementById("theme-toggle");
        if (themeToggleElement) {
            themeToggleElement.textContent = '🌙';
            themeToggleElement.setAttribute('aria-label', 'Switch to Dark Mode');
        }
        // Se a preferência for light por sistema e não houver preferência anterior, guarda-a
        if (savedTheme === null) { 
            localStorage.setItem(DARK_MODE_KEY, 'false');
        }
    }

    // Ouve as mudanças no tema do sistema, mas só se o utilizador não tiver uma preferência guardada
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem(DARK_MODE_KEY) === null) { // LÊ COM a chave definida acima
                if (e.matches) {
                    document.body.classList.add('dark');
                    const themeToggleElement = document.getElementById("theme-toggle");
                    if (themeToggleElement) {
                        themeToggleElement.textContent = '🌞';
                        themeToggleElement.setAttribute('aria-label', 'Switch to Light Mode');
                    }
                } else {
                    document.body.classList.remove('dark');
                    const themeToggleElement = document.getElementById("theme-toggle");
                    if (themeToggleElement) {
                        themeToggleElement.textContent = '🌙';
                        themeToggleElement.setAttribute('aria-label', 'Switch to Dark Mode');
                    }
                }
            }
        });
    }
}

// O RESTO DO SEU CÓDIGO JS, DENTRO DO document.addEventListener('DOMContentLoaded', ...)
document.addEventListener('DOMContentLoaded', () => {
    // Não precisa mais da declaração de DARK_MODE_KEY aqui, pois já está globalmente na initializeTheme
    // const DARK_MODE_KEY = 'darkMode'; // <-- REMOVA OU COMENTE ESTA LINHA
    const THEME_TRANSITION_DURATION = 500; // ms
    
    // Elements (se estes elementos são usados apenas após o DOMContentLoaded, mantêm-se aqui)
    const header = document.getElementById("header");
    const themeToggle = document.getElementById("theme-toggle"); // Este deve ser o seu botão principal
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');
    const typewriterElement = document.getElementById('typewriter');

    console.log("Typewriter element found:", typewriterElement);
    
    // A chamada a initializeTheme() foi MOVIDA para o topo do ficheiro, então remova-a daqui:
    // initializeTheme(); // <-- REMOVA OU COMENTE ESTA LINHA
    
    // Debounce function (mantenha como está)
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Sticky header shadow (mantenha como está)
    const debouncedHandleScroll = debounce(handleScroll, 10);
    window.addEventListener("scroll", debouncedHandleScroll);
    setTimeout(handleScroll, 100);
    
    // Dark mode toggle functionality (mantenha como está, mas usará a função global toggleDarkMode)
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleDarkMode); // Usa a função global
        
        // Add tooltip to theme toggle (mantenha como está)
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Toggle Dark Mode';
        themeToggle.appendChild(tooltip);
        
        // Show tooltip on hover (mantenha como está)
        themeToggle.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        
        themeToggle.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        });
    }
    
    // NOVO CÓDIGO: Mobile menu toggle (que estava no script inline do HTML)
    const hamburgerMenu = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle'); // Assumindo uma classe para o toggle no menu mobile
    
    // Toggle mobile menu
    if (hamburgerMenu && mobileOverlay) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (hamburgerMenu && mobileOverlay) {
            hamburgerMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
    }
    
    // Mobile theme toggle - deve chamar a MESMA função toggleDarkMode
    if (mobileThemeToggle) { 
        mobileThemeToggle.addEventListener('click', toggleDarkMode); // <-- MUDANÇA AQUI: Usa a função global toggleDarkMode
    }
    
    // Close menu on escape key (mantenha como está)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileOverlay && mobileOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Project filtering (mantenha como está)
    if (projectFilters.length > 0 && projectItems.length > 0) {
        setupProjectFilters();
    }
    
    // Contact form handling (mantenha como está)
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        setupFormValidation();
    }
    
    // Smooth scrolling for anchor links (mantenha como está)
    setupSmoothScrolling();
    
    // Add animation classes (mantenha como está)
    setupScrollAnimations();
    
    // Typewriter effect (mantenha como está)
    if (typewriterElement) {
        console.log("Setting up typewriter effect");
        setupTypewriterEffect();
    } else {
        console.error("Typewriter element not found!");
    }
}); // Fim do DOMContentLoaded


// AS SEGUINTES FUNÇÕES TAMBÉM DEVERÃO ESTAR FORA DO DOMContentLoaded
// (se ainda não estiverem, mova-as para fora para que sejam acessíveis globalmente)

/**
 * Handle scroll events for sticky header with improved animation
 * and performance optimization
 */
function handleScroll() {
    if (!header) return; // 'header' precisa de ser passado como argumento ou ser global se não estiver no DOMContentLoaded

    // AVISO: A variável 'header' está declarada dentro do DOMContentLoaded.
    // Para que esta função use 'header', ou ela precisa de estar dentro do DOMContentLoaded,
    // ou 'header' precisa de ser uma variável global, ou ser passada como argumento.
    // Sugestão: Defina 'const header = document.getElementById("header");' FORA DO DOMContentLoaded
    // junto com themeToggle, para que sejam globais e acessíveis a estas funções.
    
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
    // Add transition class to trigger smooth animation for all elements
    document.documentElement.classList.add('theme-transition'); // Se esta classe não for usada, pode remover
    
    // Toggle dark mode class
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    
    // Update button icon and aria-label for accessibility
    const themeToggleElement = document.getElementById("theme-toggle"); // Pega no botão principal
    if (themeToggleElement) {
        themeToggleElement.textContent = isDarkMode ? '🌞' : '🌙';
        themeToggleElement.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Se tiver um mobileThemeToggle separado, atualize-o também
    const mobileThemeToggleElement = document.querySelector('.mobile-theme-toggle');
    if (mobileThemeToggleElement && mobileThemeToggleElement !== themeToggleElement) {
        mobileThemeToggleElement.textContent = isDarkMode ? '🌞' : '🌙';
        mobileThemeToggleElement.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode.toString()); // <-- MUDANÇA AQUI: Usa 'theme'
    
    // Add animation to theme toggle
    if (themeToggleElement) {
        themeToggleElement.classList.add('theme-toggle-animation');
    }
    
    // Flash effect on body background (mantenha como está)
    const flashElement = document.createElement('div');
    flashElement.className = 'theme-flash';
    document.body.appendChild(flashElement);
    
    // Clean up animations after transition completes (mantenha como está)
    setTimeout(() => {
        if (themeToggleElement) {
            themeToggleElement.classList.remove('theme-toggle-animation');
        }
        document.documentElement.classList.remove('theme-transition'); 
        if (flashElement.parentNode) {
            flashElement.parentNode.removeChild(flashElement);
        }
    }, THEME_TRANSITION_DURATION);
}

/**
 * Setup project filtering functionality
 */
function setupProjectFilters() { /* ... mantém como está ... */ }

/**
 * Setup form validation with real-time feedback
 */
function setupFormValidation() { /* ... mantém como está ... */ }

/**
 * Validate form input and show feedback
 */
function validateInput(input, feedback) { /* ... mantém como está ... */ }

/**
 * Handle contact form submission with enhanced validation
 */
function handleContactForm(e) { /* ... mantém como está ... */ }

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() { /* ... mantém como está ... */ }

/**
 * Setup typewriter effect for the hero section
 */
function setupTypewriterEffect() { /* ... mantém como está ... */ }

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) { /* ... mantém como está ... */ }

/**
 * Setup scroll animations
 */
function setupScrollAnimations() { /* ... mantém como está ... */ }
