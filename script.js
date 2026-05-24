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

    // Scroll-linked 3D tilt effect for project cards
    function updateProjectScrollEffects() {
        const cards = document.querySelectorAll('.projects-grid .project-card');
        const viewportCenter = window.innerHeight / 2;
        
        cards.forEach(card => {
            if (!card.classList.contains('reveal')) return;
            
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const distanceFromCenter = cardCenter - viewportCenter;
            
            // Normalize distance (range roughly -1 to 1 within the screen)
            const maxDist = window.innerHeight / 2 + rect.height;
            const ratio = Math.max(Math.min(distanceFromCenter / maxDist, 1), -1);
            
            // Calculate 3D wheel-like cylinder rotation and translation
            const rotateX = ratio * -12; // Rotate forward/backward up to 12 degrees
            const translateY = ratio * 15; // Vertical offset
            const scale = 1 - Math.abs(ratio) * 0.05; // Slightly scale down at viewport edges
            
            card.style.setProperty('--scroll-tilt-x', `${rotateX}deg`);
            card.style.setProperty('--scroll-translate-y', `${translateY}px`);
            card.style.setProperty('--scroll-scale', `${scale}`);
        });
    }

    window.addEventListener('scroll', updateProjectScrollEffects);
    window.addEventListener('resize', updateProjectScrollEffects);
    
    // Initial run with a slight delay to allow rendering and class additions
    setTimeout(updateProjectScrollEffects, 100);

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

    // Scroll reveal animation for certificate, achievement and project cards
    const animatedCards = document.querySelectorAll('.certificates-grid .certificate-card, .achievements-grid .achievement-card, .projects-grid .project-card, .timeline-item, .skill-card');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    if (entry.target.classList.contains('project-card')) {
                        // Immediately compute scroll variables for this card
                        const rect = entry.target.getBoundingClientRect();
                        const cardCenter = rect.top + rect.height / 2;
                        const viewportCenter = window.innerHeight / 2;
                        const distanceFromCenter = cardCenter - viewportCenter;
                        const maxDist = window.innerHeight / 2 + rect.height;
                        const ratio = Math.max(Math.min(distanceFromCenter / maxDist, 1), -1);
                        
                        entry.target.style.setProperty('--scroll-tilt-x', `${ratio * -12}deg`);
                        entry.target.style.setProperty('--scroll-translate-y', `${ratio * 15}px`);
                        entry.target.style.setProperty('--scroll-scale', `${1 - Math.abs(ratio) * 0.05}`);
                    }
                } else {
                    entry.target.classList.remove('reveal');
                }
            });
        }, {
            threshold: 0.1
        });

        animatedCards.forEach(card => {
            revealObserver.observe(card);
        });
    } else {
        animatedCards.forEach(card => card.classList.add('reveal'));
    }

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

// ============================================================
//  INLINE 3D FAN CAROUSEL (Smooth Coverflow with DOM Persistence)
// ============================================================
let inline3DCards = [];
let inline3DIndex = 0;
let inline3DCardElements = [];
let inline3DAutoPlayInterval;

function startInline3DAutoPlay() {
    stopInline3DAutoPlay();
    inline3DAutoPlayInterval = setInterval(() => {
        moveInline3DCarousel(1, true);
    }, 6000);
}

function stopInline3DAutoPlay() {
    if (inline3DAutoPlayInterval) {
        clearInterval(inline3DAutoPlayInterval);
    }
}

function resetInline3DAutoPlay() {
    startInline3DAutoPlay();
}

function initInline3DCarousel() {
    const dataContainer = document.getElementById('inline-cert-data');
    const stage = document.getElementById('inline-3d-stage');
    if (!dataContainer || !stage) return;
    
    // Read data
    const nodes = dataContainer.querySelectorAll('.certificate-data');
    inline3DCards = Array.from(nodes).map(node => ({
        img: node.getAttribute('data-img') || '',
        title: node.getAttribute('data-title') || '',
        issuer: node.getAttribute('data-issuer') || '',
        date: node.getAttribute('data-date') || '',
        url: node.getAttribute('data-url') || '#',
        cred: node.getAttribute('data-cred') || ''
    }));

    if (inline3DCards.length === 0) return;

    // Clear stage and build all cards once to allow CSS transitions
    stage.innerHTML = '';
    inline3DCardElements = [];

    inline3DCards.forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'inline-3d-card pos-hidden';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'cert-img-container';

        const img = document.createElement('img');
        img.src = data.img;
        img.alt = data.title;
        img.className = 'cert-card-img';
        imgContainer.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'cert-verify-overlay';
        overlay.innerHTML = `<i class="fas fa-external-link-alt"></i><p>Click to Verify</p>`;
        imgContainer.appendChild(overlay);

        card.appendChild(imgContainer);

        card.addEventListener('click', () => {
            if (card.classList.contains('pos-center')) {
                window.open(data.url, '_blank');
            } else {
                inline3DIndex = index;
                renderInline3DCarousel();
                updateInline3DDots();
                resetInline3DAutoPlay();
            }
        });

        stage.appendChild(card);
        inline3DCardElements.push(card);
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    stage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = Math.abs(currentX - touchStartX);
        const diffY = Math.abs(currentY - touchStartY);

        // If swiping mostly horizontally, prevent vertical scroll to make swipe feel smooth
        if (diffX > diffY && diffX > 10) {
            if (e.cancelable) e.preventDefault();
        }
    }, { passive: false });

    stage.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        const swipeThreshold = 50;
        
        // Execute carousel slide if swipe is horizontal and exceeds threshold
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0) {
                moveInline3DCarousel(1); // Swipe Left -> Next
            } else {
                moveInline3DCarousel(-1); // Swipe Right -> Prev
            }
        }
    }, { passive: true });

    inline3DIndex = 0;
    renderInline3DCarousel();
    buildInline3DDots();
}

