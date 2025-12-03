/* =====================================================
   9 YARDS - COMING SOON PAGE
   Premium JavaScript - Top 1% Interactions
   ===================================================== */

// =====================================================
// COUNTDOWN TIMER
// =====================================================

const countdownConfig = {
    targetDate: new Date('December 18, 2025 00:00:00 UTC').getTime(),
    elements: {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    },
    previousValues: {
        days: null,
        hours: null,
        minutes: null,
        seconds: null
    }
};

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownConfig.targetDate - now;

    if (distance < 0) {
        // Countdown finished
        Object.values(countdownConfig.elements).forEach(el => {
            el.textContent = '00';
        });
        return;
    }

    const timeUnits = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };

    // Update each unit with flip animation
    Object.entries(timeUnits).forEach(([unit, value]) => {
        const element = countdownConfig.elements[unit];
        const formattedValue = value.toString().padStart(2, '0');
        
        if (countdownConfig.previousValues[unit] !== formattedValue) {
            element.classList.add('flip');
            
            setTimeout(() => {
                element.textContent = formattedValue;
                element.classList.remove('flip');
            }, 250);
            
            countdownConfig.previousValues[unit] = formattedValue;
        }
    });
}

// Initialize countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// =====================================================
// PARTICLE ANIMATION SYSTEM
// =====================================================

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = this.getParticleCount();
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    getParticleCount() {
        const width = window.innerWidth;
        if (width < 768) return 30;
        if (width < 1024) return 50;
        return 80;
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const opacity = Math.random() * 0.5 + 0.1;
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: opacity,
            currentOpacity: opacity,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particleCount = this.getParticleCount();
            this.createParticles();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    updateParticle(particle) {
        // Basic movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Pulse opacity
        particle.pulsePhase += particle.pulseSpeed;
        particle.currentOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulsePhase));

        // Mouse influence (subtle parallax)
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const force = (200 - distance) / 200 * 0.01;
            particle.x -= dx * force;
            particle.y -= dy * force;
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(230, 65, 28, ${particle.currentOpacity || particle.opacity})`;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 120, 80, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize particle system
const particleSystem = new ParticleSystem('particles');



// =====================================================
// MOUSE PARALLAX EFFECT - DISABLED
// =====================================================

// Parallax effect removed for cleaner user experience

// =====================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =====================================================

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

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// =====================================================
// PERFORMANCE OPTIMIZATIONS
// =====================================================

// Reduce animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        particleSystem.destroy();
    } else if (!particleSystem.animationId) {
        particleSystem.animate();
    }
});

// Smooth scroll polyfill fallback
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =====================================================
// CONSOLE BRANDING
// =====================================================

console.log(
    '%c9 YARDS FOOD',
    'font-size: 48px; font-weight: bold; color: #E6411C; text-shadow: 2px 2px 0 #212282;'
);
console.log(
    '%cReal Local Flavor - Coming Soon...',
    'font-size: 16px; color: #E6411C;'
);
console.log(
    '%cInterested in working with us? Contact: hello@9yards.com',
    'font-size: 12px; color: #999;'
);

// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for any initial animations
    document.body.classList.add('loaded');
    
    // Preload optimization
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('load', () => {
            logo.classList.add('loaded');
        });
    }
});
