/**
 * ETTA Trading Corporation - Main JavaScript
 * Dynamic content loading from content/site.json
 */

// Global state
let siteData = null;
let galleryImages = [];
let currentLightboxIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSiteData();
  initNavigation();
  initScrollEffects();
  initLightbox();
});

// Load site data from JSON
async function loadSiteData() {
  try {
    const response = await fetch('content/site.json');
    if (!response.ok) throw new Error('Failed to load site data');
    siteData = await response.json();
    renderAllSections();
  } catch (error) {
    console.error('Error loading site data:', error);
    // Fallback: show error message
    document.body.innerHTML = '<div style="padding:2rem;text-align:center"><h1>Unable to load content</h1><p>Please check that content/site.json exists.</p></div>';
  }
}

// Render all sections
function renderAllSections() {
  if (!siteData) return;

  renderNavigation();
  renderHero();
  renderAbout();
  renderProducts();
  renderOperations();
  renderSustainability();
  renderLeadership();
  renderGallery();
  renderContact();
  renderFooter();
}

// ============================================
// NAVIGATION
// ============================================
function renderNavigation() {
  const navMenu = document.getElementById('nav-menu');
  if (!navMenu || !siteData.nav) return;

  navMenu.innerHTML = siteData.nav.links.map(link => {
    if (link.dropdown) {
      return `
        <li class="nav-dropdown">
          <a href="${link.url}">${link.label} <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-left:4px"><path d="M1 3l4 4 4-4"/></svg></a>
          <div class="nav-dropdown-menu">
            ${link.dropdown.map(sub => `<a href="${sub.url}">${sub.label}</a>`).join('')}
          </div>
        </li>
      `;
    }
    return `<li><a href="${link.url}">${link.label}</a></li>`;
  }).join('');

  // Update page title
  if (siteData.site) {
    document.title = siteData.site.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && siteData.site.description) {
      metaDesc.setAttribute('content', siteData.site.description);
    }
  }
}

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Sticky navbar effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ============================================
// HERO SECTION
// ============================================
function renderHero() {
  const hero = siteData.hero;
  if (!hero) return;

  const bg = document.getElementById('hero-bg');
  const eyebrow = document.getElementById('hero-eyebrow');
  const headline = document.getElementById('hero-headline');
  const subheadline = document.getElementById('hero-subheadline');
  const ctaPrimary = document.getElementById('hero-cta-primary');
  const ctaSecondary = document.getElementById('hero-cta-secondary');
  const stats = document.getElementById('hero-stats');

  if (bg && hero.background_image) {
    bg.style.backgroundImage = `url('${hero.background_image}')`;
  }

  if (eyebrow) eyebrow.textContent = siteData.site?.tagline || '';
  if (headline) headline.textContent = hero.headline || '';
  if (subheadline) subheadline.textContent = hero.subheadline || '';

  if (ctaPrimary && hero.cta_primary) {
    ctaPrimary.textContent = hero.cta_primary.label;
    ctaPrimary.href = hero.cta_primary.url;
  }

  if (ctaSecondary && hero.cta_secondary) {
    ctaSecondary.textContent = hero.cta_secondary.label;
    ctaSecondary.href = hero.cta_secondary.url;
  }

  if (stats && hero.stats) {
    stats.innerHTML = hero.stats.map(stat => `
      <div class="stat-item fade-in">
        <span class="stat-number">${stat.number}</span>
        <span class="stat-label">${stat.label}</span>
      </div>
    `).join('');
  }
}

// ============================================
// ABOUT SECTION
// ============================================
function renderAbout() {
  const about = siteData.about;
  if (!about) return;

  const eyebrow = document.getElementById('about-eyebrow');
  const headline = document.getElementById('about-headline');
  const content = document.getElementById('about-content');
  const values = document.getElementById('about-values');
  const image = document.getElementById('about-image');

  if (eyebrow) eyebrow.textContent = about.eyebrow || '';
  if (headline) headline.textContent = about.headline || '';
  if (content) content.textContent = about.content || '';

  if (image && about.image) {
    image.src = about.image;
    image.alt = 'ETTA Trading Corporation';
  }

  if (values && about.values) {
    values.innerHTML = about.values.map((value, i) => `
      <div class="value-card fade-in stagger-${i + 1}">
        <h4>${value.title}</h4>
        <p>${value.description}</p>
      </div>
    `).join('');
  }
}

