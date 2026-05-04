// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ===== Theme Toggle (Light / Dark Mode) =====
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const isLight = this.checked;
            document.body.classList.toggle('light-mode', isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }
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

    // Bottom Navigation Bar – active section tracking
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('section[id]');

    // Click handler for bottom nav items
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                window.scrollTo({
                    top: targetEl.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            // Set active immediately
            bottomNavItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll spy: highlight the nav item for the section currently in view
    function updateActiveNav() {
        let currentSection = '';
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            bottomNavItems.forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-section') === currentSection);
            });
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run once on load
});

// Simplified function to create animated particles in the background
function createSimplifiedParticles() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    hero.appendChild(particlesContainer);

    // Reduced number of particles for a cleaner look
    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Random size - slightly larger
        const size = Math.random() * 4 + 1.5;

        // Random animation duration - slightly faster
        const duration = Math.random() * 10 + 10;

        // Higher opacity for more visibility
        const opacity = Math.random() * 0.5 + 0.2;

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

// Certificates Lightbox functionality
function openCertLightbox(category, title) {
    const lightbox = document.getElementById('cert-lightbox');
    const titleElement = document.getElementById('lightbox-category-title');
    const gridElement = document.getElementById('lightbox-certificates-grid');
    const hiddenCerts = document.getElementById('hidden-certificates');
    
    if(!lightbox || !titleElement || !gridElement || !hiddenCerts) return;

    // Set title
    titleElement.textContent = title;
    
    // Clear previous certificates
    gridElement.innerHTML = '';
    
    // Find matching certificates and clone them
    const matchingCerts = hiddenCerts.querySelectorAll(`.certificate-card[data-category="${category}"]`);
    
    matchingCerts.forEach(cert => {
        gridElement.appendChild(cert.cloneNode(true));
    });
    
    // Show lightbox
    lightbox.style.display = 'block';
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeCertLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    if(lightbox) {
        lightbox.style.display = 'none';
    }
    
    // Restore background scrolling
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the content
window.addEventListener('click', function(event) {
    const lightbox = document.getElementById('cert-lightbox');
    if (event.target === lightbox) {
        closeCertLightbox();
    }
});

// Horizontal Scrolling for Roadmap
document.addEventListener('DOMContentLoaded', function () {
    const roadmapWrapper = document.querySelector('.roadmap-wrapper');
    if (roadmapWrapper) {
        roadmapWrapper.addEventListener('wheel', function (evt) {
            // Only capture if scrolling vertically
            if (evt.deltaY !== 0) {
                const maxScrollLeft = roadmapWrapper.scrollWidth - roadmapWrapper.clientWidth;
                
                // Scrolling Down (Move Right)
                if (evt.deltaY > 0 && roadmapWrapper.scrollLeft < maxScrollLeft - 2) {
                    evt.preventDefault();
                    roadmapWrapper.scrollLeft += (evt.deltaY * 0.5);
                }
                // Scrolling Up (Move Left)
                else if (evt.deltaY < 0 && roadmapWrapper.scrollLeft > 2) {
                    evt.preventDefault();
                    roadmapWrapper.scrollLeft += (evt.deltaY * 0.5);
                }
            }
        }, { passive: false }); // Needs to be passive false to preventDefault
        
        // Journey Navigation Buttons
        const startBtn = document.getElementById('journey-start');
        const currentBtn = document.getElementById('journey-current');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                roadmapWrapper.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        if (currentBtn) {
            currentBtn.addEventListener('click', () => {
                const maxScrollLeft = roadmapWrapper.scrollWidth - roadmapWrapper.clientWidth;
                roadmapWrapper.scrollTo({
                    left: maxScrollLeft,
                    behavior: 'smooth'
                });
            });
        }
    }
});
