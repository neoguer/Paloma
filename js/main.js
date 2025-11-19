// Main JavaScript for Paloma So website

document.addEventListener('DOMContentLoaded', function() {
    // Page Transitions
    const pageWrapper = document.querySelector('.page-wrapper');
    const internalLinks = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="#"]):not([target="_blank"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                e.preventDefault();
                if (pageWrapper) {
                    pageWrapper.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                } else {
                    window.location.href = href;
                }
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Language links now navigate directly to translation pages
    // No additional JS needed - links work via href attributes

    // Calendar Event Toggle
    const eventHeaders = document.querySelectorAll('.event-header');

    eventHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const eventItem = this.closest('.event-item');
            const isActive = eventItem.classList.contains('active');

            // Close all other events
            document.querySelectorAll('.event-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current event
            if (!isActive) {
                eventItem.classList.add('active');
            }
        });
    });

    // Media Lightbox
    const mediaItems = document.querySelectorAll('.media-item[data-type="image"]');
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');

    mediaItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            if (modal && modalContent) {
                modalContent.innerHTML = `<img src="${imgSrc}" alt="Gallery image">`;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});
