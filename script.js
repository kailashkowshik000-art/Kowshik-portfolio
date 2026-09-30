/* ----------------------------------------------------
   KOWSHIK KAILASH | PRODUCTION PORTFOLIO CONTROLLER
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Core Systems
    initCustomCursor();
    initThemeSystem();
    initMobileNav();
    initTypingHero();
    initParticleCanvas();
    initISTClock();
    initScrollEffects();
    initProjectModals();
    initContactForm();
});

/* ==========================================================================
   1. CUSTOM CURSOR SYSTEM (Desktop Only)
   ========================================================================== */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    if (!dot || !outline) return;

    // Only enable if pointer is fine (mouse/trackpad, not touch)
    if (window.matchMedia('(pointer: coarse)').matches) {
        dot.style.display = 'none';
        outline.style.display = 'none';
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            dot.classList.remove('cursor-hidden');
            outline.classList.remove('cursor-hidden');
        }

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function animateOutline() {
        const ease = 0.18;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;

        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        dot.classList.add('cursor-hidden');
        outline.classList.add('cursor-hidden');
    });

    // Add cursor active states on interactive elements
    const interactiveSelectors = 'a, button, input, textarea, .glass-card, .skill-pill, .highlight-chip, .focus-pill';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.addEventListener('mouseenter', () => outline.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => outline.classList.remove('cursor-active'));
    });
}

/* ==========================================================================
   2. THEME TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initThemeSystem() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
    document.body.className = savedTheme;

    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        const nextTheme = isDark ? 'light-theme' : 'dark-theme';

        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
    });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileNav.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    });

    // Close when clicking outside or clicking any nav link
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && e.target !== toggleBtn) {
            closeMobileNav();
        }
    });

    mobileNav.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', closeMobileNav);
    });

    function closeMobileNav() {
        mobileNav.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
}

/* ==========================================================================
   4. DYNAMIC HERO TYPING EFFECT
   ========================================================================== */
function initTypingHero() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const phrases = [
        'Full-Stack Developer',
        'AI & UI/UX Enthusiast',
        'CS & Design Student',
        'Practical Product Builder'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function tick() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            target.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            delay = 50;
        } else {
            target.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            delay = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            delay = 2200; // Pause on complete word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400; // Pause before typing next word
        }

        setTimeout(tick, delay);
    }

    tick();
}

/* ==========================================================================
   5. AMBIENT PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = window.innerWidth < 768 ? 30 : 60;
    const maxLinkDistance = 110;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleCount = window.innerWidth < 768 ? 30 : 60;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        draw() {
            const isDark = document.body.classList.contains('dark-theme');
            ctx.fillStyle = isDark
                ? `rgba(168, 85, 247, ${this.alpha})`
                : `rgba(147, 51, 234, ${this.alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
    });

    function animate() {
        if (isTabVisible) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxLinkDistance) {
                        const alpha = (1 - dist / maxLinkDistance) * 0.12;
                        const isDark = document.body.classList.contains('dark-theme');
                        ctx.strokeStyle = isDark
                            ? `rgba(6, 182, 212, ${alpha})`
                            : `rgba(8, 145, 178, ${alpha})`;
                        ctx.lineWidth = 0.75;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   6. BENTO SECTION LIVE IST CLOCK
   ========================================================================== */
function initISTClock() {
    const timeDisplay = document.getElementById('clock-time');
    const hrHand = document.getElementById('clock-hour');
    const minHand = document.getElementById('clock-minute');
    const secHand = document.getElementById('clock-second');

    if (!timeDisplay) return;

    function update() {
        // Calculate IST (UTC + 5:30)
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const ist = new Date(utc + 3600000 * 5.5);

        const hours = ist.getHours();
        const minutes = ist.getMinutes();
        const seconds = ist.getSeconds();

        // Analog angles
        const hrAngle = (hours % 12) * 30 + minutes * 0.5;
        const minAngle = minutes * 6 + seconds * 0.1;
        const secAngle = seconds * 6;

        if (hrHand) hrHand.style.transform = `translate(-50%, -100%) rotate(${hrAngle}deg)`;
        if (minHand) minHand.style.transform = `translate(-50%, -100%) rotate(${minAngle}deg)`;
        if (secHand) secHand.style.transform = `translate(-50%, -100%) rotate(${secAngle}deg)`;

        // Digital String
        const displayHrs = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const strH = String(displayHrs).padStart(2, '0');
        const strM = String(minutes).padStart(2, '0');
        const strS = String(seconds).padStart(2, '0');

        timeDisplay.textContent = `${strH}:${strM}:${strS} ${ampm}`;
    }

    setInterval(update, 1000);
    update();
}

