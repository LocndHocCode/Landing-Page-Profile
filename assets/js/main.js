// Theme Toggle
const deskLamp = document.querySelector('.desk-lamp');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light-theme';
body.setAttribute('data-theme', savedTheme === 'dark-theme' ? 'dark' : 'light');

// Add pull cord sound effect
const pullSound = new Audio('assets/sounds/pull-chain.mp3');

// Toggle theme on lamp pull
deskLamp.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Play pull sound
    pullSound.currentTime = 0;
    pullSound.play().catch(err => console.log('Audio not loaded yet'));
    
    // Toggle theme
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme === 'dark' ? 'dark-theme' : 'light-theme');
    
    // Add pull animation
    deskLamp.classList.add('pulled');
    setTimeout(() => {
        deskLamp.classList.remove('pulled');
    }, 300);
}); 