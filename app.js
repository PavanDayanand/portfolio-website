// Portfolio Website JavaScript - Enhanced Version

document.addEventListener('DOMContentLoaded', function() {
    // Centralized DOM element selection for efficiency
    const elements = {
        loadingScreen: document.getElementById('loading-screen'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        typedText: document.getElementById('typed-text'),
        scrollLinks: document.querySelectorAll('a[href^="#"]'),
        scrollIndicator: document.querySelector('.scroll-indicator'),
        navbar: document.getElementById('navbar'),
        downloadBtn: document.getElementById('download-resume'),
        contactForm: document.getElementById('contact-form'),
        sections: document.querySelectorAll('section[id]'),
        statNumbers: document.querySelectorAll('.stat-number[data-target]'),
        particlesContainer: document.getElementById('particles-container'),
        timelineItems: document.querySelectorAll('.timeline-item')
    };

    // Hide loading screen after page loads
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
    }, 1500);

    // Initialize all features by passing the centralized elements
    initThemeToggle(elements);
    initMobileNavigation(elements);
    initTypingAnimation(elements);
    initSmoothScrolling(elements);
    initScrollAnimations(elements);
    initParticles(elements);
    initContactForm(elements);
    initScrollSpy(elements);
    initNavbarScroll(elements);
    initResumeDownload(elements);
    initCounterAnimations(elements);

    // Global event listeners for a more robust user experience
    window.addEventListener('resize', debounce(optimizedResizeHandler, 250));
    document.addEventListener('keydown', handleKeyboardShortcuts);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('load', handlePageLoad);
    
    console.log('Portfolio loaded successfully!');
});

// Theme Toggle Functionality
function initThemeToggle(elements) {
    let currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    updateThemeIcon(elements.themeIcon, currentTheme);
    
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', function() {
            const newTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
            
            document.documentElement.style.transition = 'all 0.3s ease';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(elements.themeIcon, newTheme);
            
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });
    }
}

function updateThemeIcon(iconElement, theme) {
    if (iconElement) {
        iconElement.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Mobile Navigation
function initMobileNavigation(elements) {
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            elements.navToggle.classList.toggle('active');
            elements.navMenu.classList.toggle('active');
        });
        
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function() {
                elements.navToggle.classList.remove('active');
                elements.navMenu.classList.remove('active');
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!elements.navToggle.contains(e.target) && !elements.navMenu.contains(e.target)) {
                elements.navToggle.classList.remove('active');
                elements.navMenu.classList.remove('active');
            }
        });
    }
}

// Typing Animation
function initTypingAnimation(elements) {
    const roles = [
        "Data Scientist",
        "AI Developer", 
        "Frontend Developer",
        "Machine Learning Engineer",
        "Generative AI Developer"
    ];
    
    if (!elements.typedText) return;
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseTime = 2000;
    
    function typeEffect() {
        if (isWaiting) {
            isWaiting = false;
            setTimeout(typeEffect, pauseTime);
            return;
        }
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            elements.typedText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            elements.typedText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? deleteSpeed : typeSpeed;
        
        if (!isDeleting && charIndex === currentRole.length) {
            isWaiting = true;
            isDeleting = true;
            speed = pauseTime;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }
        
        setTimeout(typeEffect, speed);
    }
    
    setTimeout(typeEffect, 1000);
}

// Smooth Scrolling
function initSmoothScrolling(elements) {
    const scrollToSection = (sectionId) => {
        const targetSection = document.querySelector(sectionId);
        if (!targetSection) return;
        
        const navbarHeight = elements.navbar?.offsetHeight || 80;
        const offsetTop = targetSection.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
        });
    };
    
    elements.scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            scrollToSection(targetId);
        });
    });
    
    if (elements.scrollIndicator) {
        elements.scrollIndicator.addEventListener('click', () => scrollToSection('#about'));
    }
}

// Scroll Animations
function initScrollAnimations(elements) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = (entry.target.classList.contains('achievement-card') ||
                               entry.target.classList.contains('project-card') ||
                               entry.target.classList.contains('skill-category')) ? index * 100 : 0;
                
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.stats-grid, .timeline-item, .skill-category, .project-card, .achievement-card, .resume-card');
    animateElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    initTimelineAnimations(elements);
}

// Counter Animations for Stats
function initCounterAnimations(elements) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    elements.statNumbers.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    
    const updateCounter = () => {
        if (step < steps) {
            current += increment;
            step++;
            
            if (target === 8.44) {
                element.textContent = Math.min(current, target).toFixed(2);
            } else {
                element.textContent = Math.min(Math.floor(current), target);
            }
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target === 8.44 ? target.toFixed(2) : target;
        }
    };
    
    updateCounter();
}

// Enhanced Floating Particles
function initParticles(elements) {
    if (!elements.particlesContainer) return;
    
    const particleCount = 25;
    let particles = [];
    
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const startX = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 10 + 15;
        const size = Math.random() * 3 + 1;
        
        particle.style.left = startX + 'px';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        elements.particlesContainer.appendChild(particle);
        particles.push(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
            particles = particles.filter(p => p !== particle);
        }, (animationDuration + 5) * 1000);
    };
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 200);
    }
    
    setInterval(() => {
        if (particles.length < particleCount) {
            createParticle();
        }
    }, 1000);
}

