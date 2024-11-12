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

    // Scroll Reveal
    ScrollReveal().reveal('.glass-card', {
        delay: 200,
        distance: '20px',
        origin: 'bottom',
        opacity: 0,
        duration: 1000,
        easing: 'cubic-bezier(0.5, 0, 0, 1)'
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll Progress
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / height) * 100;
        scrollProgress.style.setProperty('--scroll', `${scrolled}%`);
    });

    // Loading Animation
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 500);
    });

    // Add form submission handling
    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = form.querySelector('button');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Add your form submission logic here
        
        // Success animation
        button.innerHTML = '<i class="fas fa-check"></i> Sent!';
        button.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            button.innerHTML = 'Send Message';
            button.style.backgroundColor = '';
        }, 3000);
    });

    // Typing Animation
    const texts = [
        "Computer Science Student",
        "Tech Enthusiast",
        "Weeb",
        "Soccer Fan"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingElement = document.querySelector('.typing-text');

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        // Adjusted speeds for better rhythm
        let typingSpeed = isDeleting ? 50 : 100;

        // If word is complete
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Longer pause at end (2 seconds)
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start the typing animation
    typeText();
}); 