// script.js (ou typewriter-and-darkmode.js) - Este é o ÚNICO ficheiro JS que você deve ter ativo.

// --- VARIÁVEIS GLOBAIS ---
const DARK_MODE_KEY = 'darkMode'; // Chave consistente para o localStorage
const THEME_TRANSITION_DURATION = 500; // ms

// Declare as referências aos elementos DOM que serão usadas por várias funções.
// Elas serão inicializadas dentro do DOMContentLoaded.
let header;
let themeToggle;        // Botão de toggle do tema (geralmente no desktop nav)
let mobileMenuBtn;      // Botão de abrir o menu hambúrguer
let mobileNav;          // O elemento do menu móvel (a nav lateral)
let mobileCloseBtn;     // Botão de fechar o menu móvel
let mobileNavLinks;     // Links dentro do menu móvel
let mobileThemeToggle;  // Botão de toggle do tema (dentro do menu móvel)
let mobileOverlay;      // A camada de sobreposição do menu móvel
let typewriterElement;  // Para o efeito typewriter

// --- FUNÇÕES GLOBAIS ---

/**
 * Atualiza o texto e o atributo aria-label de um botão de tema.
 */
function updateThemeToggleButton(button, isDarkMode) {
    if (button) {
        button.textContent = isDarkMode ? '🌞' : '🌙';
        button.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
}

/**
 * Initialize theme based on user preference or system preference
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem(DARK_MODE_KEY); // Usa a chave consistente
    let shouldBeDarkMode = false;

    if (savedTheme !== null) { 
        shouldBeDarkMode = (savedTheme === 'true');
    } else { 
        shouldBeDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem(DARK_MODE_KEY, shouldBeDarkMode.toString());
    }

    if (shouldBeDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
        
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem(DARK_MODE_KEY) === null) { 
                const isSystemDarkMode = e.matches;
                document.body.classList.toggle('dark', isSystemDarkMode);
                updateThemeToggleButton(themeToggle, isSystemDarkMode);
                updateThemeToggleButton(mobileThemeToggle, isSystemDarkMode);
            }
        });
    }
}

// Chame initializeTheme() imediatamente após a sua definição.
initializeTheme();

/**
 * Handle scroll events for sticky header with improved animation
 */
function handleScroll() {
    // --- INÍCIO DA CORREÇÃO 1: Sticky Navigation no Menu Mobile ---
    if (mobileOverlay && mobileOverlay.classList.contains('active')) {
        // Se o menu mobile estiver aberto, remove a classe 'scrolled' do header
        // e sai da função para que o sticky não seja aplicado
        if (header && header.classList.contains("scrolled")) {
            header.classList.remove("scrolled");
        }
        return; // Sai da função para não aplicar o sticky effect
    }
    // --- FIM DA CORREÇÃO 1 ---

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
    document.documentElement.classList.add('theme-transition'); 
        
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    
    // Safari-specific fix for theme toggle
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        // Force reflow for Safari
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // Additional Safari fix - force repaint
        document.documentElement.style.transform = 'translateZ(0)';
        setTimeout(() => {
            document.documentElement.style.transform = '';
        }, 0);
    }
        
    updateThemeToggleButton(themeToggle, isDarkMode);
    updateThemeToggleButton(mobileThemeToggle, isDarkMode);
        
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
    // Inicialize as variáveis globais aqui, onde os elementos DOM já existem.
    header = document.querySelector(".header"); // Seleciona o header pela classe 'header'
    
    themeToggle = document.getElementById("theme-toggle"); 
    
    // Elementos do menu móvel:
    mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    mobileOverlay = document.querySelector('.mobile-menu-overlay'); 
    mobileCloseBtn = document.querySelector('.mobile-menu-close');
    mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileThemeToggle = document.querySelector('.mobile-theme-toggle'); 
    
    typewriterElement = document.getElementById('typewriter');

    const projectFilters = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contact-form');

    // Elementos da página de serviços para a funcionalidade de filtro
    const filterBtnsServices = document.querySelectorAll('.filter-btn'); 
    const categoriesServices = document.querySelectorAll('.extras-category');
    const gridServices = document.querySelector('.extras-grid');

    // Elementos da página de serviços para navegação sticky e smooth scrolling
    const servicesNavLinks = document.querySelector('.services-nav-links');
    const packagesSection = document.getElementById('packages');

    console.log("Typewriter element found:", typewriterElement);
        
    const debouncedHandleScroll = debounce(handleScroll, 10);
    window.addEventListener("scroll", debouncedHandleScroll);
    setTimeout(handleScroll, 100);
        
    // Configuração do botão de toggle do tema principal (desktop)
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleDarkMode);
        updateThemeToggleButton(themeToggle, document.body.classList.contains('dark'));

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Toggle Dark Mode';
        themeToggle.appendChild(tooltip);
        themeToggle.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        themeToggle.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        });
    }

    // Configuração do menu móvel (agora integrada aqui)
    if (mobileMenuBtn && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    function closeMobileMenu() {
        if (mobileMenuBtn && mobileOverlay) {
            mobileMenuBtn.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (mobileCloseBtn) { 
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileNavLinks) { 
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    if (mobileOverlay) { 
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) { 
                closeMobileMenu();
            }
        });
    }
    
    // Fechar menu na tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileOverlay && mobileOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Configuração do botão de toggle do tema no menu móvel
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleDarkMode); 
        updateThemeToggleButton(mobileThemeToggle, document.body.classList.contains('dark')); 
    }

    // --- Funcionalidade de Filtro de Serviços (do seu código enviado) ---
    if (filterBtnsServices.length > 0 && categoriesServices.length > 0 && gridServices) {
        filterBtnsServices.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtnsServices.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-category');

                if (filterValue === 'all') {
                    gridServices.classList.remove('filtered');
                    categoriesServices.forEach(category => {
                        category.classList.remove('filter-hidden');
                    });
                } else {
                    gridServices.classList.add('filtered');
                    categoriesServices.forEach(category => {
                        if (category.getAttribute('data-category') === filterValue) {
                            category.classList.remove('filter-hidden');
                        } else {
                            category.classList.add('filter-hidden');
                        }
                    });
                }
            });
        });
    }

    // --- Smooth Scrolling para Links de Navegação (do seu código enviado) ---
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; 
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Show/Hide Navigation based on scroll position (do seu código enviado) ---
    // Note: Este é específico para a navegação de serviços.
    window.addEventListener('scroll', function() {
        if (servicesNavLinks && packagesSection) {
            const packagesPosition = packagesSection.offsetTop - 50; 
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= packagesPosition) {
                servicesNavLinks.classList.add('visible');
            } else {
                servicesNavLinks.classList.remove('visible');
            }
        }
    });

    // --- Smooth scrolling for services navigation links (do seu código enviado) ---
    document.querySelectorAll('.services-nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; 
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FORCE COMPACT MONTHLY PLAN VIA JAVASCRIPT (do seu código enviado) ---
    setTimeout(function() {
        const container = document.querySelector('.monthly-plan-container');
        const card = document.querySelector('.monthly-plan-card');
        const title = document.querySelector('.monthly-plan-title');
        const subtitle = document.querySelector('.monthly-plan-subtitle');
        const price = document.querySelector('.monthly-plan-price');
        const badge = document.querySelector('.monthly-plan-badge');
        const content = document.querySelector('.monthly-plan-content');
        const includes = document.querySelectorAll('.plan-includes, .plan-excludes');
        const section = document.querySelector('.monthly-plan-section, #monthly-plan'); 

        if (container) {
            container.style.cssText = 'max-width: 400px !important; margin: 0 auto !important; padding: 0 15px !important;';
        }
        if (card) {
            card.style.cssText = 'background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.1)) !important; border: 1px solid var(--primary-color) !important; border-radius: 15px !important; padding: 20px !important; text-align: center !important; box-shadow: 0 5px 15px rgba(99, 102, 241, 0.1) !important; position: relative !important; overflow: visible !important; max-width: 100% !important; width: 100% !important;';
        }
        if (title) {
            title.style.cssText = 'font-size: 1.6rem !important; font-weight: 800 !important; color: var(--text-dark) !important; margin-bottom: 15px !important; line-height: 1.2 !important;';
        }
        if (subtitle) {
            subtitle.style.cssText = 'font-size: 0.95rem !important; color: var(--text-muted) !important; margin-bottom: 20px !important; line-height: 1.4 !important; margin-left: auto !important; margin-right: auto !important; max-width: 320px !important;';
        }
        if (price) {
            price.style.cssText = 'font-size: 2.2rem !important; font-weight: 900 !important; color: var(--primary-color) !important; margin-bottom: 20px !important;';
        }
        if (badge) {
            badge.style.cssText = 'display: inline-block !important; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)) !important; color: white !important; padding: 5px 12px !important; border-radius: 15px !important; font-size: 0.7rem !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; margin-bottom: 12px !important;';
        }
        if (content) {
            content.style.cssText = 'display: flex !important; flex-direction: column !important; gap: 12px !important; margin-bottom: 20px !important; text-align: left !important;';
        }
        includes.forEach(function(element) {
            if (element) {
                element.style.cssText = 'background: white !important; border-radius: 10px !important; padding: 12px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; border: 1px solid var(--border-color) !important;';
                element.classList.add('content-creation-card');
            }
        });
        if (section) {
            section.style.cssText = 'padding: 30px 0 !important;';
        }
    }, 100);


    // --- Outras Funções que já estavam no seu JS principal ---
    if (projectFilters.length > 0 && projectItems.length > 0) {
        setupProjectFilters(); 
    }
        
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        setupFormValidation();
    }
        
    setupSmoothScrolling(); 
        
    setupScrollAnimations();
        
    if (typewriterElement) {
        console.log("Setting up typewriter effect");
        setupTypewriterEffect();
    } else {
        console.error("Typewriter element not found!");
    }

    // --- Funções Auxiliares (mantidas dentro de DOMContentLoaded) ---
    // (Estas são as versões de `setupProjectFilters`, `setupFormValidation`, `validateInput`, `handleContactForm`,
    // `setupSmoothScrolling`, `setupScrollAnimations`, `setupTypewriterEffect` que já estavam no nosso script principal)

    function setupProjectFilters() {
        projectFilters.forEach(button => {
            button.addEventListener('click', () => {
                projectFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-category'); 
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
        
    function setupScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.project-card, .skill-category, .section-heading');
        elementsToAnimate.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
        handleScroll();
    }
    
   function setupTypewriterEffect() {
    const phrases = ['Marketeer', 'Front-End Developer'];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        if (!typewriterElement) return;

        const currentPhrase = phrases[index % phrases.length];
        const displayedText = currentPhrase.slice(0, charIndex);
        typewriterElement.innerHTML = displayedText;

        const speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex < currentPhrase.length) {
            charIndex++;
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) index++;
            setTimeout(type, 1200);
            return;
        }

        // Safari fix – força reflow
        void typewriterElement.offsetWidth;

        setTimeout(type, speed);
    };

    type();
}

    // Initial delay for Safari compatibility
    setTimeout(() => {
        typeNextCharacter();
    }, isSafari ? 300 : 100);
}
});