// ============================================
// PRODUCTS SECTION
// ============================================
function renderProducts() {
  const products = siteData.products;
  if (!products) return;

  const eyebrow = document.getElementById('products-eyebrow');
  const headline = document.getElementById('products-headline');
  const description = document.getElementById('products-description');
  const grid = document.getElementById('products-grid');

  if (eyebrow) eyebrow.textContent = products.eyebrow || '';
  if (headline) headline.textContent = products.headline || '';
  if (description) description.textContent = products.description || '';

  if (grid && products.items) {
    grid.innerHTML = products.items.map((product, i) => `
      <div class="product-card fade-in stagger-${(i % 4) + 1}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-category">${product.category}</span>
        </div>
        <div class="product-content">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-specs">
            ${product.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// OPERATIONS SECTION
// ============================================
function renderOperations() {
  const operations = siteData.operations;
  if (!operations) return;

  const eyebrow = document.getElementById('operations-eyebrow');
  const headline = document.getElementById('operations-headline');
  const description = document.getElementById('operations-description');
  const steps = document.getElementById('operations-steps');
  const image = document.getElementById('operations-image');

  if (eyebrow) eyebrow.textContent = operations.eyebrow || '';
  if (headline) headline.textContent = operations.headline || '';
  if (description) description.textContent = operations.description || '';

  if (image && operations.image) {
    image.src = operations.image;
    image.alt = 'ETTA Operations';
  }

  if (steps && operations.steps) {
    steps.innerHTML = operations.steps.map((step, i) => `
      <div class="step-card fade-in stagger-${(i % 5) + 1}">
        <span class="step-number">${step.number}</span>
        <div class="step-content">
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// SUSTAINABILITY SECTION
// ============================================
function renderSustainability() {
  const sustainability = siteData.sustainability;
  if (!sustainability) return;

  const eyebrow = document.getElementById('sustainability-eyebrow');
  const headline = document.getElementById('sustainability-headline');
  const description = document.getElementById('sustainability-description');
  const grid = document.getElementById('sustainability-grid');

  if (eyebrow) eyebrow.textContent = sustainability.eyebrow || '';
  if (headline) headline.textContent = sustainability.headline || '';
  if (description) description.textContent = sustainability.description || '';

  const icons = {
    tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/><path d="M12 8v14M8 14h8"/></svg>',
    education: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    community: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  };

  if (grid && sustainability.initiatives) {
    grid.innerHTML = sustainability.initiatives.map((item, i) => `
      <div class="sustainability-card fade-in stagger-${(i % 4) + 1}">
        <div class="sustainability-icon">${icons[item.icon] || icons.tree}</div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    `).join('');
  }
}

// ============================================
// LEADERSHIP SECTION
// ============================================
function renderLeadership() {
  const leadership = siteData.leadership;
  if (!leadership) return;

  const eyebrow = document.getElementById('leadership-eyebrow');
  const headline = document.getElementById('leadership-headline');
  const description = document.getElementById('leadership-description');
  const ceoProfile = document.getElementById('ceo-profile');
  const teamGrid = document.getElementById('team-grid');

  if (eyebrow) eyebrow.textContent = leadership.eyebrow || '';
  if (headline) headline.textContent = leadership.headline || '';
  if (description) description.textContent = leadership.description || '';

  if (ceoProfile && leadership.ceo) {
    const ceo = leadership.ceo;
    ceoProfile.innerHTML = `
      <div class="ceo-image">
        <img src="${ceo.image}" alt="${ceo.name}" loading="lazy">
      </div>
      <div class="ceo-content">
        <span class="ceo-badge">Founder & CEO</span>
        <h3>${ceo.name}</h3>
        <p class="ceo-title">${ceo.title}</p>
        <p class="ceo-bio">${ceo.bio}</p>
      </div>
    `;
  }

  if (teamGrid && leadership.team) {
    teamGrid.innerHTML = leadership.team.map((member, i) => `
      <div class="team-card fade-in stagger-${(i % 3) + 1}">
        <img src="${member.image}" alt="${member.name}" loading="lazy">
        <div class="team-info">
          <h4>${member.name}</h4>
          <p class="team-title">${member.title}</p>
          <p>${member.bio}</p>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// GALLERY SECTION
// ============================================
function renderGallery() {
  const gallery = siteData.gallery;
  if (!gallery) return;

  const eyebrow = document.getElementById('gallery-eyebrow');
  const headline = document.getElementById('gallery-headline');
  const description = document.getElementById('gallery-description');
  const grid = document.getElementById('gallery-grid');

  if (eyebrow) eyebrow.textContent = gallery.eyebrow || '';
  if (headline) headline.textContent = gallery.headline || '';
  if (description) description.textContent = gallery.description || '';

  if (grid && gallery.images) {
    galleryImages = gallery.images;
    grid.innerHTML = gallery.images.map((img, i) => `
      <div class="gallery-item fade-in" data-index="${i}" onclick="openLightbox(${i})">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-caption">${img.caption}</span>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// CONTACT SECTION
// ============================================
function renderContact() {
  const contact = siteData.contact;
  if (!contact) return;

  const eyebrow = document.getElementById('contact-eyebrow');
  const headline = document.getElementById('contact-headline');
  const description = document.getElementById('contact-description');
  const info = document.getElementById('contact-info');
  const form = document.getElementById('contact-form');

  if (eyebrow) eyebrow.textContent = contact.eyebrow || '';
  if (headline) headline.textContent = contact.headline || '';
  if (description) description.textContent = contact.description || '';

  if (form && contact.formspree_endpoint) {
    form.action = contact.formspree_endpoint;
  }

  if (info && contact.info) {
    const icons = {
      address: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      hours: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    };

    let infoHTML = '';
    for (const [key, value] of Object.entries(contact.info)) {
      if (value) {
        infoHTML += `
          <div class="contact-info-item">
            <div class="contact-info-icon">${icons[key] || icons.address}</div>
            <div class="contact-info-content">
              <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
              <p>${value}</p>
            </div>
          </div>
        `;
      }
    }

    // Add social links
    if (contact.social) {
      infoHTML += '<div class="contact-social">';
      for (const [platform, url] of Object.entries(contact.social)) {
        if (url) {
          const socialIcons = {
            facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
            linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
            instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
          };
          infoHTML += `<a href="${url}" target="_blank" rel="noopener" class="social-link" aria-label="${platform}">${socialIcons[platform] || ''}</a>`;
        }
      }
      infoHTML += '</div>';
    }

    info.innerHTML = infoHTML;
  }
}

// ============================================
// FOOTER
// ============================================
function renderFooter() {
  const footer = siteData.footer;
  if (!footer) return;

  const tagline = document.getElementById('footer-tagline');
  const links = document.getElementById('footer-links');
  const social = document.getElementById('footer-social');
  const copyright = document.getElementById('footer-copyright');

  if (tagline) tagline.textContent = footer.tagline || '';
  if (copyright) copyright.textContent = footer.copyright || '';

  if (links && footer.links) {
    links.innerHTML = `
      <h4>Quick Links</h4>
      <ul>
        ${footer.links.map(link => `<li><a href="${link.url}">${link.label}</a></li>`).join('')}
      </ul>
    `;
  }

  // Social in footer
  const contact = siteData.contact;
  if (social && contact?.social) {
    let socialHTML = '<h4>Follow Us</h4><div class="footer-social-icons">';
    for (const [platform, url] of Object.entries(contact.social)) {
      if (url) {
        const icons = {
          facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
          linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
          instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
        };
        socialHTML += `<a href="${url}" target="_blank" rel="noopener" aria-label="${platform}">${icons[platform] || ''}</a>`;
      }
    }
    socialHTML += '</div>';
    social.innerHTML = socialHTML;
  }
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ============================================
// LIGHTBOX
// ============================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateLightbox(1));
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Close on background click
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!lightbox || !galleryImages[index]) return;

  currentLightboxIndex = index;
  const image = galleryImages[index];

  img.src = image.src;
  img.alt = image.alt;
  caption.textContent = image.caption;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction) {
  const newIndex = currentLightboxIndex + direction;
  if (newIndex >= 0 && newIndex < galleryImages.length) {
    openLightbox(newIndex);
  }
}

// Make functions globally accessible
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