function moveInline3DCarousel(dir, isAutomatic = false) {
    const n = inline3DCards.length;
    if (n === 0) return;
    inline3DIndex = (inline3DIndex + dir + n) % n;
    renderInline3DCarousel();
    updateInline3DDots();
    if (!isAutomatic) {
        resetInline3DAutoPlay();
    }
}

function renderInline3DCarousel() {
    const n = inline3DCards.length;
    if (n === 0 || inline3DCardElements.length === 0) return;

    inline3DCardElements.forEach((card, i) => {
        let diff = i - inline3DIndex;
        
        // Handle wrap-around for circular behavior
        if (diff > n / 2) {
            diff -= n;
        } else if (diff < -n / 2) {
            diff += n;
        }

        // Remove all position classes
        card.classList.remove('pos-center', 'pos-left-1', 'pos-right-1', 'pos-left-2', 'pos-right-2', 'pos-hidden');

        // Assign position class based on relative offset
        if (diff === 0) {
            card.classList.add('pos-center');
        } else if (diff === -1) {
            card.classList.add('pos-left-1');
        } else if (diff === 1) {
            card.classList.add('pos-right-1');
        } else if (diff === -2) {
            card.classList.add('pos-left-2');
        } else if (diff === 2) {
            card.classList.add('pos-right-2');
        } else {
            card.classList.add('pos-hidden');
        }
    });

    // Update active details below the carousel
    const activeData = inline3DCards[inline3DIndex];
    if (activeData) {
        const titleEl = document.getElementById('inline-3d-title');
        const issuerEl = document.getElementById('inline-3d-issuer');
        const dateEl = document.getElementById('inline-3d-date');
        const credEl = document.getElementById('inline-3d-credential');
        
        if (titleEl) titleEl.textContent = activeData.title;
        if (issuerEl) issuerEl.textContent = activeData.issuer;
        if (dateEl) dateEl.textContent = activeData.date;
        if (credEl) {
            if (activeData.cred) {
                credEl.textContent = activeData.cred;
                credEl.style.display = 'inline-block';
            } else {
                credEl.textContent = '';
                credEl.style.display = 'none';
            }
        }
    }
}

function buildInline3DDots() {
    const dotsEl = document.getElementById('inline-3d-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    inline3DCards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'inline-3d-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            inline3DIndex = i;
            renderInline3DCarousel();
            updateInline3DDots();
            resetInline3DAutoPlay();
        });
        dotsEl.appendChild(dot);
    });
}

