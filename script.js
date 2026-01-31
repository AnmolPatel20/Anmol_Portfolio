// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Simplified Intersection Observer for animations - REMOVED

    // Animate skills on scroll - keep this for better UX
    const skills = document.querySelectorAll('.skills-list li');

    skills.forEach((skill, index) => {
        skill.style.transitionDelay = `${0.1 * index}s`;
    });

    // Simplified project cards interaction
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Simple social media icons interaction
    const socialLinks = document.querySelectorAll('.social-links a, .contact-social-links a');

    socialLinks.forEach(link => {
        link.addEventListener('mouseover', function () {
            this.classList.add('animated');
        });

        link.addEventListener('mouseout', function () {
            this.classList.remove('animated');
        });
    });

    // Create fewer particles for background
    createSimplifiedParticles();

    // Contact form submission with Web3Forms
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        alert(json.message); // "Form submitted successfully"
                        contactForm.reset();
                    } else {
                        console.log(response);
                        alert(json.message);
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert('Something went wrong!');
                })
                .finally(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }

    // Hamburger toggle for mobile (re-added)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('primary-navigation');
    if (menuToggle && navLinks) {
        const closeMenu = () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
        };

        menuToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            menuToggle.classList.toggle('active', isOpen);
        });

        // Close on link click (single page anchors)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    closeMenu();
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            const clickedInside = navLinks.contains(e.target) || menuToggle.contains(e.target);
            if (!clickedInside && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });
    }
});

// Simplified function to create fewer animated particles in the background
function createSimplifiedParticles() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    hero.appendChild(particlesContainer);

    // Reduced number of particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Random size
        const size = Math.random() * 3 + 1;

        // Random animation duration - slower
        const duration = Math.random() * 15 + 15;

        // Lower opacity
        const opacity = Math.random() * 0.3 + 0.1;

        // Set styles
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);
    }
}

// Typing Animation
document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('typing-text');
    const cursorElement = document.querySelector('.typing-cursor');
    const textToType = "ANMOL PATEL";
    const typingDelay = 200; // Speed of typing
    const startDelay = 1000; // 1 seconds delay before starting

    if (textElement) {
        setTimeout(() => {
            let charIndex = 0;
            function type() {
                if (charIndex < textToType.length) {
                    textElement.textContent += textToType.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingDelay);
                } else {
                    // Animation finished
                    if (cursorElement) cursorElement.style.display = 'none'; // Optional: hide cursor after typing
                }
            }
            type();
        }, startDelay);
    }
}); 
