// Shared project page script
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    applyTheme(savedTheme);

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('portfolio-theme', theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
});
