/* ============================================
   DayOfTheDeadTravel.com — Main JavaScript
   Mobile nav, scroll effects, FAQ accordion,
   scroll reveal animations
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       MOBILE NAVIGATION TOGGLE
       ============================================ */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('site-header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    /* ============================================
       DROPDOWN MENUS (Mobile)
       ============================================ */
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function (dropdown) {
        var trigger = dropdown.querySelector('.nav-link');
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                // Only toggle dropdown on mobile
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    /* ============================================
       HEADER SCROLL EFFECT
       ============================================ */
    var lastScroll = 0;

    function handleHeaderScroll() {
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (header) {
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        lastScroll = currentScroll;
    }

    // Throttled scroll listener
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                handleHeaderScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    /* ============================================
       SCROLL REVEAL ANIMATION
       ============================================ */
    function setupScrollReveal() {
        // Add .reveal class to elements we want to animate
        var revealSelectors = [
            '.region-card',
            '.witness-card',
            '.altar-element',
            '.food-card',
            '.calendar-card',
            '.itinerary-card',
            '.faq-item',
            '.ft-feature',
            '.nh-content',
            '.diaspora-content',
            '.altars-showcase'
        ];

        revealSelectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.classList.add('reveal');
            });
        });

        // Use Intersection Observer for scroll reveal
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.reveal').forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show everything
            document.querySelectorAll('.reveal').forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    /* ============================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================
       FAQ — Add staggered reveal delay
       ============================================ */
    function setupFaqStagger() {
        var faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(function (item, index) {
            item.style.transitionDelay = (index * 0.05) + 's';
        });
    }

    /* ============================================
       PETAL ANIMATION ENHANCEMENT
       ============================================ */
    function setupPetalSway() {
        var petals = document.querySelectorAll('.petal');
        petals.forEach(function (petal) {
            // Add subtle horizontal sway
            var swayAmount = Math.random() * 100 - 50;
            petal.style.setProperty('--sway', swayAmount + 'px');
        });
    }

    /* ============================================
       LAZY LOAD IMAGES (native + fallback)
       ============================================ */
    function setupLazyLoad() {
        // Modern browsers handle loading="lazy" natively
        // This is a fallback for older browsers
        if (!('loading' in HTMLImageElement.prototype)) {
            var lazyImages = document.querySelectorAll('img[loading="lazy"]');
            if ('IntersectionObserver' in window) {
                var imgObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            imgObserver.unobserve(img);
                        }
                    });
                });
                lazyImages.forEach(function (img) {
                    imgObserver.observe(img);
                });
            }
        }
    }

    /* ============================================
       INITIALIZE ON DOM READY
       ============================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        handleHeaderScroll();
        setupScrollReveal();
        setupFaqStagger();
        setupPetalSway();
        setupLazyLoad();
    }
})();
