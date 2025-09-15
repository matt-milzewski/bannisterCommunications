/**
 * Bannister Communications - Main JavaScript
 * Mobile-first responsive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNav();
    initSmoothScroll();
    initContactForm();
    initMobileCTABar();
    initImageLazyLoading();
    initAccessibility();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = nav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Update button text for screen readers
        menuToggle.setAttribute('aria-label', isExpanded ? 'Close navigation' : 'Open navigation');
    });
    
    // Close mobile nav when clicking nav links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
            menuToggle.focus();
        }
    });
}

/**
 * Smooth Scroll for Internal Anchors
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.focus();
            }
        });
    });
}

/**
 * Contact Form Enhancement and Validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Australian phone number
            if (value.startsWith('61')) {
                value = '+' + value;
            } else if (value.startsWith('04') || value.startsWith('02') || value.startsWith('03') || 
                      value.startsWith('07') || value.startsWith('08')) {
                // Australian mobile/landline format
                if (value.length > 10) {
                    value = value.substring(0, 10);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Real-time validation feedback
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(field);
        });
        
        field.addEventListener('input', function() {
            // Clear previous error state
            field.classList.remove('error');
            const errorText = field.parentNode.querySelector('.error-text');
            if (errorText) {
                errorText.remove();
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields before submission
        let isValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Check honeypot field
        const honeypot = document.getElementById('company');
        if (honeypot && honeypot.value.trim() !== '') {
            // Likely spam submission
            return;
        }
        
        if (!isValid) {
            // Scroll to first error field
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Hide any previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Submit form data
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                return response.json().then(data => {
                    console.log('Success response:', data);
                    // Success
                    successMessage.style.display = 'block';
                    contactForm.reset();
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                    
                    // Track form submission (if analytics available)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'form_name': 'contact_form'
                        });
                    }
                });
            } else {
                return response.json().then(data => {
                    console.error('Error response:', data);
                    throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
                }).catch(() => {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                });
            }
        })
        .catch(error => {
            // Error
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
            console.error('Form submission error:', error);
            
            // Update error message with more specific details
            const errorText = errorMessage.querySelector('p');
            if (errorText && error.message) {
                errorText.textContent = `Error: ${error.message}. Please try again or contact us directly.`;
            }
        })
        .finally(() => {
            // Reset button
            submitBtn.textContent = 'Send Enquiry';
            submitBtn.disabled = false;
        });
    });
}

/**
 * Field Validation Function
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+?61|0)[2-9]\d{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid Australian phone number.';
        }
    }
    
    // Consent checkbox validation
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        isValid = false;
        errorMessage = 'Please provide consent to contact you.';
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-text';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

/**
 * Mobile CTA Bar Logic
 */
function initMobileCTABar() {
    const mobileCTABar = document.querySelector('.mobile-cta-bar');
    
    if (!mobileCTABar) return;
    
    // Hide/show CTA bar on scroll (mobile only)
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateCTABar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (window.innerWidth <= 767) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                mobileCTABar.style.transform = 'translateY(100%)';
            } else {
                // Scrolling up
                mobileCTABar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateCTABar);
            ticking = true;
        }
    });
    
    // Ensure CTA bar is visible on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            mobileCTABar.style.transform = 'translateY(100%)';
        } else {
            mobileCTABar.style.transform = 'translateY(0)';
        }
    });
}

/**
 * Enhanced Image Lazy Loading
 */
function initImageLazyLoading() {
    // Only apply if browser doesn't support native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        return; // Native lazy loading supported
    }
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiLz48L3N2Zz4=';
            }
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

/**
 * Accessibility Enhancements
 */
function initAccessibility() {
    // Skip to main content link
    addSkipToMainLink();
    
    // Improve focus visibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Announce page changes for screen readers
    const pageTitle = document.title;
    if (pageTitle && 'speechSynthesis' in window) {
        // Don't actually use speech synthesis, but ensure ARIA live regions work
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-9999px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        
        // Announce form status changes
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function() {
                liveRegion.textContent = 'Form submitted, please wait...';
            });
        });
    }
}

/**
 * Add Skip to Main Content Link
 */
function addSkipToMainLink() {
    const main = document.querySelector('main');
    if (!main) return;
    
    // Ensure main has an ID
    if (!main.id) {
        main.id = 'main-content';
    }
    
    const skipLink = document.createElement('a');
    skipLink.href = '#' + main.id;
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-to-main';
    
    // Styles for skip link
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #C1272D;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        font-weight: bold;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for performance optimization
function throttle(func, limit) {
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
}

/**
 * Performance Monitoring (if needed)
 */
if ('PerformanceObserver' in window) {
    // Monitor for layout shifts
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                console.log('Layout shift detected:', entry.value);
            }
        }
    });
    
    try {
        observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
        // Not supported in this browser
    }
}

/**
 * Error Handling
 */
window.addEventListener('error', function(e) {
    // Log errors for debugging (in development)
    console.error('JavaScript error:', e.error);
    
    // Don't break the user experience
    return true;
});

window.addEventListener('unhandledrejection', function(e) {
    // Log promise rejections
    console.error('Unhandled promise rejection:', e.reason);
    
    // Prevent default browser behavior
    e.preventDefault();
});

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileNav,
        initSmoothScroll,
        initContactForm,
        validateField,
        debounce,
        throttle
    };
}