// typewriter-and-darkmode.js (ou o seu script.js)

// <<< MUDANÇA AQUI >>>
// 1. Defina a chave DARK_MODE_KEY globalmente para que seja acessível em qualquer lugar.
// Isso evita que a variável DARK_MODE_KEY seja declarada dentro do DOMContentLoaded e depois movida.
const DARK_MODE_KEY = 'darkMode';

// <<< MUDANÇA AQUI >>>
// 2. Mova a função initializeTheme() e sua chamada para fora do DOMContentLoaded.
// Ela precisa ser executada o mais cedo possível para evitar o "flicker".
/**
 * Initialize theme based on user preference or system preference
 * with improved transition between states
 */
function initializeTheme() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem(DARK_MODE_KEY); // Usa a chave global
        
    // Prepare body for smooth transition. Adiciona a transição apenas APÓS o tema inicial ser aplicado.
    // Isso evita que a transição aconteça no carregamento inicial, que é o que causa o "flicker".
    // A transição será adicionada quando o usuário CLICAR no toggle.
    // document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'; // <<< REMOVIDO DAQUI >>>
        
    if (savedTheme === 'true') {
        document.body.classList.add('dark');
        // themeToggle ainda não está disponível aqui (será no DOMContentLoaded)
        // Por isso, esta lógica de atualização do texto do botão vai para o DOMContentLoaded
    } else if (savedTheme === 'false') {
        document.body.classList.remove('dark');
        // themeToggle ainda não está disponível aqui
    } else {
        // If no saved preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
            localStorage.setItem(DARK_MODE_KEY, 'true'); // Guarda a preferência do sistema
        } else {
            // Se o sistema for light, garante que a classe 'dark' não está presente
            document.body.classList.remove('dark');
            localStorage.setItem(DARK_MODE_KEY, 'false'); // Guarda a preferência do sistema
        }
    }
        
    // Listen for system theme changes (mantenha, mas ajuste para usar DARK_MODE_KEY)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Só auto-switch se o usuário NÃO tiver definido uma preferência manual
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
// <<< MUDANÇA AQUI >>>
// 3. Chame initializeTheme() imediatamente após a sua definição.
initializeTheme();

// <<< MUDANÇA AQUI >>>
// 4. Defina a constante THEME_TRANSITION_DURATION globalmente, se for usada em toggleDarkMode.
const THEME_TRANSITION_DURATION = 500; // ms

// --- FUNÇÕES GLOBAIS ---
// Mova funções que precisam ser acessíveis por outras funções fora do DOMContentLoaded para aqui
// (como handleScroll e toggleDarkMode)

/**
 * Handle scroll events for sticky header with improved animation
 * and performance optimization
 */
