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
    initWhatsAppWidget();
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
 * WhatsApp Widget
 */
function initWhatsAppWidget() {
    if (document.querySelector('.whatsapp-widget')) return;

    const phoneLink = document.querySelector('a[href^="tel:"]');
    const schemaPhone = getSchemaPhoneNumber();
    const rawPhone = phoneLink ? phoneLink.getAttribute('href').replace(/^tel:/i, '') : schemaPhone;
    const whatsappPhone = normalizePhoneNumber(rawPhone);

    if (!whatsappPhone) return;

    const displayPhone = formatAustralianDisplayNumber(whatsappPhone);
    const whatsappMessage = encodeURIComponent('Hi Bannister Communications, I found your website and would like to chat about a quote.');

    syncMobileWhatsAppCTA(whatsappPhone, whatsappMessage, displayPhone);

    const widget = document.createElement('a');
    widget.className = 'whatsapp-widget';
    widget.href = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;
    widget.target = '_blank';
    widget.rel = 'noopener noreferrer';
    widget.setAttribute('aria-label', `Chat on WhatsApp with Bannister Communications at ${displayPhone}`);

    const icon = document.createElement('span');
    icon.className = 'whatsapp-widget__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = `
        <svg viewBox="0 0 32 32" focusable="false">
            <path fill="currentColor" d="M16.01 3.2c-7.08 0-12.81 5.73-12.81 12.81 0 2.26.59 4.47 1.71 6.42L3 29l6.75-1.77a12.79 12.79 0 0 0 6.26 1.61h.01c7.07 0 12.8-5.73 12.8-12.81S23.08 3.2 16.01 3.2Zm0 23.47h-.01a10.67 10.67 0 0 1-5.43-1.48l-.39-.23-4 .99 1.07-3.9-.25-.4a10.69 10.69 0 1 1 19.7-5.63 10.69 10.69 0 0 1-10.69 10.65Zm5.86-8.02c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.56-1.56-.95-.84-1.59-1.87-1.77-2.18-.19-.32-.02-.48.14-.64.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.08 1.31 3.29c.16.21 2.26 3.44 5.47 4.82.76.33 1.36.52 1.83.66.77.24 1.46.21 2.01.13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z"/>
        </svg>
    `;

    const text = document.createElement('span');
    text.className = 'whatsapp-widget__text';
    text.textContent = 'Chat on WhatsApp';

    widget.appendChild(icon);
    widget.appendChild(text);
    document.body.appendChild(widget);
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

function syncMobileWhatsAppCTA(whatsappPhone, whatsappMessage, displayPhone) {
    const mobileSecondaryCTA = document.querySelector('.mobile-cta-bar .mobile-cta-quote');

    if (!mobileSecondaryCTA) return;

    mobileSecondaryCTA.href = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;
    mobileSecondaryCTA.textContent = 'WhatsApp';
    mobileSecondaryCTA.target = '_blank';
    mobileSecondaryCTA.rel = 'noopener noreferrer';
    mobileSecondaryCTA.classList.add('mobile-cta-whatsapp');
    mobileSecondaryCTA.setAttribute('aria-label', `Chat on WhatsApp with Bannister Communications at ${displayPhone}`);
}

function getSchemaPhoneNumber() {
    const schemaNode = document.querySelector('script[type="application/ld+json"]');
    if (!schemaNode) return '';

    try {
        const data = JSON.parse(schemaNode.textContent);
        if (typeof data.telephone === 'string') {
            return data.telephone;
        }
    } catch (error) {
        console.warn('Unable to parse schema phone number:', error);
    }

    return '';
}

function normalizePhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!digitsOnly) return '';

    if (digitsOnly.startsWith('61')) {
        return digitsOnly;
    }

    if (digitsOnly.startsWith('0')) {
        return `61${digitsOnly.slice(1)}`;
    }

    return digitsOnly;
}

function formatAustralianDisplayNumber(phoneNumber) {
    const digitsOnly = normalizePhoneNumber(phoneNumber);
    if (!digitsOnly.startsWith('61')) {
        return phoneNumber;
    }

    const localNumber = `0${digitsOnly.slice(2)}`;
    if (localNumber.length === 10) {
        return `${localNumber.slice(0, 4)} ${localNumber.slice(4, 7)} ${localNumber.slice(7)}`;
    }

    return localNumber;
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
        initWhatsAppWidget,
        validateField,
        debounce,
        throttle
    };
}
