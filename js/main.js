/**
 * LONEWOLF PORTFOLIO - CORE APPLICATION SCRIPT
 * Handles navigation, interactive modals, scroll reveals, video overlay, and contact actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initInteractiveBackground();
  initNavigation();
  initScrollObserver();
  initVideoPlayer();
  initProjectModal();
  initContactActions();
  initContactForm();
});

/* ==========================================================================
   INTERACTIVE CONSTELLATION & CURSOR FOLLOWER
   ========================================================================== */
function initInteractiveBackground() {
  const canvas = document.getElementById('bgCanvas');
  const cursorGlow = document.getElementById('cursorGlow');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: -1000, y: -1000, radius: 150, isActive: false };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = width < 768 ? 30 : 65;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.5 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Mouse & Touch tracking for cursor follower and reactive constellation
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isActive = true;

    if (cursorGlow) {
      cursorGlow.style.left = `${mouse.x}px`;
      cursorGlow.style.top = `${mouse.y}px`;
      cursorGlow.style.opacity = '1';
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.isActive = false;
    mouse.x = -1000;
    mouse.y = -1000;
    if (cursorGlow) cursorGlow.style.opacity = '0';
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.isActive = true;
      if (cursorGlow) {
        cursorGlow.style.left = `${mouse.x}px`;
        cursorGlow.style.top = `${mouse.y}px`;
        cursorGlow.style.opacity = '1';
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.isActive = false;
    if (cursorGlow) cursorGlow.style.opacity = '0';
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Natural movement
      p.x += p.vx;
      p.y += p.vy;

      // Screen boundary wrap
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Twinkle animation
      p.pulseAngle += p.pulseSpeed;
      const currentAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.2;

      // Draw particle star
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(50, 130, 224, ${Math.max(0.1, currentAlpha)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#3282E0';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Particle to Particle Constellation lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(44, 77, 144, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Particle to Cursor Reactive lines & gentle push
      if (mouse.isActive) {
        const dmx = p.x - mouse.x;
        const dmy = p.y - mouse.y;
        const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);

        if (mouseDist < mouse.radius) {
          // Draw reactive beam
          const beamAlpha = (1 - mouseDist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(50, 130, 224, ${beamAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Subtle gentle magnetic/repel force
          p.x += (dmx / mouseDist) * 0.4;
          p.y += (dmy / mouseDist) * 0.4;
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const headerLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu when clicking any nav link
    headerLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link highlighter on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   INTERSECTION OBSERVER - SCROLL REVEALS & SKILL BARS
   ========================================================================== */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => bar.classList.add('animated'));
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }
}

/* ==========================================================================
   PROMOTIONAL VIDEO CONTROLLER
   ========================================================================== */
function initVideoPlayer() {
  const videoWrapper = document.getElementById('videoWrapper');
  const promoVideo = document.getElementById('promoVideo');
  const videoOverlay = document.getElementById('videoOverlay');

  if (!videoWrapper || !promoVideo || !videoOverlay) return;

  videoOverlay.addEventListener('click', () => {
    videoOverlay.style.display = 'none';
    promoVideo.controls = true;
    const playPromise = promoVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or video not loaded yet
        console.log('Video placeholder clicked. Ready for user video source.');
      });
    }
  });

  promoVideo.addEventListener('pause', () => {
    if (promoVideo.currentTime === 0) {
      videoOverlay.style.display = 'flex';
      promoVideo.controls = false;
    }
  });
}

/* ==========================================================================
   PORTFOLIO DETAIL MODAL
   ========================================================================== */
const projectData = {
  1: {
    title: 'Enterprise Analytics Portal',
    badge: 'Full-Stack Web App',
    image: 'assets/images/project1.svg',
    tags: ['HTML5', 'Modern CSS', 'JavaScript', 'REST APIs'],
    desc: 'A comprehensive web dashboard built to monitor cloud resources and service metrics in real time. Designed with responsive layouts, customizable KPI cards, and smooth data visual transitions.'
  },
  2: {
    title: 'Workflow Automation Dashboard',
    badge: 'Frontend / UI Design',
    image: 'assets/images/project2.svg',
    tags: ['Modular JS', 'SVG Charts', 'Glassmorphism', 'UI/UX'],
    desc: 'An automated workflow monitor allowing engineering teams to visualize CI/CD pipelines, track job execution times, and export performance reports with instant feedback.'
  },
  3: {
    title: 'Adaptive Multi-Device Interface',
    badge: 'Mobile First Solution',
    image: 'assets/images/project3.svg',
    tags: ['Responsive Layout', 'CSS Grid', 'Touch Gestures', 'PWA Ready'],
    desc: 'A mobile-optimized client application built with seamless gesture navigation, touch-friendly UI components, and accessible color schemes tested across multiple screen resolutions.'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalTags = document.getElementById('modalTags');
  const modalDesc = document.getElementById('modalDesc');

  if (!modal) return;

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (data) {
        modalImg.src = data.image;
        modalImg.alt = data.title;
        modalTitle.textContent = data.title;
        modalBadge.textContent = data.badge;
        modalDesc.textContent = data.desc;

        modalTags.innerHTML = '';
        data.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'project-tag';
          span.textContent = tag;
          modalTags.appendChild(span);
        });

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   CONTACT ACTIONS & CLIPBOARD TOAST
   ========================================================================== */
function initContactActions() {
  const copyButtons = document.querySelectorAll('.copy-trigger');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Information';

      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`${label} copied to clipboard`);
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`);
        });
      } else {
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) return;

  const toastMessage = document.getElementById('toastMessage');
  if (toastMessage) {
    toastMessage.textContent = message;
  }

  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================================
   CONTACT FORM MOCKUP
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');

    status.className = 'form-status success';
    status.textContent = `Thank you, ${nameInput.value.trim() || 'friend'}. Your message has been sent successfully.`;
    form.reset();

    setTimeout(() => {
      status.className = 'form-status';
      status.style.display = 'none';
    }, 5000);
  });
}
