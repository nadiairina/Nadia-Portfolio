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

    // IMPORTANT: Add transition class *after* initial theme is set,
    // to prevent FOUC (Flash of Unstyled Content) with transition on page load.
    // A small delay ensures the initial render is complete before enabling transitions.
    setTimeout(() => {
        document.documentElement.classList.add('theme-transition');
    }, 50);

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only react to system preference if user hasn't explicitly set a theme
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
    // Temporarily remove transition to ensure immediate class application and redraw,
    // then re-add for the visual flash effect.
    document.documentElement.classList.remove('theme-transition');

    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');

    // Force reflow/repaint after class change
    // This is a common and generally safe cross-browser trick
    document.body.offsetHeight; // Forces repaint

    // Re-add the transition class after forcing the repaint,
    // so the subsequent 'flash' animation works.
    document.documentElement.classList.add('theme-transition');

    updateThemeToggleButton(themeToggle, isDarkMode);
    updateThemeToggleButton(mobileThemeToggle, isDarkMode);

    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());

    // Flash effect for visual feedback
    const flashElement = document.createElement('div');
    flashElement.className = 'theme-flash';
    document.body.appendChild(flashElement);

    setTimeout(() => {
        if (flashElement.parentNode) {
            flashElement.parentNode.removeChild(flashElement);
        }
        // No need to remove theme-transition here, it will remain for other transitions
        // unless you specifically want to remove it after every toggle animation
    }, THEME_TRANSITION_DURATION); // Make sure THEME_TRANSITION_DURATION matches CSS transition duration
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
            tooltip.style.transform = 'translateX(-50%) translateY(0)'; // Keep X for centering
        });
        themeToggle.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(10px)'; // Keep X for centering
        });
    }

    // Configuração do menu móvel (agora integrada aqui)
    if (mobileMenuBtn && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            // Add/remove 'no-scroll' class to body
            document.body.classList.toggle('no-scroll', mobileOverlay.classList.contains('active'));
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        });
    }

    function closeMobileMenu() {
        if (mobileMenuBtn && mobileOverlay) {
            mobileMenuBtn.classList.remove('active');
            mobileOverlay.classList.remove('active');
            // Remove 'no-scroll' class from body
            document.body.classList.remove('no-scroll');
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
    // Consider moving this CSS to your actual stylesheet for better separation of concerns
    // unless it's strictly a dynamic override.
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
            price.style.cssText = 'font-size: 2.8rem !important; font-weight: 900 !important; color: var(--primary-color) !important; margin-bottom: 20px !important;';
        }
        if (badge) {
            badge.style.cssText = 'position: absolute !important; top: -15px !important; left: 50% !important; transform: translateX(-50%) !important; background-color: var(--primary-color) !important; color: white !important; padding: 5px 15px !important; border-radius: 20px !important; font-size: 0.8rem !important; font-weight: 600 !important; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3) !important;';
        }
        if (content) {
            content.style.cssText = 'padding: 0 15px !important;';
        }
        includes.forEach(el => {
            el.style.cssText = 'list-style: none !important; padding: 0 !important; margin-bottom: 20px !important;';
            el.querySelectorAll('li').forEach(li => {
                li.style.cssText = 'font-size: 0.9rem !important; color: var(--text-dark) !important; margin-bottom: 10px !important; display: flex !important; align-items: center !important; justify-content: flex-start !important; gap: 8px !important;';
            });
            el.querySelectorAll('.icon').forEach(icon => {
                icon.style.cssText = 'color: var(--primary-color) !important; font-size: 1.2em !important; flex-shrink: 0 !important;';
            });
        });
        if (section) {
            section.style.cssText = 'padding: 5rem 0 !important; background-color: var(--bg-muted) !important;';
        }

        // Dark mode adjustments for monthly plan
        document.body.addEventListener('transitionend', function(event) {
            // Check if the transition is on a property that indicates a theme change
            if (event.propertyName === 'background-color' || event.propertyName === 'color') {
                const isDarkMode = document.body.classList.contains('dark');
                if (card) {
                    card.style.backgroundColor = isDarkMode ? 'rgba(99, 102, 241, 0.15)' : ''; // Remove inline style for light mode to let CSS take over, or set to light mode default if it's dynamic
                    card.style.borderColor = isDarkMode ? 'var(--primary-dark)' : 'var(--primary-color)';
                    card.style.boxShadow = isDarkMode ? '0 5px 15px rgba(99, 102, 241, 0.2)' : '0 5px 15px rgba(99, 102, 241, 0.1)';
                }
                if (title) {
                    title.style.color = isDarkMode ? 'var(--text-light)' : 'var(--text-dark)';
                }
                if (subtitle) {
                    subtitle.style.color = isDarkMode ? 'var(--text-muted)' : 'var(--text-muted)';
                }
                includes.forEach(el => {
                    el.querySelectorAll('li').forEach(li => {
                        li.style.color = isDarkMode ? 'var(--text-light)' : 'var(--text-dark)';
                    });
                });
                if (section) {
                    section.style.backgroundColor = isDarkMode ? 'var(--bg-dark)' : 'var(--bg-muted)';
                }
            }
        });
    }, 0); // Execute immediately on DOMContentLoaded

    // Typewriter Effect (Improved and integrated)
    function setupTypewriterEffect(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Typewriter element with ID '${elementId}' not found.`);
            return;
        }

        // Ensure the phrases are correctly parsed from a data attribute
        // Example HTML: <span id="typewriter" data-phrases='["Marketeer", "Front-End Developer"]'></span>
        const phrasesAttr = element.getAttribute('data-phrases');
        let phrases = [];
        try {
            phrases = JSON.parse(phrasesAttr);
        } catch (e) {
            console.error("Error parsing typewriter phrases:", e);
            phrases = ["Developer"]; // Fallback
        }

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100; // milliseconds per character
        const deletingSpeed = 60; // milliseconds per character
        const pauseBeforeDelete = 1500; // milliseconds
        const pauseBeforeType = 500; // milliseconds

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                element.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let currentTypingSpeed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                currentTypingSpeed = pauseBeforeDelete;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                currentTypingSpeed = pauseBeforeType;
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            setTimeout(type, currentTypingSpeed);
        }

        // Start the typewriter effect
        type();
    }

    // Call the typewriter setup function if the element exists
    if (typewriterElement) {
        // Ensure the typewriter element has the data-phrases attribute
        // Example: <span class="highlight typewriter-effect" id="typewriter" data-phrases='["Marketeer", "Front-End Developer"]'></span>
        if (!typewriterElement.hasAttribute('data-phrases')) {
            typewriterElement.setAttribute('data-phrases', '["Marketeer", "Front-End Developer"]');
        }
        setupTypewriterEffect('typewriter');
    }

    // --- Project Filtering (Desktop) ---
    // Make sure these selectors match your HTML structure
    if (projectFilters.length > 0 && projectItems.length > 0) {
        projectFilters.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' from all filter buttons
                projectFilters.forEach(btn => btn.classList.remove('active'));
                // Add 'active' to the clicked button
                button.classList.add('active');

                const filterValue = button.dataset.filter; // Get data-filter value

                projectItems.forEach(item => {
                    const itemCategory = item.dataset.category; // Get data-category from project item

                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block'; // Or 'flex', 'grid', depending on your layout
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Handle Contact Form Submission (Example placeholder)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, you would send this data to a backend or a service like Formspree
            // For now, we'll just log it and reset the form.
            console.log("Form Submitted:", {
                name: document.getElementById('name')?.value,
                email: document.getElementById('email')?.value,
                subject: document.getElementById('subject')?.value,
                message: document.getElementById('message')?.value
            });

            // Display a simple success message (replace alert)
            const successMessageDiv = document.createElement('div');
            successMessageDiv.className = 'form-success-message';
            successMessageDiv.textContent = 'Thank you for your message! I will get back to you soon.';
            contactForm.parentNode.insertBefore(successMessageDiv, contactForm.nextSibling);

            // Hide form and show message
            contactForm.style.display = 'none';
            setTimeout(() => {
                successMessageDiv.style.opacity = '1';
                successMessageDiv.style.transform = 'translateY(0)';
            }, 50); // Small delay for animation

            this.reset(); // Clear the form
        });
    }
});