function updateInline3DDots() {
    const dots = document.querySelectorAll('.inline-3d-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === inline3DIndex));
}

// ============================================================
//  PROJECTS 3D FAN CAROUSEL (Smooth Coverflow with DOM Persistence)
// ============================================================
let projects3DCards = [];
let projects3DIndex = 0;
let projects3DCardElements = [];
let projects3DAutoPlayInterval;

function startProjects3DAutoPlay() {
    stopProjects3DAutoPlay();
    projects3DAutoPlayInterval = setInterval(() => {
        moveProjects3DCarousel(1, true);
    }, 6000);
}

function stopProjects3DAutoPlay() {
    if (projects3DAutoPlayInterval) {
        clearInterval(projects3DAutoPlayInterval);
    }
}

function resetProjects3DAutoPlay() {
    startProjects3DAutoPlay();
}

function initProjects3DCarousel() {
    const dataContainer = document.getElementById('projects-3d-data');
    const stage = document.getElementById('projects-3d-stage');
    if (!dataContainer || !stage) return;
    
    // Read data
    const nodes = dataContainer.querySelectorAll('.project-data');
    projects3DCards = Array.from(nodes).map(node => ({
        img: node.getAttribute('data-img') || '',
        title: node.getAttribute('data-title') || '',
        desc: node.getAttribute('data-desc') || '',
        tech: node.getAttribute('data-tech') || '',
        demo: node.getAttribute('data-demo') || '',
        demoText: node.getAttribute('data-demo-text') || 'View Overview',
        source: node.getAttribute('data-source') || '#'
    }));

    if (projects3DCards.length === 0) return;

    // Clear stage and build all cards once to allow CSS transitions
    stage.innerHTML = '';
    projects3DCardElements = [];

    projects3DCards.forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'projects-3d-card pos-hidden';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'proj-img-container';

        const img = document.createElement('img');
        img.src = data.img;
        img.alt = data.title;
        img.className = 'proj-card-img';
        imgContainer.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'proj-view-overlay';
        overlay.innerHTML = `<i class="fa-solid fa-code"></i><p>View Project Details</p>`;
        imgContainer.appendChild(overlay);

        card.appendChild(imgContainer);

        const caption = document.createElement('div');
        caption.className = 'proj-card-caption';
        caption.textContent = data.title;
        card.appendChild(caption);

        card.addEventListener('click', () => {
            if (card.classList.contains('pos-center')) {
                window.open(data.source, '_blank');
            } else {
                projects3DIndex = index;
                renderProjects3DCarousel();
                updateProjects3DDots();
                resetProjects3DAutoPlay();
            }
        });

        stage.appendChild(card);
        projects3DCardElements.push(card);
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    stage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = Math.abs(currentX - touchStartX);
        const diffY = Math.abs(currentY - touchStartY);

        // If swiping mostly horizontally, prevent vertical scroll to make swipe feel smooth
        if (diffX > diffY && diffX > 10) {
            if (e.cancelable) e.preventDefault();
        }
    }, { passive: false });

    stage.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        const swipeThreshold = 50;
        
        // Execute carousel slide if swipe is horizontal and exceeds threshold
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0) {
                moveProjects3DCarousel(1); // Swipe Left -> Next
            } else {
                moveProjects3DCarousel(-1); // Swipe Right -> Prev
            }
        }
    }, { passive: true });

    projects3DIndex = 0;
    renderProjects3DCarousel();
    buildProjects3DDots();
}

function moveProjects3DCarousel(dir, isAutomatic = false) {
    const n = projects3DCards.length;
    if (n === 0) return;
    projects3DIndex = (projects3DIndex + dir + n) % n;
    renderProjects3DCarousel();
    updateProjects3DDots();
    if (!isAutomatic) {
        resetProjects3DAutoPlay();
    }
}

function renderProjects3DCarousel() {
    const n = projects3DCards.length;
    if (n === 0 || projects3DCardElements.length === 0) return;

    projects3DCardElements.forEach((card, i) => {
        let diff = i - projects3DIndex;
        
        // Handle wrap-around for circular behavior
        if (diff > n / 2) {
            diff -= n;
        } else if (diff < -n / 2) {
            diff += n;
        }

        // Remove all position classes
        card.classList.remove('pos-center', 'pos-left-1', 'pos-right-1', 'pos-left-2', 'pos-right-2', 'pos-hidden');

        // Assign position class based on relative offset
        if (diff === 0) {
            card.classList.add('pos-center');
        } else if (diff === -1) {
            card.classList.add('pos-left-1');
        } else if (diff === 1) {
            card.classList.add('pos-right-1');
        } else if (diff === -2) {
            card.classList.add('pos-left-2');
        } else if (diff === 2) {
            card.classList.add('pos-right-2');
        } else {
            card.classList.add('pos-hidden');
        }
    });

    // Update active details below the carousel
    const activeData = projects3DCards[projects3DIndex];
    if (activeData) {
        const descEl = document.getElementById('projects-3d-desc');
        const techEl = document.getElementById('projects-3d-tech');
        const linksEl = document.getElementById('projects-3d-links');
        
        if (descEl) descEl.textContent = activeData.desc;
        
        // Render tech tags
        if (techEl) {
            techEl.innerHTML = '';
            if (activeData.tech) {
                activeData.tech.split(',').forEach(tag => {
                    const span = document.createElement('span');
                    span.textContent = tag.trim();
                    techEl.appendChild(span);
                });
            }
        }

        // Render project links
        if (linksEl) {
            linksEl.innerHTML = '';
            
            if (activeData.demo) {
                const demoLink = document.createElement('a');
                demoLink.href = activeData.demo;
                demoLink.target = '_blank';
                demoLink.className = 'btn btn-sm';
                demoLink.textContent = activeData.demoText;
                linksEl.appendChild(demoLink);
            }

            if (activeData.source) {
                const sourceLink = document.createElement('a');
                sourceLink.href = activeData.source;
                sourceLink.target = '_blank';
                sourceLink.className = 'btn btn-sm btn-outline';
                sourceLink.textContent = 'Source Code';
                linksEl.appendChild(sourceLink);
            }
        }
    }
}

function buildProjects3DDots() {
    const dotsEl = document.getElementById('projects-3d-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    projects3DCards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'projects-3d-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            projects3DIndex = i;
            renderProjects3DCarousel();
            updateProjects3DDots();
            resetProjects3DAutoPlay();
        });
        dotsEl.appendChild(dot);
    });
}

function updateProjects3DDots() {
    const dots = document.querySelectorAll('.projects-3d-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === projects3DIndex));
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initInline3DCarousel();
    initProjects3DCarousel();
});

