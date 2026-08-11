/*
 * Portfolio — Refined Interactions
 * Handles: Preloader, Navigation, Scroll Reveal, Project Filtering, Modals, Typing Effect, Counter Animation
 */

document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // PRELOADER — Text Decode Animation
    // ================================================
    const preloader = document.getElementById('preloader');
    const loaderText = document.querySelector('.loader-text');
    const originalText = loaderText ? loaderText.innerText : 'LOADING';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if (preloader && loaderText) {
        let iterations = 0;
        const interval = setInterval(() => {
            loaderText.innerText = originalText.split('')
                .map((letter, index) => {
                    if (letter === ' ') return ' ';
                    if (index < iterations) return originalText[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    document.body.classList.add('loaded');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        initTypingEffect();
                        initCounterAnimation();
                    }, 800);
                }, 500);
            }
            iterations += 0.5;
        }, 25);
    }

    // ================================================
    // TYPING EFFECT
    // ================================================
    function initTypingEffect() {
        const titleElement = document.querySelector('.hero-subtitle');
        if (!titleElement) return;

        const roles = ['Flutter Developer', 'Android Expert', 'iOS Developer', 'UI/UX Enthusiast'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        titleElement.classList.add('typing-text');

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                titleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                titleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // ================================================
    // COUNTER ANIMATION
    // ================================================
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.querySelector('span');
            const suffixText = suffix ? suffix.textContent : '';
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(eased * target);

                counter.textContent = current;
                if (suffixText) {
                    const span = document.createElement('span');
                    span.textContent = suffixText;
                    counter.appendChild(span);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ================================================
    // SCROLL REVEAL — IntersectionObserver
    // ================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ================================================
    // NAVBAR — Scroll Effect
    // ================================================
    const header = document.querySelector('header');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load

    // ================================================
    // MOBILE MENU
    // ================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ================================================
    // SCROLL SPY — Active Nav Link
    // ================================================
    const sections = document.querySelectorAll('section[id]');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.2,
        rootMargin: '-20% 0px -20% 0px'
    });

    sections.forEach(section => spyObserver.observe(section));

    // ================================================
    // SMOOTH SCROLL — Offset for fixed header
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ================================================
    // PROJECT FILTERING & COUNTS
    // ================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Initialize counts
    filterBtns.forEach(btn => {
        const filterValue = btn.getAttribute('data-filter');
        let count = 0;
        
        if (filterValue === 'all') {
            count = projectCards.length;
        } else {
            projectCards.forEach(card => {
                if (card.getAttribute('data-category').includes(filterValue)) {
                    count++;
                }
            });
        }
        
        const countSpan = btn.querySelector('.filter-count');
        if (countSpan) {
            countSpan.textContent = count;
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const shouldShow = filterValue === 'all' || card.getAttribute('data-category').includes(filterValue);

                if (shouldShow) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 60);
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ================================================
    // PROJECT MODAL
    // ================================================
    const projectsData = {
        'mad3wo': {
            title: 'MAD3WO',
            category: 'Cross-platform App',
            date: 'Oct 2024 — Present',
            desc: 'Developed a large-scale cross-platform Flutter application with over 70 responsive screens. The app features a highly polished UI using GetX for efficient state management. Integrated complex REST APIs and Firebase services (Realtime DB, Storage, Push Notifications) to ensure seamless dynamic content delivery and real-time updates.',
            tech: ['Flutter', 'GetX', 'Firebase', 'REST API', 'Android', 'iOS'],
            images: ['./images/mad3wo/mad3wo.png', './images/mad3wo/mad3wo2.png', './images/mad3wo/3.png']
        },
        'qadem': {
            title: 'QADEM',
            category: 'Service App',
            date: 'Jul 2025 — Present',
            desc: 'Built a scalable service-based Flutter application focusing on real-time chat functionality, interactive maps, and a modern, intuitive UI/UX. Integrated secure payment gateways (Stripe & Futura) for smooth transactions. Utilized GetX for state management and Firebase for robust backend services.',
            tech: ['Flutter', 'GetX', 'Firebase', 'Stripe', 'Google Maps'],
            images: []
        },
        'anexee': {
            title: 'Anexee',
            category: 'Enterprise App',
            date: 'Dec 2024 — Present',
            desc: 'Developed a dynamic Android application for Anaxee using Flutter. Key features include real-time data processing with MQTT, encrypted secure login systems, and dynamic data-driven layouts (menus, grids) fetched from REST APIs.',
            tech: ['Flutter', 'MQTT', 'REST API', 'Security'],
            images: []
        },
        'acchhu': {
            title: 'AccHHU',
            category: 'Hardware Integration',
            date: 'Dec 2022 — Jun 2025',
            desc: 'A specialized Flutter application involving hardware integration. Implemented RS232 communication protocols and Bluetooth thermal printing capabilities. Features dynamic form generation to handle variable data input requirements.',
            tech: ['Flutter', 'RS232', 'Bluetooth', 'Hardware'],
            images: []
        },
        'line-monitoring': {
            title: 'Line Monitoring',
            category: 'Auditing Tool',
            date: 'Sep 2024 — Apr 2025',
            desc: 'Developed a comprehensive auditing application. The core feature is a fully functional dynamic form system that renders UI components based on JSON configurations, allowing for highly flexible audit checklists.',
            tech: ['Flutter', 'JSON Forms', 'REST API', 'Auditing'],
            images: []
        },
        'alphatnd': {
            title: 'AlphaTND',
            category: 'Field Work App',
            date: 'Oct 2023 — Apr 2024',
            desc: 'Played a key role in developing AlphaTND, an advanced mobile app for field operations. Features include sophisticated camera API integrations for evidence capture and location services for geo-tagging activities.',
            tech: ['Flutter', 'Camera API', 'Geolocation', 'REST API'],
            images: ['./images/alphatnd/3.png', './images/alphatnd/4.png', './images/alphatnd/5.png']
        },
        'serialcom': {
            title: 'SerialCom Plugin',
            category: 'Open Source / Utility',
            date: 'Sep 2023',
            desc: 'Developed a custom Flutter plugin to bridge Dart and native Android Java code for USB serial communication. This plugin solved a critical need for communicating with external hardware devices via USB OTG.',
            tech: ['Flutter', 'Java', 'Android SDK', 'USB Serial'],
            images: ['./images/serialCom/serialCom.webp', './images/serialCom/serialCom2.webp']
        },
        'smarttiffin': {
            title: 'Smart Tiffin',
            category: 'Web & Android App',
            date: '2026',
            desc: 'A comprehensive food subscription platform delivering "Ghar Jaisa Khana". Users can subscribe to daily homemade tiffin meals (Normal, Premium, or Diet thalis) with flexible plans and doorstep delivery. Features include a smart app for leave management, live tracking, and bulk ordering.',
            tech: ['Web', 'Android', 'Subscription Management', 'Live Tracking'],
            images: []
        },
        'zaydsa': {
            title: 'Zaydsa',
            category: 'Web, Android & iOS App',
            date: '2025',
            desc: 'A robust multi-platform application encompassing Web, Android, and iOS to deliver a seamless user experience across all devices.',
            tech: ['Web', 'Android', 'iOS'],
            images: []
        }
    };

    const modal = document.getElementById('project-modal');
    const modalBody = modal ? modal.querySelector('.modal-body') : null;
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Open modal when clicking project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectKey = card.getAttribute('data-project');
            const data = projectsData[projectKey];
            if (!data || !modalBody) return;

            // Build modal content
            let galleryHTML = '';
            if (data.images && data.images.length > 0) {
                galleryHTML = `
                    <div class="modal-gallery">
                        ${data.images.map(img => `<img src="${img}" alt="${data.title}" onerror="this.style.display='none'">`).join('')}
                    </div>
                `;
            }

            modalBody.innerHTML = `
                <div class="modal-header">
                    <h2>${data.title}</h2>
                    <div class="modal-meta">
                        <span><i class="fas fa-folder"></i> ${data.category}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${data.date}</span>
                    </div>
                </div>
                <div class="modal-description">${data.desc}</div>
                <div class="modal-tech">
                    ${data.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
                ${galleryHTML}
                <div class="modal-actions" style="padding: 0 32px 32px; display: flex; gap: 16px;">
                    <a href="#" class="btn btn-primary" style="flex: 1; justify-content: center;"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                    <a href="#" class="btn btn-outline" style="flex: 1; justify-content: center;"><i class="fab fa-github"></i> View Code</a>
                </div>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ================================================
    // CONTACT FORM — Basic Validation Feedback
    // ================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn-primary');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#22c55e';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 2500);
        });
    }

    // ================================================
    // SCROLL PROGRESS
    // ================================================
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    // ================================================
    // PROJECTS AUTO SCROLL
    // ================================================
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        let isHovered = false;
        let isUserScrolling = false;
        let scrollDirection = 1;
        let scrollSpeed = 0.5; // pixels per frame
        let animationId;

        // Pause on hover
        projectsGrid.addEventListener('mouseenter', () => isHovered = true);
        projectsGrid.addEventListener('mouseleave', () => {
            isHovered = false;
            isUserScrolling = false;
        });

        // Pause on touch
        projectsGrid.addEventListener('touchstart', () => isHovered = true, { passive: true });
        projectsGrid.addEventListener('touchend', () => {
            setTimeout(() => { isHovered = false; isUserScrolling = false; }, 1000);
        });

        // Detect manual scrolling to temporarily pause
        projectsGrid.addEventListener('wheel', () => {
            isUserScrolling = true;
            clearTimeout(projectsGrid.scrollTimeout);
            projectsGrid.scrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 1000);
        }, { passive: true });

        let currentScroll = projectsGrid.scrollLeft;

        function autoScroll() {
            if (!isHovered && !isUserScrolling) {
                currentScroll += (scrollSpeed * scrollDirection);
                
                // Reverse direction if hitting ends
                if (currentScroll >= (projectsGrid.scrollWidth - projectsGrid.clientWidth - 1)) {
                    scrollDirection = -1;
                    currentScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth - 1;
                } else if (currentScroll <= 0) {
                    scrollDirection = 1;
                    currentScroll = 0;
                }
                
                projectsGrid.scrollLeft = currentScroll;
            } else if (isUserScrolling) {
                currentScroll = projectsGrid.scrollLeft;
            }
            animationId = requestAnimationFrame(autoScroll);
        }
        
        // Start auto scroll
        autoScroll();
    }
});
