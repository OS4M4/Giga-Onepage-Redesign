// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Counter Animation for Hero Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format large numbers
            if (target >= 1000000) {
                counter.textContent = (current / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                counter.textContent = (current / 1000).toFixed(0) + 'K';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (!hero || !heroBackground) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < hero.offsetHeight) {
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 51, 102, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.borderBottom = 'none';
        }
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation when hero stats come into view
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.impact-card, .timeline-item, .partnership-category, .goal-item, .vision-card, .hero-stats');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Globe rotation control
function initGlobeInteraction() {
    const globe = document.querySelector('.globe');
    if (!globe) return;
    
    let isHovered = false;
    
    globe.addEventListener('mouseenter', () => {
        isHovered = true;
        globe.style.animationPlayState = 'paused';
    });
    
    globe.addEventListener('mouseleave', () => {
        isHovered = false;
        globe.style.animationPlayState = 'running';
    });
    
    // Add click interaction to connection points
    const points = document.querySelectorAll('.point');
    points.forEach((point, index) => {
        point.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 1s ease-out;
                pointer-events: none;
            `;
            
            point.style.position = 'relative';
            point.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 1000);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(3);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Typing effect for hero title
function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const originalText = titleElement.innerHTML;
    const lines = originalText.split('<span class="title-line');
    
    // Only apply typing effect on desktop
    if (window.innerWidth > 768) {
        titleElement.innerHTML = '';
        titleElement.style.opacity = '1';
        
        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex < lines.length) {
                const line = lineIndex === 0 ? lines[lineIndex] : '<span class="title-line' + lines[lineIndex];
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = line;
                const text = tempDiv.textContent || tempDiv.innerText;
                
                if (lineIndex === 0) {
                    typeText(text, titleElement, () => {
                        lineIndex++;
                        setTimeout(typeLine, 300);
                    });
                } else {
                    const span = document.createElement('span');
                    span.className = lines[lineIndex].includes('highlight') ? 'title-line highlight' : 'title-line';
                    titleElement.appendChild(span);
                    typeText(text, span, () => {
                        lineIndex++;
                        setTimeout(typeLine, 300);
                    });
                }
            }
        }
        
        function typeText(text, element, callback) {
            let charIndex = 0;
            const typingSpeed = 100;
            
            function type() {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingSpeed);
                } else if (callback) {
                    callback();
                }
            }
            
            type();
        }
        
        // Start typing effect after a delay
        setTimeout(typeLine, 500);
    }
}

// Mobile menu toggle
function initMobileMenu() {
    // Create mobile menu button
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navbar || !navLinks) return;
    
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    navbar.appendChild(mobileMenuBtn);
    
    // Add mobile styles
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block !important;
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                right: -100%;
                width: 100%;
                height: 100vh;
                background: var(--gradient-primary);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                transition: right 0.3s ease;
                z-index: 1000;
            }
            
            .nav-links.active {
                right: 0;
            }
            
            .nav-links a {
                font-size: 1.2rem;
                padding: 1rem;
            }
            
            .mobile-close {
                position: absolute;
                top: 2rem;
                right: 2rem;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            }
        }
    `;
    document.head.appendChild(mobileStyles);
    
    // Mobile menu functionality
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.add('active');
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        navLinks.appendChild(closeBtn);
        
        closeBtn.addEventListener('click', () => {
            navLinks.classList.remove('active');
            closeBtn.remove();
        });
    });
    
    // Close menu when clicking on links
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            const closeBtn = navLinks.querySelector('.mobile-close');
            if (closeBtn) closeBtn.remove();
        }
    });
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Error handling and fallbacks
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.warn('Non-critical error:', e.error);
        // Don't let errors break the user experience
    });
    
    // Fallback for browsers that don't support IntersectionObserver
    if (!window.IntersectionObserver) {
        // Immediately show all animated elements
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
        
        // Trigger counter animation immediately
        setTimeout(animateCounters, 1000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initParallax();
    initNavbarScroll();
    initIntersectionObserver();
    initGlobeInteraction();
    initTypingEffect();
    initMobileMenu();
    optimizePerformance();
    initErrorHandling();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add CSS for loaded state
const loadedStyles = document.createElement('style');
loadedStyles.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .animate {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(loadedStyles);

// Add resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize components that need adjustment on resize
        if (window.innerWidth > 768) {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    }, 250);
});
