// Add JavaScript for interactivity if needed
// Examples:
// - Smooth scrolling for navigation links
// - Mobile navigation toggle
// - Form validation or submission
// - Animations on scroll

// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const celestialToggle = document.querySelector('.celestial-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.setAttribute('data-theme', savedTheme === 'dark-theme' ? 'dark' : 'light');

    // Set initial rotation CSS variable
    celestialToggle.style.setProperty('--rotation', savedTheme === 'dark-theme' ? '180deg' : '0deg');

    // Toggle theme on click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Toggle theme
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme === 'dark' ? 'dark-theme' : 'light-theme');
            
            // Update rotation CSS variable
            celestialToggle.style.setProperty('--rotation', newTheme === 'dark' ? '180deg' : '0deg');
        });
    }
});

// --- i18next Initialization and Language Switching --- 
window.addEventListener('load', () => {
    const languageSelect = document.getElementById('language-select');

    // --- i18next initialization ---
    if (typeof i18next === 'undefined') {
        console.error('i18next library not loaded!');
        return;
    }

    i18next
        .use(i18nextHttpBackend)
        .init({
            debug: true, // Set to false in production
            fallbackLng: 'en', // Default language if detection fails
            load: 'currentOnly', // This prevents loading 'zh' when 'zh-CN' is requested
            backend: {
                loadPath: '/assets/locales/{{lng}}/translation.json',
            },
            interpolation: {
                escapeValue: false
            }
        }, (err, t) => {
            if (err) {
                console.error('Error initializing i18next:', err);
                return;
            }
            
            const supportedLanguages = Array.from(languageSelect.options).map(option => option.value);
            
            // Get saved language or detect browser language
            let detectedLang = localStorage.getItem('language');

            if (!detectedLang || !supportedLanguages.includes(detectedLang)) {
                const browserLang = navigator.language; // e.g., 'zh-CN', 'en-US'
                const baseLang = browserLang.split('-')[0]; // e.g., 'zh', 'en'

                // Special handling for Chinese variants
                if (baseLang === 'zh') {
                    // Check if browser specifies Traditional Chinese
                    if (browserLang.includes('TW') || browserLang.includes('HK')) {
                        detectedLang = 'zh-TW';
                    } else {
                        // Default to Simplified Chinese for all other Chinese variants
                        detectedLang = 'zh-CN';
                    }
                } else if (supportedLanguages.includes(browserLang)) {
                    detectedLang = browserLang;
                } else if (supportedLanguages.includes(baseLang)) {
                    detectedLang = baseLang;
                } else {
                    detectedLang = 'en'; // Fallback to English
                }
            }

            // Set initial language
            setLanguage(detectedLang);
            languageSelect.value = detectedLang;
        });

    // --- Language change handler ---
    languageSelect.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        setLanguage(selectedLang);
    });

    // --- Function to set language and update content ---
    function setLanguage(lang) {
        // Special handling for Chinese variants
        let targetLang = lang;
        if (lang === 'zh') {
            // Default to Simplified Chinese if general Chinese is selected
            targetLang = 'zh-CN';
        }

        i18next.changeLanguage(targetLang, (err, t) => {
            if (err) {
                console.error('Error changing language:', err);
                return;
            }
            localStorage.setItem('language', targetLang);
            document.documentElement.lang = targetLang;
            updateContent();
            console.log(`Language changed to: ${targetLang}`);
        });
    }

    // --- Function to update all elements with data-i18n attribute ---
    function updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = i18next.t(key);
            el.innerHTML = translation;
        });
        console.log('Content updated with translations.');
    }
});

console.log("Landing page script loaded (including i18next setup)."); 