function handleScroll() {
    // <<< ATENÇÃO >>> A variável 'header' ainda está declarada dentro do DOMContentLoaded.
    // Se esta função for chamada fora do DOMContentLoaded (o que acontece com `window.addEventListener("scroll")`),
    // 'header' não estará definida aqui.
    // Para resolver isso, você precisará declarar `const header = document.getElementById("header");`
    // FORA do DOMContentLoaded, talvez junto com DARK_MODE_KEY e THEME_TRANSITION_DURATION.
    // Por enquanto, vamos assumir que você vai lidar com isso ou que o seu debounce/setTimeout
    // ainda está a chamar handleScroll dentro de um contexto que vê 'header'.
    
    // Para simplificar, vou assumir que 'header' será global. Se não for, teremos de mover a sua declaração.
    const header = document.getElementById("header"); // Buscar aqui ou tornar global
    if (!header) return;
        
    // Add shadow and transform effect to header when scrolled
    const scrolled = window.scrollY > 10;
        
    if (scrolled && !header.classList.contains("scrolled")) {
        header.classList.add("scrolled");
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
    // Add transition class to trigger smooth animation for all elements
    // Esta transição é adicionada aqui para animar a MUDANÇA de tema, não o carregamento inicial.
    document.documentElement.classList.add('theme-transition'); 
        
    // Toggle dark mode class
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
        
    // Update button icon and aria-label for accessibility
    const themeToggle = document.getElementById("theme-toggle"); // Busca o botão aqui
    if (themeToggle) {
        themeToggle.textContent = isDarkMode ? '🌞' : '🌙';
        themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
    
    // <<< MUDANÇA AQUI >>> Se tiver um mobileThemeToggle separado, atualize-o também
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle'); // Assumindo uma classe para o toggle no menu mobile
    if (mobileThemeToggle && mobileThemeToggle !== themeToggle) { // Evita atualizar duas vezes o mesmo botão
        mobileThemeToggle.textContent = isDarkMode ? '🌞' : '🌙';
        mobileThemeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
        
    // Save preference to localStorage
    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString()); // Usa a chave global DARK_MODE_KEY
        
    // Add animation to theme toggle
    if (themeToggle) { // Certifica-se que o botão existe
        themeToggle.classList.add('theme-toggle-animation');
    }
        
    // Flash effect on body background
    const flashElement = document.createElement('div');
    flashElement.className = 'theme-flash';
    document.body.appendChild(flashElement);
        
    // Clean up animations after transition completes
    setTimeout(() => {
        if (themeToggle) { // Certifica-se que o botão existe
            themeToggle.classList.remove('theme-toggle-animation');
        }
        document.documentElement.classList.remove('theme-transition'); // Remove a transição
        if (flashElement.parentNode) {
            flashElement.parentNode.removeChild(flashElement);
        }
    }, THEME_TRANSITION_DURATION);
}

// Resto das funções que estavam fora do DOMContentLoaded ou que você mova para fora.
// (debounce, isElementInViewport, setupTypewriterEffect, etc.)
// Mantenha estas como estão.

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
    // <<< MUDANÇA AQUI >>>
    // 5. Remova as declarações de DARK_MODE_KEY e initializeTheme() daqui, pois já estão globais.
    // const DARK_MODE_KEY = 'darkMode'; // REMOVA ESTA LINHA
    // const THEME_TRANSITION_DURATION = 500; // ms // REMOVA ESTA LINHA (ou deixe se for usada apenas aqui para outras animações, mas não para o dark mode)
        
    // Elements (Mantenha estas declarações aqui, elas são usadas por funções dentro do DOMContentLoaded)
    const header = document.getElementById("header");
    const themeToggle = document.getElementById("theme-toggle");
    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');
    const typewriterElement = document.getElementById('typewriter');

    console.log("Typewriter element found:", typewriterElement);
        
    // Initialize theme based on user preference
    // initializeTheme(); // <<< REMOVA ESTA LINHA, pois já foi chamada globalmente >>>
        
    // Debounce function for performance optimization
    // Mantenha a função debounce aqui, ou mova para global se for usada noutros contextos.
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

    // <<< MUDANÇA AQUI >>>
    // 6. Adicione aqui a lógica para atualizar o texto/ícone do themeToggle após o DOM estar pronto
    // Isso garante que o ícone do botão reflita o tema inicial definido por initializeTheme()
    // assim que o elemento 'themeToggle' estiver disponível no DOM.
    if (themeToggle) {
        const isDarkMode = document.body.classList.contains('dark');
        themeToggle.textContent = isDarkMode ? '🌞' : '🌙';
        themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
    // E faça o mesmo para o mobileThemeToggle, se tiver um botão separado no menu mobile.
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
    if (mobileThemeToggle) {
        const isDarkMode = document.body.classList.contains('dark');
        mobileThemeToggle.textContent = isDarkMode ? '🌞' : '🌙';
        mobileThemeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        mobileThemeToggle.addEventListener('click', toggleDarkMode); // Garanta que o mobile toggle chama a mesma função
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
        
    // <<< MUDANÇA AQUI >>> A função initializeTheme() e toggleDarkMode() foram movidas para fora do DOMContentLoaded.
    // As funções que estavam aqui (initializeTheme, handleScroll, toggleDarkMode, setupProjectFilters, etc.)
    // Devem ser removidas daqui ou estar no escopo global (como fiz acima para handleScroll e toggleDarkMode).

    // Mobile menu toggle (este bloco inteiro estava separado, vamos integrá-lo)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
        
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
        });
            
        // Close menu when clicking on a link
        mobileNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                mobileNav.classList.remove('active');
            }
        });
    }

    // Se tiver um botão de fechar para o menu mobile ou lógica mais complexa,
    // adicione aqui ou como função global se precisar ser chamada de fora.
    // Exemplo:
    // const mobileCloseBtn = document.getElementById('mobile-close-btn');
    // if (mobileCloseBtn) {
    //     mobileCloseBtn.addEventListener('click', () => mobileNav.classList.remove('active'));
    // }
});
// <<< MUDANÇA AQUI >>> O bloco de código para Mobile menu toggle que estava separado
// foi movido para dentro do DOMContentLoaded principal, para consolidar tudo.
// document.addEventListener('DOMContentLoaded', function() { ... }); // REMOVA ESTE BLOCO EXTRA
