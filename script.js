/*
* Portfolio Logic
* Handles: Preloader, Navigation, Project Filtering, Modals, Animations
*/

document.addEventListener('DOMContentLoaded', () => {


    // --- Advanced Preloader (Text Decoding) ---
    const preloader = document.getElementById('preloader');
    const loaderText = document.querySelector('.loader-text');
    const originalText = loaderText ? loaderText.innerText : 'LOADING';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

    if (preloader && loaderText) {
        let iterations = 0;
        const interval = setInterval(() => {
            loaderText.innerText = originalText.split('')
                .map((letter, index) => {
                    if (index < iterations) return originalText[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);

                // Cyber Split Shutter Reveal
                setTimeout(() => {
                    document.body.classList.add('loaded');

                    setTimeout(() => {
                        preloader.style.display = 'none';
                        // Start Typing Effect after animation
                        initTypingEffect();
                    }, 1000);
                }, 1000);
            }
            iterations += 1 / 3;
        }, 30);
    }

    // --- Typing Effect ---
    function initTypingEffect() {
        const titleElement = document.querySelector('.hero-subtitle');
        if (!titleElement) return;

        const roles = ["Flutter Developer", "Android Expert", "iOS Developer", "UI/UX Enthusiast"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        titleElement.classList.add('typing-text');

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                titleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                titleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // --- 3D Tilt Effect ---
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        // Add glare element
        const glare = document.createElement('div');
        glare.classList.add('card-glare');
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

            // Move glare
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2), transparent)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            glare.style.background = 'transparent';
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.btn, .nav-link, .social-icon, .skill-tag');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Stronger pull for smaller elements
            const strength = btn.classList.contains('skill-tag') || btn.classList.contains('social-icon') ? 0.5 : 0.3;

            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });

            // --- Global Mouse Tracking for Spotlight ---
            document.documentElement.style.setProperty('--mouse-x', `${posX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${posY}px`);

            // --- Pixel Trail ---
            createPixelTrail(posX, posY);
        });

        function createPixelTrail(x, y) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel-trail');
            document.body.appendChild(pixel);

            pixel.style.left = `${x}px`;
            pixel.style.top = `${y}px`;

            // Random scatter
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;

            pixel.animate([
                { opacity: 1, transform: 'scale(1) translate(0,0)' },
                { opacity: 0, transform: `scale(0) translate(${randomX}px, ${randomY}px)` }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).onfinish = () => pixel.remove();
        }

        // Hover Effect
        const hoverables = document.querySelectorAll('a, button, .project-card, .skill-tag');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // --- Canvas Background (Constellation) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Resize Canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            // Higher density: 9000 -> 6000
            let numberOfParticles = (canvas.height * canvas.width) / 6000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(0, 242, 255, 0.3)';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Pulse on Click
        window.addEventListener('click', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            for (let i = 0; i < 5; i++) {
                particlesArray.push(new Particle(x, y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, Math.random() * 3 + 2, 'rgba(255, 0, 85, 0.8)'));
            }
        });

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(0, 242, 255,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });
    }

    // --- AOS Initialization ---
    // Note: AOS library script must be loaded in HTML
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // --- Navbar Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Scroll Spy & Active Link ---
    const sections = document.querySelectorAll('section');
    // navLinks is already defined above

    const observerOptions = {
        root: null,
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: "-20% 0px -20% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active to current
                const id = entry.target.getAttribute('id');
                const link = document.querySelector(`.nav-link[href="#${id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // --- Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Staggered Animation for Initial Load
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- Project Data Source ---
    // Centralized data for Modals to keep HTML clean
    const projectsData = {
        'mad3wo': {
            title: 'MAD3WO',
            category: 'Cross-platform App',
            date: 'Oct 2024 - Present',
            desc: 'Developed a large-scale cross-platform Flutter application with over 70 responsive screens. The app features a highly polished UI using GetX for efficient state management. Integrated complex REST APIs and Firebase services (Realtime DB, Storage, Push Notifications) to ensure seamless dynamic content delivery and real-time updates.',
            tech: ['Flutter', 'GetX', 'Firebase', 'REST API', 'Android', 'iOS'],
            images: ['./images/mad3wo/mad3wo.png', './images/mad3wo/mad3wo2.png', './images/mad3wo/3.png']
        },
        'qadem': {
            title: 'QADEM',
            category: 'Service App',
            date: 'Jul 2025 - Present',
            desc: 'Built a scalable service-based Flutter application focusing on real-time chat functionality, interactive maps, and a modern, intuitive UI/UX. Integrated secure payment gateways (Stripe & Futura) for smooth transactions. Utilized GetX for state management and Firebase for robust backend services.',
            tech: ['Flutter', 'GetX', 'Firebase', 'Stripe', 'Google Maps'],
            images: [] // Add image paths if available
        },
        'anexee': {
            title: 'Anexee',
            category: 'Enterprise App',
            date: 'Dec 2024 - Present',
            desc: 'Developed a dynamic Android application for Anaxee using Flutter. Key features include real-time data processing with MQTT, encrypted secure login systems, and dynamic data-driven layouts (menus, grids) fetched from REST APIs.',
            tech: ['Flutter', 'MQTT', 'REST API', 'Security'],
            images: []
        },
        'acchhu': {
            title: 'AccHHU',
            category: 'Hardware Integration',
            date: 'Dec 2022 - Jun 2025',
            desc: 'A specialized Flutter application involving hardware integration. Implemented RS232 communication protocols and Bluetooth thermal printing capabilities. Features dynamic form generation to handle variable data input requirements.',
            tech: ['Flutter', 'RS232', 'Bluetooth', 'Hardware'],
            images: []
        },
        'line-monitoring': {
            title: 'Line Monitoring',
            category: 'Auditing Tool',
            date: 'Sep 2024 - Apr 2025',
            desc: 'Developed a comprehensive auditing application. The core feature is a fully functional dynamic form system that renders UI components based on JSON configurations, allowing for highly flexible audit checklists.',
            tech: ['Flutter', 'JSON Forms', 'REST API', 'Auditing'],
            images: []
        },
        'line-audit': {
            title: 'LineAudit',
            category: 'Auditing Tool',
            date: 'May 2024 - Jul 2024',
            desc: 'Similar to Line Monitoring, this application focuses on process auditing with dynamic JSON-driven forms and API integration for submitting audit reports.',
            tech: ['Flutter', 'JSON', 'API'],
            images: []
        },
        'alphatnd': {
            title: 'AlphaTND',
            category: 'Field Work App',
            date: 'Oct 2023 - Apr 2024',
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
        }
    }
});;