// Resume Download Functionality
function initResumeDownload(elements) {
    if (!elements.downloadBtn) return;

    elements.downloadBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const originalText = this.innerHTML;
        const originalIcon = this.querySelector('i').className;

        this.classList.add('downloading');
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'assets/Pavan_D.pdf';
            link.download = 'Pavan D.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('Resume downloaded successfully!', 'success');

            this.classList.remove('downloading');
            this.innerHTML = originalText;
        }, 2000);
    });
}

// Contact Form Handling with EmailJS
function initContactForm(elements) {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const formData = new FormData(elements.contactForm);
        
        if (!validateContactForm(elements.contactForm)) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        emailjs.sendForm('service_8vgbxe9', 'template_wgkrs8p', this)
            .then(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                elements.contactForm.reset();
            })
            .catch(error => {
                showNotification('Failed to send message. Please try again.', 'error');
                console.error('EmailJS error:', error);
            })
            .finally(() => {
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
    
    const inputs = elements.contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    });
}

// // Fixed Navigation Spy
// function initScrollSpy(elements) {
//     if (elements.sections.length === 0 || elements.navLinks.length === 0) return;
    
//     const observerOptions = {
//         rootMargin: '-20% 0px -70% 0px',
//         threshold: 0.1
//     };
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             const sectionId = entry.target.getAttribute('id');
//             const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
//             if (entry.isIntersecting && navLink) {
//                 elements.navLinks.forEach(link => link.classList.remove('active'));
//                 navLink.classList.add('active');
//             }
//         });
//     }, observerOptions);
    
//     elements.sections.forEach(section => observer.observe(section));
    
//     window.addEventListener('scroll', throttle(() => {
//         const scrollPosition = window.scrollY + 100;
        
//         elements.sections.forEach(section => {
//             const sectionTop = section.offsetTop;
//             const sectionHeight = section.offsetHeight;
//             const sectionId = section.getAttribute('id');
//             const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
//             if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight && navLink) {
//                 elements.navLinks.forEach(link => link.classList.remove('active'));
//                 navLink.classList.add('active');
//             }
//         });
//     }, 100));
// }

// Navbar Scroll Effect
function initNavbarScroll(elements) {
    if (!elements.navbar) return;
    
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
        
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                elements.navbar.classList.add('nav-hidden');
            } else {
                elements.navbar.classList.remove('nav-hidden');
            }
        }
        
        lastScrollTop = scrollTop;
    };
    
    window.addEventListener('scroll', throttle(handleScroll, 10));
}

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const optimizedResizeHandler = (elements) => {
    if (window.innerWidth > 768) {
        if (elements.navMenu && elements.navToggle) {
            elements.navMenu.classList.remove('active');
            elements.navToggle.classList.remove('active');
        }
        if (elements.navbar) {
            elements.navbar.classList.remove('nav-hidden');
        }
    }
};

const handleKeyboardShortcuts = (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
};

const handleError = (e) => {
    console.error('An error occurred:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
};

const handleUnhandledRejection = (e) => {
    console.error('Unhandled promise rejection:', e.reason);
};

const handlePageLoad = () => {
    document.body.classList.add('loaded');
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
    heroElements.forEach((element, index) => {
        setTimeout(() => element.style.animationPlayState = 'running', index * 200);
    });
    
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
};

const initTimelineAnimations = (elements) => {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), index * 200);
            }
        });
    }, { threshold: 0.2 });
    
    elements.timelineItems.forEach(item => timelineObserver.observe(item));
};

const validateField = (field) => {
    const value = field.value.trim();
    if (field.required && !value) {
        field.classList.add('invalid');
        return false;
    }
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('invalid');
            return false;
        }
    }
    field.classList.remove('invalid');
    return true;
};

const validateContactForm = (form) => {
    let isValid = true;
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    return isValid;
};

// ... Notification and ripple effect functions as they were, they are self-contained ...
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const colorMap = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${iconMap[type]}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colorMap[type]};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 350px;
        min-width: 300px;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        flex-shrink: 0;
    `;
    
    closeBtn.addEventListener('mouseover', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.opacity = '0.8');
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    const autoRemoveTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemoveTimeout);
        removeNotification(notification);
    });
    
    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    }
}

// Add CSS for form validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-control.invalid {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }
    
    .form-control.valid {
        border-color: var(--color-success);
        box-shadow: 0 0 0 3px rgba(var(--color-success-rgb), 0.1);
    }
`;
document.head.appendChild(validationStyles);

// Add global scroll function for external use
window.scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (!section) return;
    
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
    const offsetTop = section.offsetTop - navbarHeight - 20;
    
    window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
    });
};

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-ripple');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

const rippleAnimation = document.createElement('style');
rippleAnimation.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleAnimation);

// Preload critical resources
function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.as = 'style';
    document.head.appendChild(link);
}

// Reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--duration-fast', '0ms');
    document.documentElement.style.setProperty('--duration-normal', '0ms');
    
    const particlesContainer = document.getElementById('particles-container');
    const floatingOrbs = document.querySelector('.floating-orbs');
    
    if (particlesContainer) particlesContainer.style.display = 'none';
    if (floatingOrbs) floatingOrbs.style.display = 'none';
}

// Initializing preloading and performance
preloadResources();