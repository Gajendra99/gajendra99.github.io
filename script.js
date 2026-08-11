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
    // DYNAMIC PROJECTS LOADING & FILTERING
    // ================================================
    const projectsGridContainer = document.getElementById('projects-grid-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('project-modal');
    const modalBody = modal ? modal.querySelector('.modal-body') : null;
    const modalCloseBtn = document.getElementById('modal-close-btn');
    let globalProjectsData = {};

    function parseDateString(dateStr) {
        if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'continue') {
            return new Date();
        }
        const parts = dateStr.split('/');
        if (parts.length === 2) {
            return new Date(parseInt(parts[1]), parseInt(parts[0]) - 1, 1);
        }
        return new Date(dateStr);
    }

    function calculateDuration(startStr, endStr) {
        const start = parseDateString(startStr);
        const end = parseDateString(endStr);

        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth();
        months += end.getMonth();

        if (months <= 0) return '1 month';

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let result = [];
        if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
        if (remainingMonths > 0) result.push(`${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`);

        return result.length > 0 ? result.join(' ') : '1 month';
    }

    function initFilters() {
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
    }

    function initModals() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectKey = card.getAttribute('data-project');
                const data = globalProjectsData[projectKey];
                if (!data || !modalBody) return;

                const duration = calculateDuration(data.startDate, data.endDate);
                const dateDisplay = `${data.startDate} — ${data.endDate} (${duration})`;

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
                            <span><i class="fas fa-clock"></i> ${dateDisplay}</span>
                        </div>
                    </div>
                    <div class="modal-description">${data.desc}</div>
                    <div class="modal-tech">
                        ${data.allTech.map(t => `<span>${t}</span>`).join('')}
                    </div>
                    ${galleryHTML}
                    <div class="modal-actions" style="padding: 0 32px 32px; display: flex; gap: 16px; margin-top:15px;">
                        <a href="#" class="btn btn-primary" style="flex: 1; justify-content: center;"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                    </div>
                `;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Render projects from globally loaded projectsList
    if (projectsGridContainer && typeof projectsList !== 'undefined') {
        let html = '';
        projectsList.forEach(p => {
            globalProjectsData[p.id] = p;

            const duration = calculateDuration(p.startDate, p.endDate);

            html += `
                <div class="project-card" data-category="${p.filterTags}" data-project="${p.id}">
                    <div class="project-img-container">
                        <div class="project-overlay">
                            <span class="project-details-btn">View Details</span>
                        </div>
                        <img src="${p.thumbnail}" alt="${p.title}"
                            onerror="this.src='https://placeholdit.com/600x400/' + (typeof placeholderBg !== 'undefined' ? placeholderBg : '000000') + '/' + (typeof placeholderText !== 'undefined' ? placeholderText : 'FFFFFF') + '?text=' + encodeURIComponent('${p.title}') + '&font_size=' + (typeof placeholderFontSize !== 'undefined' ? placeholderFontSize : '25')">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${p.title}</h3>
                        <div style="font-size: 0.75rem; color: var(--accent-primary); margin-bottom: 8px; font-weight: 500;">
                            <i class="fas fa-clock"></i> Duration: ${duration}
                        </div>
                        <p class="project-desc">${p.shortDesc}</p>
                        <div class="project-tags">
                            ${p.tech.map(t => `<span>${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        projectsGridContainer.innerHTML = html;

        // Initialize dependent features
        initFilters();
        initModals();
    }

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
        let isPaused = false;
        let pauseTimeout;
        let scrollDirection = 1;
        let scrollSpeed = 0.5; // pixels per frame
        let currentScroll = projectsGrid.scrollLeft;
        let animationId;

        // Function to temporarily pause auto-scroll for 5 seconds
        function triggerPause() {
            isPaused = true;
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                isPaused = false;
            }, 5000);
        }

        // Mouse hover interactions (Desktop)
        projectsGrid.addEventListener('mouseenter', () => isHovered = true);
        projectsGrid.addEventListener('mouseleave', () => isHovered = false);

        // Touch and wheel interactions (Mobile & Desktop)
        projectsGrid.addEventListener('touchstart', triggerPause, { passive: true });
        projectsGrid.addEventListener('touchmove', triggerPause, { passive: true });
        projectsGrid.addEventListener('wheel', triggerPause, { passive: true });

        function autoScroll() {
            // If not hovered and not in a 5s pause window, scroll automatically
            if (!isHovered && !isPaused) {
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
            } else {
                // VERY IMPORTANT: Sync currentScroll with actual scroll position
                // when user is interacting, so it doesn't snap back when resuming!
                currentScroll = projectsGrid.scrollLeft;
            }
            
            animationId = requestAnimationFrame(autoScroll);
        }

        // Start auto scroll
        autoScroll();
    }
});
