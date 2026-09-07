/* ==========================================================================
   CODEVERTEX - INTERACTIVE JAVASCRIPT ENGINE
   Canvas Mesh, Typing Effects, 3D Tilt, Filters, Modals & Cost Calculator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initParticleCanvas();
  initTypingEffect();
  initNavbarScroll();
  initProjectFilters();
  initProjectModals();
  init3DTilt();
  initCostCalculator();
  initContactForm();
  initBackToTop();
  initMobileNav();
  initSmoothScroll();
});

/* ==========================================================================
   1. Interactive Particle Canvas Constellation
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(99, 102, 241, ';
      this.alpha = Math.random() * 0.5 + 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: null, y: null, maxDist: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.16 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.32 * (1 - mdist / mouse.maxDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Dynamic Typing Effect for Hero Title
   ========================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const roles = [
    'Full-Stack Web Developer',
    'SaaS & CRM Architect',
    'Luxury E-Commerce Builder',
    'Growth System Designer',
    'Modern UI/UX Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. Navbar Scroll & Blur Spy
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Project Filtering Logic
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Project Quick-View Modals (With Real Screenshots & Accurate Specs)
   ========================================================================== */
const projectsData = {
  digidaily: {
    title: 'DigiDaily - True Solutions Growth Agency',
    category: 'Growth Marketing & Metrics Platform',
    url: 'https://digidaily.in/',
    image: 'assets/images/digidaily.png',
    overview: 'A high-converting business growth system and agency platform featuring live metric dashboards (₹2.5Cr+ generated revenue, 4.6x ROAS), performance marketing audits, and lead optimization funnels.',
    features: [
      'Interactive Live Growth Metrics widget & dynamic trend visualization',
      'Free Growth Audit scheduling system & conversion funnel',
      'Search Everything engine with instant resource discovery',
      'High-converting landing page layout tailored for D2C brands & startups',
      'Sub-second page load times with 98+ Google Lighthouse performance'
    ],
    tech: ['HTML5', 'Modern CSS3', 'JavaScript ES6+', 'Growth Analytics', 'SEO Schema', 'CDN Caching']
  },
  perfumes: {
    title: 'King Perfumes - Luxury Fragrance Web App',
    category: 'Luxury E-Commerce & Retail',
    url: 'https://king-perfumes.vercel.app/',
    image: 'assets/images/king-perfumes.png',
    overview: 'An elegant, nature-powered luxury fragrance web store ("Nourish Your Senses, Naturally"). Features a high-fashion botanical aesthetic, seamless product exploration, quick cart, and Vercel edge deployment.',
    features: [
      'Minimalist botanical UI with high-definition product visualizer',
      'Live ticker banner with free shipping and discount alerts',
      'Frictionless shopping bag management and instant checkout workflow',
      'Mobile-optimized touch carousel and scent ingredient breakdowns',
      'Ultra-fast client-side routing on Vercel infrastructure'
    ],
    tech: ['React.js / Next.js', 'Vercel Edge', 'Modern CSS', 'State Management', 'Web Cart API']
  },
  breezerland: {
    title: 'Breezerland - Perfume Manufacturer & B2B Portal',
    category: 'B2B Perfume Manufacturing & Export',
    url: 'https://breezerland.in/',
    image: 'assets/images/breezerland.png',
    overview: 'The official digital presence for Breezerland Perfumes (Based in Rajkot, Gujarat — Est. 2020), showcasing industrial manufacturing infrastructure, global export capabilities, product catalogue, and direct WhatsApp / Call connect.',
    features: [
      'Interactive WhatsApp & Direct Call multi-channel inquiry popup',
      'B2B manufacturing infrastructure, laboratory & distillation process showcase',
      'Export and international quality compliance certification pages',
      'Comprehensive fragrance formulations & private label catalogue',
      'Fast responsive architecture with zero layout shift'
    ],
    tech: ['JavaScript', 'Responsive UI', 'WhatsApp Booking API', 'CSS Grid & Flexbox', 'B2B Lead Flow']
  },
  jewels: {
    title: 'Madhav Jewels - Fine Jewelry Boutique Gallery',
    category: 'Fine Gold & Antique Jewelry',
    url: 'https://madhavjewels.co.in/',
    image: 'assets/images/madhav-jewels.png',
    overview: 'A luxury digital showcase and catalogue for Madhav Jewels, featuring categorized antique gold jewellery, bridal polki collections, solitaire rings, bangles, and handcrafted necklaces with high-resolution inspection.',
    features: [
      'Multi-tier category filter matrix (Women, Men, Kids, Rings, Necklaces, Bracelets, Bangles, Earrings)',
      'High-definition carousel photo viewer for intricate craftsmanship',
      'Bespoke bridal consultation & direct showroom inquiry trigger',
      'Warm luxury champagne & rose-gold aesthetic tailored for high-end buyers',
      'Optimized image compression for instant mobile catalogue browsing'
    ],
    tech: ['JavaScript', 'CSS3 Glassmorphism', 'Catalogue API', 'SEO Rich Snippets', 'Gallery Slider']
  },
  crm: {
    title: 'FinDoc CRM (CRM v4 Growth) - SaaS Platform',
    category: 'Enterprise SaaS & Financial CRM',
    url: 'https://crmv4growth.in/login',
    image: 'assets/images/findoc-crm.png',
    overview: 'A complete enterprise CRM system for Financial & Document Services (Loans, Tax Services, Passport, Insurance, RTO, Credit Cards). Features secure authentication, client document management, and lead tracking pipelines.',
    features: [
      'Secure multi-service client login & session management',
      'Categorized pipelines for Loans, Tax, Passport, Insurance, RTO & Credit Cards',
      'Visual deal stage progression & automated client communication',
      'Centralized document upload, KYC verification & status tracking',
      'High-security encryption & role-based dashboard access'
    ],
    tech: ['Full-Stack SaaS', 'Secure Auth', 'Financial Pipeline', 'REST APIs', 'SQL Database', 'Cloud Server']
  },
  codevertex: {
    title: 'CodeVertex Digital Studio & Custom Labs',
    category: 'Custom Full-Stack Engineering',
    url: 'https://codevertex.dev',
    image: 'assets/images/project-codevertex.svg',
    overview: 'Custom next-generation web architectures, bespoke client applications, and web performance engineering delivered by Dharam Bhojani under the CodeVertex brand.',
    features: [
      'GPU-accelerated micro-animations & custom canvas backgrounds',
      'Full-stack architecture configured for maximum SEO & conversion speed',
      'Modular component design for rapid scalability',
      'Direct client communication portals and custom API integrations',
      'Guaranteed 99.9% uptime and zero-latency performance'
    ],
    tech: ['Full-Stack Web', 'Canvas API', 'Modern CSS', 'Performance Tuning', 'Cloud CI/CD']
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalOverview = document.getElementById('modal-overview');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const modalLink = document.getElementById('modal-link');

  if (!modalOverlay) return;

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectsData[projectId];
      if (!data) return;

      modalImg.src = data.image;
      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalOverview.textContent = data.overview;

      modalFeatures.innerHTML = '';
      data.features.forEach((feat) => {
        const li = document.createElement('li');
        li.className = 'service-feature-item';
        li.innerHTML = `<i class="fa-solid fa-check text-cyan"></i> <span>${feat}</span>`;
        modalFeatures.appendChild(li);
      });

      modalTech.innerHTML = '';
      data.tech.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = t;
        modalTech.appendChild(span);
      });

      modalLink.href = data.url;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   6. 3D Card Tilt Hover Physics
   ========================================================================== */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-card');
  if (window.innerWidth < 1024) return;

  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   7. Interactive Project Cost Estimator & WhatsApp Generator
   ========================================================================== */
