/* ============================================
   MAIN.JS — Adri Saha Portfolio
   All catchy interactions & animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 0. DARK / LIGHT MODE THEME TOGGLE
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      themeIcon.classList.remove('ri-sun-fill');
      themeIcon.classList.add('ri-moon-fill');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.remove('ri-moon-fill');
        themeIcon.classList.add('ri-sun-fill');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('ri-sun-fill');
        themeIcon.classList.add('ri-moon-fill');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ============================================
  // 1. CUSTOM CURSOR
  // ============================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && cursorDot && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth trailing ring
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .tilt-card, input, textarea, .social-link, .cert-item, .detail-item, .tag, .skill-tags span');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });
  }

  // ============================================
  // 2. PARTICLE NETWORK ANIMATION
  // ============================================
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        // Random color between violet and cyan
        this.hue = Math.random() > 0.5 ? 270 : 190;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Mouse interaction with particles
    let particleMouseX = 0, particleMouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      particleMouseX = e.clientX - rect.left;
      particleMouseY = e.clientY - rect.top;
    });

    function drawMouseConnections() {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - particleMouseX;
        const dy = particles[i].y - particleMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const opacity = (1 - dist / 200) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particleMouseX, particleMouseY);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      if (particleMouseX > 0 && particleMouseY > 0) {
        drawMouseConnections();
      }
      animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // ============================================
  // 3. TYPING EFFECT
  // ============================================
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const titles = [
      'SQA Engineer',
      'Researcher',
      'Data Science Graduate',
      'Automation Specialist',
      'AI Enthusiast'
        ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeText() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before new word
      }

      setTimeout(typeText, typingSpeed);
    }

    setTimeout(typeText, 1000);
  }

  // ============================================
  // 4. SCROLL REVEAL (Intersection Observer)
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — but we can if we want one-time animation
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // 5. ANIMATED COUNTERS
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
      }, duration / steps);
    });

    countersAnimated = true;
  }

  // Trigger counter animation when hero stats are visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  // ============================================
  // 6. EDUCATION BAR ANIMATION
  // ============================================
  const eduBars = document.querySelectorAll('.edu-bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = `${width}%`;
        entry.target.classList.add('animated');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  eduBars.forEach(bar => barObserver.observe(bar));

  // ============================================
  // 7. 3D TILT EFFECT ON CARDS
  // ============================================
  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  // ============================================
  // 8. MAGNETIC BUTTON EFFECT
  // ============================================
  if (!isTouchDevice) {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'none';
      });
    });
  }

  // ============================================
  // 9. NAVBAR SCROLL BEHAVIOR
  // ============================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function handleNavScroll() {
    const scrollY = window.scrollY;

    // Navbar glass effect
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ============================================
  // 10. MOBILE HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
      document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // 11. SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // 12. CONTACT FORM (Frontend only)
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;

      // Construct mailto link
      const mailtoLink = `mailto:sahaadri419@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Hi Adri,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;

      // Open mail client
      window.location.href = mailtoLink;

      // Show success feedback
      contactForm.innerHTML = `
        <div class="form-success">
          <i class="ri-check-double-line"></i>
          <h3>Opening Mail Client!</h3>
          <p>Your default email app should open shortly. If it doesn't, you can reach me directly at <a href="mailto:sahaadri419@gmail.com" style="color: var(--accent-secondary);">sahaadri419@gmail.com</a></p>
        </div>
      `;
    });
  }

  // ============================================
  // 13. PARALLAX FLOATING ELEMENTS
  // ============================================
  if (!isTouchDevice) {
    const floatingBadges = document.querySelectorAll('.floating-badge');

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      floatingBadges.forEach((badge, i) => {
        const speed = (i + 1) * 8;
        badge.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // ============================================
  // 14. CARD GLOW FOLLOW EFFECT
  // ============================================
  if (!isTouchDevice) {
    const glowCards = document.querySelectorAll('.project-card');

    glowCards.forEach(card => {
      const glow = card.querySelector('.project-card-glow');
      if (glow) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          glow.style.left = `${x - rect.width}px`;
          glow.style.top = `${y - rect.height}px`;
        });
      }
    });
  }

  // ============================================
  // 15. SCROLL INDICATOR HIDE ON SCROLL
  // ============================================
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    }, { passive: true });
  }

  // ============================================
  // 16. STAGGER ANIMATION FOR GRID ITEMS
  // ============================================
  const staggerGrids = document.querySelectorAll('.skills-grid, .projects-grid, .education-grid, .awards-grid, .training-grid');

  staggerGrids.forEach(grid => {
    const staggerObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const children = grid.querySelectorAll('.reveal');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
          child.classList.add('visible');
        });
        staggerObserver.disconnect();
      }
    }, { threshold: 0.1 });
    staggerObserver.observe(grid);
  });

  // ============================================
  // 17. CERT ITEMS STAGGER
  // ============================================
  const certGrid = document.querySelector('.cert-grid');
  if (certGrid) {
    const certObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const items = certGrid.querySelectorAll('.cert-item');
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, i * 80);
        });
        certObserver.disconnect();
      }
    }, { threshold: 0.2 });

    // Set initial state
    certGrid.querySelectorAll('.cert-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    certObserver.observe(certGrid);
  }

  // ============================================
  // 18. NAVBAR LOGO EASTER EGG
  // ============================================
  const navLogo = document.getElementById('navLogo');
  let clickCount = 0;

  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      clickCount++;
      if (clickCount >= 5) {
        document.body.style.animation = 'hueRotate 3s ease-in-out';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 3000);
        clickCount = 0;
      }
    });
  }

  // Add keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes hueRotate {
      0% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(180deg); }
      100% { filter: hue-rotate(0deg); }
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // 19. PRELOADER (graceful entry)
  // ============================================
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // ============================================
  // 20. KEYBOARD NAVIGATION ACCESSIBILITY
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Show cursor for keyboard users
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

});
