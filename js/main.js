// Main JavaScript for Paloma So website

document.addEventListener('DOMContentLoaded', function() {
    // Flowing Clouds Animation
    const pageWrapper = document.querySelector('.page-wrapper');

    if (pageWrapper && (pageWrapper.classList.contains('page-biography') ||
        pageWrapper.classList.contains('page-media') ||
        pageWrapper.classList.contains('page-calendar'))) {

        const numClouds = 10;

        // Generate random starting positions for each cloud
        function generateRandomPositions() {
            const positions = [];
            for (let i = 0; i < numClouds; i++) {
                positions.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100
                });
            }
            return positions;
        }

        // Generate target positions (slightly different from start)
        function generateTargetPositions(startPositions) {
            return startPositions.map(pos => ({
                x: pos.x + (Math.random() - 0.5) * 30,
                y: pos.y + (Math.random() - 0.5) * 30
            }));
        }

        // Convert positions array to CSS background-position string
        function positionsToCSS(positions) {
            const cloudPositions = positions.map(p => `${p.x}% ${p.y}%`);
            cloudPositions.push('0% 0%'); // Base gradient stays fixed
            return cloudPositions.join(', ');
        }

        // Initialize clouds with random positions
        let currentPositions = generateRandomPositions();
        let targetPositions = generateTargetPositions(currentPositions);

        pageWrapper.style.backgroundPosition = positionsToCSS(currentPositions);

        // Animate clouds slowly
        let progress = 0;
        const animationDuration = 60000; // 60 seconds per cycle
        let lastTime = performance.now();

        function animateClouds(currentTime) {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            progress += deltaTime / animationDuration;

            if (progress >= 1) {
                progress = 0;
                currentPositions = targetPositions.map(p => ({...p}));
                targetPositions = generateTargetPositions(currentPositions);
            }

            // Ease in-out interpolation
            const ease = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            // Interpolate positions
            const interpolatedPositions = currentPositions.map((start, i) => ({
                x: start.x + (targetPositions[i].x - start.x) * ease,
                y: start.y + (targetPositions[i].y - start.y) * ease
            }));

            pageWrapper.style.backgroundPosition = positionsToCSS(interpolatedPositions);

            requestAnimationFrame(animateClouds);
        }

        requestAnimationFrame(animateClouds);
    }

    // Page Transitions
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