function initCostCalculator() {
  const typeChips = document.querySelectorAll('.calc-type-chip');
  const pageChips = document.querySelectorAll('.calc-page-chip');
  const urgencyChips = document.querySelectorAll('.calc-urgency-chip');
  const featureChecks = document.querySelectorAll('.calc-feature-check');

  const priceValEl = document.getElementById('calc-price-val');
  const timelineValEl = document.getElementById('calc-timeline-val');
  const whatsappQuoteBtn = document.getElementById('whatsapp-quote-btn');
  const breakdownType = document.getElementById('breakdown-type');
  const breakdownPages = document.getElementById('breakdown-pages');
  const breakdownFeatures = document.getElementById('breakdown-features');
  const breakdownSpeed = document.getElementById('breakdown-speed');

  if (!priceValEl) return;

  let selectedType = { name: 'Business / Portfolio Website', base: 14999, days: 5 };
  let selectedPages = { name: '1 - 5 Custom Pages', multiplier: 1, addDays: 0 };
  let selectedUrgency = { name: 'Standard Delivery', multiplier: 1, subDays: 0 };
  let selectedFeatures = [];

  function calculate() {
    let basePrice = selectedType.base;
    let days = selectedType.days + selectedPages.addDays;

    let featuresCost = 0;
    selectedFeatures = [];
    featureChecks.forEach((chk) => {
      if (chk.checked) {
        const cost = parseInt(chk.getAttribute('data-cost'), 10);
        const name = chk.getAttribute('data-name');
        featuresCost += cost;
        selectedFeatures.push(name);
      }
    });

    let totalPrice = (basePrice * selectedPages.multiplier + featuresCost) * selectedUrgency.multiplier;
    let finalDays = Math.max(3, Math.round(days * (selectedUrgency.multiplier > 1 ? 0.65 : 1)));

    const formattedMin = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(totalPrice));
    const formattedMax = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(totalPrice * 1.2));

    priceValEl.textContent = `${formattedMin} - ${formattedMax}`;
    timelineValEl.textContent = `⏱️ Estimated Delivery: ${finalDays} - ${finalDays + 4} Working Days`;

    if (breakdownType) breakdownType.textContent = selectedType.name;
    if (breakdownPages) breakdownPages.textContent = selectedPages.name;
    if (breakdownFeatures) breakdownFeatures.textContent = selectedFeatures.length > 0 ? `${selectedFeatures.length} Add-ons Selected` : 'None';
    if (breakdownSpeed) breakdownSpeed.textContent = selectedUrgency.name;

    const msg = `Hi Dharam! I used your CodeVertex website cost estimator. Here is my project scope:
- Project Type: ${selectedType.name}
- Page Count: ${selectedPages.name}
- Features: ${selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Standard Features'}
- Speed: ${selectedUrgency.name}
- Estimated Budget Range: ${formattedMin} - ${formattedMax}

I would like to discuss and get started!`;

    if (whatsappQuoteBtn) {
      whatsappQuoteBtn.href = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
    }
  }

  typeChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      typeChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedType = {
        name: chip.getAttribute('data-name'),
        base: parseInt(chip.getAttribute('data-base'), 10),
        days: parseInt(chip.getAttribute('data-days'), 10)
      };
      calculate();
    });
  });

  pageChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      pageChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedPages = {
        name: chip.getAttribute('data-name'),
        multiplier: parseFloat(chip.getAttribute('data-mult')),
        addDays: parseInt(chip.getAttribute('data-add-days'), 10)
      };
      calculate();
    });
  });

  urgencyChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      urgencyChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedUrgency = {
        name: chip.getAttribute('data-name'),
        multiplier: parseFloat(chip.getAttribute('data-mult'))
      };
      calculate();
    });
  });

  featureChecks.forEach((chk) => {
    chk.addEventListener('change', calculate);
  });

  calculate();
}

/* ==========================================================================
   8. Contact Form Handling & Copy Email Toast
   ========================================================================== */
function showToast(message, isError = false) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation text-danger' : 'fa-circle-check text-cyan'}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', true);
        return;
      }

      showToast(`Thank you, ${name}! Your project inquiry has been prepared.`);
      form.reset();

      const mailtoLink = `mailto:codevertex.dev@gmail.com?subject=New Inquiry from ${encodeURIComponent(name)} [${encodeURIComponent(service)}]&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${message}`)}`;
      window.open(mailtoLink, '_blank');
    });
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'codevertex.dev@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard: codevertex.dev@gmail.com');
      }).catch(() => {
        showToast('Email: codevertex.dev@gmail.com');
      });
    });
  }
}

/* ==========================================================================
   9. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. Mobile Menu Toggle
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}

/* ==========================================================================
   11. Smooth Scrolling for Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
