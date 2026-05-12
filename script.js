// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768;

// Hero app-like role switch
const roleTabs = Array.from(document.querySelectorAll('.app-tab'));
const roleChip = document.getElementById('roleChip');
const appScreens = Array.from(document.querySelectorAll('.app-screen'));
const phone = document.getElementById('phone');
const autoHint = document.getElementById('autoHint');
let roleAutoTimer = null;
let roleIndex = 0;
const roles = ['customer', 'chef', 'admin'];
const roleLabel = {
    customer: 'Customer',
    chef: 'Chef',
    admin: 'Admin',
};

function setRole(role) {
    roleTabs.forEach((t) => t.classList.toggle('active', t.dataset.role === role));
    appScreens.forEach((s) => s.classList.toggle('active', s.dataset.screen === role));
    if (roleChip) roleChip.textContent = roleLabel[role] || role;
    roleIndex = roles.indexOf(role);
    if (roleIndex < 0) roleIndex = 0;
}

function stopAuto() {
    if (roleAutoTimer) {
        clearInterval(roleAutoTimer);
        roleAutoTimer = null;
    }
    if (autoHint) autoHint.classList.add('hidden');
    if (phone) phone.classList.remove('float');
}

roleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        stopAuto();
        setRole(tab.dataset.role);
    });
});

if (!prefersReducedMotion) {
    if (phone) phone.classList.add('float');
}
roleAutoTimer = setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    setRole(roles[roleIndex]);
}, prefersReducedMotion ? 4200 : 3200);

// Cinematic spotlight follow
const spotlight = document.getElementById('spotlight');
let spX = 50;
let spY = 45;
let spTX = 50;
let spTY = 45;

function animateSpotlight() {
    if (prefersReducedMotion || isMobile) return;
    spX += (spTX - spX) * 0.05;
    spY += (spTY - spY) * 0.05;
    spotlight.style.background = `radial-gradient(circle at ${spX.toFixed(2)}% ${spY.toFixed(2)}%, rgba(167, 243, 208, 0.10), rgba(47, 191, 113, 0.05) 35%, transparent 60%)`;
    requestAnimationFrame(animateSpotlight);
}
if (!isMobile) {
    requestAnimationFrame(animateSpotlight);

    window.addEventListener('mousemove', (e) => {
        spTX = (e.clientX / window.innerWidth) * 100;
        spTY = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });
}

// Intro overlay
const intro = document.getElementById('intro');
if (!prefersReducedMotion && !isMobile) {
    window.setTimeout(() => {
        intro.classList.add('hidden');
    }, 1400);
} else {
    intro.classList.add('hidden');
}

intro.addEventListener('click', () => {
    intro.classList.add('hidden');
});

// Scroll progress bar
const scrollBar = document.getElementById('scrollBar');
function updateScrollProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
    scrollBar.style.width = (progress * 100).toFixed(2) + '%';
}
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// Scroll reveal animations + active section spotlight
const sections = Array.from(document.querySelectorAll('section'));
const staggerTargets = Array.from(document.querySelectorAll('.grid, .timeline'));
let activeSection = null;

if (!isMobile) {
    sections.forEach((sec) => sec.classList.add('reveal'));
    staggerTargets.forEach((el) => el.classList.add('reveal-stagger'));

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('visible');
            }

            const best = entries
                .filter((e) => e.isIntersecting && e.target.tagName === 'SECTION')
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (best && best.target !== activeSection) {
                if (activeSection) activeSection.classList.remove('is-active');
                activeSection = best.target;
                activeSection.classList.add('is-active');
            }
        },
        { threshold: [0.12, 0.22, 0.35, 0.5], rootMargin: '0px 0px -10% 0px' }
    );

    [...sections, ...staggerTargets].forEach((el) => io.observe(el));
}

// Particles generation (optimized mode)
const particlesRoot = document.querySelector('.particles');
const particleCount = 30;
if (particlesRoot && !isMobile) {
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        const left = Math.random() * 100;
        const top = 100 + Math.random() * 30;
        const duration = 10 + Math.random() * 16;
        const delay = -Math.random() * duration;
        const size = 2 + Math.random() * 2;

        p.style.left = left.toFixed(2) + 'vw';
        p.style.top = top.toFixed(2) + 'vh';
        p.style.width = size.toFixed(2) + 'px';
        p.style.height = size.toFixed(2) + 'px';
        p.style.animationDuration = duration.toFixed(2) + 's';
        p.style.animationDelay = delay.toFixed(2) + 's';
        p.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
        particlesRoot.appendChild(p);
    }
}

// Subtle parallax on background
const bg = document.querySelector('.animated-bg');
let rafId = null;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function animateParallax() {
    if (prefersReducedMotion || isMobile) return;
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    bg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    rafId = requestAnimationFrame(animateParallax);
}
if (!isMobile) {
    rafId = requestAnimationFrame(animateParallax);

    window.addEventListener('mousemove', (e) => {
        const dx = (e.clientX / window.innerWidth) - 0.5;
        const dy = (e.clientY / window.innerHeight) - 0.5;
        targetX = dx * 10;
        targetY = dy * 10;
    }, { passive: true });
}

// 3D tilt on cards (optimized with throttling)
const cards = Array.from(document.querySelectorAll('.card'));
if (!prefersReducedMotion && !isMobile) {
    let tiltThrottle = false;
    cards.forEach((card) => {
        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            if (tiltThrottle) return;
            tiltThrottle = true;
            requestAnimationFrame(() => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const rx = ((y / r.height) - 0.5) * -8;
                const ry = ((x / r.width) - 0.5) * 8;

                card.style.setProperty('--mx', (x / r.width * 100).toFixed(2) + '%');
                card.style.setProperty('--my', (y / r.height * 100).toFixed(2) + '%');
                card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
                card.classList.add('is-tilting');
                tiltThrottle = false;
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('is-tilting');
        });
    });
}