/* ==========================================================================
   7. SCROLL EFFECTS & ACTIVE NAVIGATION TRACKING
   ========================================================================== */
function initScrollEffects() {
    const progress = document.getElementById('scroll-progress');
    const nav = document.querySelector('.glass-nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-item');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (progress) progress.style.width = `${scrolled}%`;

        // Navbar scrolled appearance
        if (nav) {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Active link tracking
        let currentSection = '';
        sections.forEach((sec) => {
            const sectionTop = sec.offsetTop - 140;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active-link');
            }
        });
    });

    // Scroll reveal observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   8. PROJECT DETAILS MODAL DATABASE & INTERACTION
   ========================================================================== */
const projectData = {
    agriconnect: {
        title: 'AgriConnect',
        category: 'Full-Stack / AI-ready Agriculture Platform',
        overview: 'AgriConnect is a farmer-focused digital platform designed to make agricultural market information and crop trading easier to access.',
        problem: 'Farmers frequently experience opacity in mandi market prices, limited access to timely buyer connections without intermediaries, and difficulty navigating location-specific crop grade values.',
        features: [
            'Market price information with live rates',
            'State, district, city & mandi selection',
            'Crop, crop variety & grade selection',
            'Real-time local weather information',
            'Dedicated Buy & Sell trading sections',
            'Quantity management & expected price calculation',
            'Crop image upload capability',
            'Responsive UI with backend & API integration'
        ],
        technologies: ['React', 'Node.js', 'JavaScript', 'APIs', 'Database', 'Responsive UI/UX'],
        contribution: 'Engineered the full-stack architecture, built multi-step location/crop filtering workflows, designed the farmer-friendly Buy and Sell sections, and structured API endpoints for mandi rates and image uploads.',
        improvements: [
            'AI-powered crop disease detection from uploaded leaf images',
            'Multi-language regional voice support for rural accessibility',
            'Automated SMS/WhatsApp notifications for price changes',
            'Direct digital escrow integration for safe crop payments'
        ],
        github: 'https://github.com/kailashkowshik000-art',
        visualHTML: `
            <div class="tech-pattern-agri" style="padding: 24px; border-radius: 12px; color: #fff;">
                <div style="background: rgba(15,23,42,0.9); padding: 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
                        <span style="font-weight:700; color:#10b981; font-size:0.9rem;">🌾 AgriConnect Mandi Live Data</span>
                        <span style="font-size:0.75rem; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px;">Bengaluru APMC</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.82rem; margin-bottom:12px;">
                        <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <div style="color:#94a3b8; font-size:0.75rem;">Selected Crop</div>
                            <div style="font-weight:700; color:#f8fafc;">Wheat (Sharbati Grade A)</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <div style="color:#94a3b8; font-size:0.75rem;">Current Mandi Price</div>
                            <div style="font-weight:700; color:#10b981;">₹2,450 / Quintal</div>
                        </div>
                    </div>
                    <div style="font-size:0.78rem; color:#cbd5e1; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:8px 12px; border-radius:6px;">
                        ✓ Integrated Buy/Sell workflow active with quantity calculation and image verification.
                    </div>
                </div>
            </div>
        `
    },
    'friday-ai': {
        title: 'Friday AI Assistant',
        category: 'AI Assistant / Productivity Application',
        overview: 'Friday is an AI-powered personal assistant designed to combine conversational AI, voice interaction and productivity tools in one application.',
        problem: 'Dispersed productivity utilities require constantly context-switching between separate note editors, task reminders, and AI chat interfaces with zero unified voice interaction.',
        features: [
            'Conversational AI chat engine powered by Gemini AI',
            'Voice interaction engine (Speech-to-Text & Text-to-Speech)',
            'Quick notes capture & management',
            'Task & reminder scheduling system',
            'Custom AI productivity tooling',
            'Personal settings and customization panel',
            'React frontend paired with Node.js backend',
            'Local settings & offline data handling'
        ],
        technologies: ['React', 'Node.js', 'JavaScript', 'Gemini AI', 'APIs'],
        contribution: 'Designed and developed the conversational assistant interface, integrated Google Gemini AI API endpoints, engineered the browser voice command loops, and built the local state synchronization for quick notes and reminders.',
        improvements: [
            'Calendar synchronization with Google Calendar & Outlook',
            'Background push notification alarms for scheduled reminders',
            'Offline vector indexing for local document search and summarization',
            'Customizable assistant personality profiles and shortcut routines'
        ],
        github: 'https://github.com/kailashkowshik000-art',
        visualHTML: `
            <div class="tech-pattern-ai" style="padding: 24px; border-radius: 12px; color: #fff;">
                <div style="background: rgba(15,23,42,0.9); padding: 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
                        <span style="font-weight:700; color:#a855f7; font-size:0.9rem;">⚡ Friday AI Assistant Loop</span>
                        <span style="font-size:0.75rem; background:rgba(168,85,247,0.2); color:#c084fc; padding:2px 8px; border-radius:4px;">Gemini API Connected</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem; margin-bottom:12px;">
                        <div style="background:rgba(168,85,247,0.15); padding:8px 12px; border-radius:8px; align-self:flex-end; max-width:85%;">
                            "Friday, set a study reminder for 4:00 PM and summarize today's algorithm notes."
                        </div>
                        <div style="background:rgba(255,255,255,0.06); padding:8px 12px; border-radius:8px; align-self:flex-start; max-width:90%; border:1px solid rgba(255,255,255,0.08);">
                            "Reminder set for 4:00 PM. Here is your quick 3-bullet summary of today's notes ready for review."
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; font-size:0.75rem;">
                        <span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px;">🎙️ Voice Engine Active</span>
                        <span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px;">📝 2 Notes Saved</span>
                    </div>
                </div>
            </div>
        `
    },
    'car-showcase': {
        title: 'Car Showcase',
        category: 'Web Application / Showcase',
        overview: 'A responsive car showcase application built to present cars and their details through an interactive web interface.',
        problem: 'Automotive showcase platforms are frequently cluttered, slow to load specifications, and difficult to browse on mobile touch screens.',
        features: [
            'Interactive car catalog with rich visual cards',
            'Specification overview (engine specs, horsepower, transmission, fuel)',
            'Dynamic vehicle filtering by type and make',
            'Interactive web interface with smooth transitions',
            'Responsive layout tailored for mobile and desktop screens'
        ],
        technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
        contribution: 'Created the responsive web interface layout from scratch, structured the vehicle data schema in Node.js, and implemented client-side interactive search and filtering mechanics.',
        improvements: [
            '3D vehicle model interactive preview using Three.js / WebGL',
            'Side-by-side vehicle specification comparison tool',
            'Test-drive scheduling and inquiry request form'
        ],
        github: 'https://github.com/kailashkowshik000-art',
        visualHTML: `
            <div class="tech-pattern-car" style="padding: 24px; border-radius: 12px; color: #fff;">
                <div style="background: rgba(15,23,42,0.9); padding: 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
                        <span style="font-weight:700; color:#06b6d4; font-size:0.9rem;">🏎️ Car Showcase Portal</span>
                        <span style="font-size:0.75rem; background:rgba(6,182,212,0.2); color:#38bdf8; padding:2px 8px; border-radius:4px;">Interactive Catalog</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.8rem; margin-bottom:10px;">
                        <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <span style="color:#94a3b8; font-size:0.72rem;">Vehicle Model</span>
                            <div style="font-weight:700;">Performance GT Coupe</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                            <span style="color:#94a3b8; font-size:0.72rem;">Powertrain</span>
                            <div style="font-weight:700; color:#38bdf8;">Twin-Turbo V6 • 450 HP</div>
                        </div>
                    </div>
                    <div style="font-size:0.75rem; color:#94a3b8;">
                        Features responsive specification grid, dynamic category filtering, and mobile-friendly detail views.
                    </div>
                </div>
            </div>
        `
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    // Open modal triggers
    document.querySelectorAll('.open-project-modal').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = btn.getAttribute('data-target');
            openModal(key);
        });
    });

    function openModal(key) {
        const item = projectData[key];
        if (!item) return;

        document.getElementById('modal-project-tag').textContent = item.category;
        document.getElementById('modal-project-title').textContent = item.title;
        document.getElementById('modal-project-desc').textContent = item.overview;
        document.getElementById('modal-project-problem').textContent = item.problem;
        document.getElementById('modal-project-contribution').textContent = item.contribution;

        // Visual frame
        const visualFrame = document.getElementById('modal-visual-frame');
        visualFrame.innerHTML = item.visualHTML;

        // Features
        const featList = document.getElementById('modal-project-features');
        featList.innerHTML = '';
        item.features.forEach((f) => {
            const li = document.createElement('li');
            li.textContent = f;
            featList.appendChild(li);
        });

        // Tech badges
        const techRow = document.getElementById('modal-project-tech');
        techRow.innerHTML = '';
        item.technologies.forEach((t) => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = t;
            techRow.appendChild(span);
        });

        // Future improvements
        const impList = document.getElementById('modal-project-improvements');
        impList.innerHTML = '';
        item.improvements.forEach((imp) => {
            const li = document.createElement('li');
            li.textContent = imp;
            impList.appendChild(li);
        });

        // Links
        const githubLink = document.getElementById('modal-github-link');
        githubLink.href = item.github;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    const modalContactLink = document.getElementById('modal-contact-link');
    if (modalContactLink) {
        modalContactLink.addEventListener('click', () => {
            closeModal();
        });
    }
}

