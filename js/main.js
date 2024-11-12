document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js scene
    const threeScene = new ThreeScene();

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    console.log('Theme toggle button:', themeToggle); // Debug log

    themeToggle.addEventListener('click', () => {
        console.log('Button clicked!'); // Debug log
        
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log('Switching to theme:', newTheme); // Debug log
        
        html.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
        
        // Update Three.js scene
        threeScene.updateTheme(newTheme === 'dark');
    });
}); 