/* ==========================================================================
   9. CONTACT FORM VALIDATION & DIRECT EMAIL INTEGRATION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusBox = document.getElementById('form-status-msg');

    if (!form || !statusBox) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
        [nameError, emailError, subjectError, messageError].forEach((el) => {
            if (el) el.textContent = '';
        });
        document.querySelectorAll('.input-wrapper').forEach((w) => w.classList.remove('error'));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const subjectVal = subjectInput.value.trim();
        const messageVal = messageInput.value.trim();

        if (nameVal.length < 2) {
            nameError.textContent = 'Please enter your full name (at least 2 characters).';
            nameInput.closest('.input-wrapper').classList.add('error');
            isValid = false;
        }

        if (!validateEmail(emailVal)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.closest('.input-wrapper').classList.add('error');
            isValid = false;
        }

        if (subjectVal.length < 3) {
            subjectError.textContent = 'Please enter a subject (at least 3 characters).';
            subjectInput.closest('.input-wrapper').classList.add('error');
            isValid = false;
        }

        if (messageVal.length < 10) {
            messageError.textContent = 'Please provide a message of at least 10 characters.';
            messageInput.closest('.input-wrapper').classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            statusBox.className = 'form-status-box error-state';
            statusBox.innerHTML = `
                <div class="status-highlight-title">⚠️ Please fix the highlighted form errors</div>
                <span>Ensure all required fields are accurately filled before proceeding.</span>
            `;
            return;
        }

        // Production-quality honest notification:
        // Client-side validation succeeds. Since a backend SMTP / API endpoint is not yet connected,
        // we clearly explain this and give a 1-click mailto fallback to send the message immediately.
        const mailtoUrl = `mailto:kailashkowshik000@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(
            `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`
        )}`;

        statusBox.className = 'form-status-box info-state';
        statusBox.innerHTML = `
            <div class="status-highlight-title">
                <span>✓ Frontend Validation Passed!</span>
            </div>
            <p style="margin-bottom: 8px;">
                Thank you, <strong>${escapeHTML(nameVal)}</strong>. Note: Direct backend email dispatch service is currently not connected.
            </p>
            <p style="margin-bottom: 12px; font-size: 0.85rem; color: #94a3b8;">
                You can immediately dispatch this message using your default email client below, or email me directly at <strong>kailashkowshik000@gmail.com</strong>.
            </p>
            <div class="status-actions-row">
                <a href="${mailtoUrl}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="send"></i>
                    <span>Open in Email App</span>
                </a>
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}
