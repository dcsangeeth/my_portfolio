/* =====================================================================
   Portfolio Script – Dynamically renders all sections from
   data/portfolio-data.json. Theme, modals, filters, AOS init.
   ===================================================================== */

/* ─── THEME ─────────────────────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  if (themeIcon) themeIcon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('portfolio-theme', t);
}
applyTheme(localStorage.getItem('portfolio-theme') || 'light');
if (themeBtn) themeBtn.addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ─── NAVBAR ─────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
});
if (menuBtn) menuBtn.addEventListener('click', () => navLinks && navLinks.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
});

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── TYPING HERO TEXT ───────────────────────────────────────────── */
const roles = ['Electrical & Electronic Engineer', 'Flutter Mobile Developer', 'ML / AI Enthusiast', 'IoT Systems Developer'];
let ri = 0, ci = 0, typing = true;
const typedEl = document.getElementById('typedText');
function typeLoop() {
  if (!typedEl) return;
  if (typing) {
    if (ci < roles[ri].length) { typedEl.textContent = roles[ri].slice(0, ++ci); setTimeout(typeLoop, 60); }
    else { typing = false; setTimeout(typeLoop, 2200); }
  } else {
    if (ci > 0) { typedEl.textContent = roles[ri].slice(0, --ci); setTimeout(typeLoop, 35); }
    else { typing = true; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 300); }
  }
}
typeLoop();

/* ─── HIRE ME BUTTON ─────────────────────────────────────────────── */
const hireMeBtn = document.getElementById('hireMeBtn');
if (hireMeBtn) hireMeBtn.addEventListener('click', () => {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => openHireMeModal(), 600);
});

/* ─── SKILLS TABS ────────────────────────────────────────────────── */
document.querySelectorAll('.skill-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
  });
});

/* ─── SCROLL ARROWS (cert rows) ──────────────────────────────────── */
document.addEventListener('click', e => {
  const arrow = e.target.closest('.scroll-arrow');
  if (!arrow) return;
  const row = arrow.closest('.cert-row')?.querySelector('.cert-row-scroll');
  if (row) row.scrollBy({ left: arrow.classList.contains('left') ? -280 : 280, behavior: 'smooth' });
});

/* ─── MODALS ─────────────────────────────────────────────────────── */
// Generic close helpers
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('active'); m.style.opacity = '0'; setTimeout(() => m.style.display = 'none', 300); }
}
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.style.display = 'flex';
  requestAnimationFrame(() => { m.style.opacity = '1'; m.classList.add('active'); });
}

// Close on overlay click / Escape
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
});
document.querySelectorAll('.modal-close').forEach(btn =>
  btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')?.id)));

// Hire Me modal
function openHireMeModal() {
  const m = document.getElementById('hireMeModal');
  if (m) { m.style.display = 'flex'; requestAnimationFrame(() => m.classList.add('active')); }
}
document.getElementById('hireMeForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('hmName')?.value.trim();
  const email = document.getElementById('hmEmail')?.value.trim();
  const msg = document.getElementById('hmMessage')?.value.trim();
  if (!name || !email || !msg) return;
  alert(`Thanks ${name}! I'll get back to you at ${email} soon.`);
  closeModal('hireMeModal');
  e.target.reset();
});

// Experience modal (generic, populated by renderExperience)
function openExpModal(exp) {
  const m = document.getElementById('expModal');
  if (!m) return;
  document.getElementById('expModalTitle').textContent = exp.title || '';
  document.getElementById('expModalCompany').textContent = exp.company || '';
  document.getElementById('expModalPeriod').textContent = `${exp.period || ''} · ${exp.duration || ''}`;
  document.getElementById('expModalLocation').textContent = exp.location || '';
  document.getElementById('expModalType').textContent = exp.type || '';
  document.getElementById('expModalDesc').textContent = exp.desc || '';
  // Responsibilities
  const ul = document.getElementById('expModalResp');
  if (ul) {
    ul.innerHTML = (exp.responsibilities || '')
      .split('|').map(r => r.trim()).filter(Boolean)
      .map(r => `<li>${r}</li>`).join('');
  }
  // Tech badges
  const techDiv = document.getElementById('expModalTech');
  if (techDiv) {
    techDiv.innerHTML = (exp.tech || '').split(',')
      .map(t => `<span class="tech-badge">${t.trim()}</span>`).join('');
  }
  openModal('expModal');
}

// Cert modal
function openCertModal(cert) {
  const m = document.getElementById('certModal');
  if (!m) return;
  document.getElementById('certModalTitle').textContent = cert.title || '';
  document.getElementById('certModalIssuer').textContent = cert.issuer || '';
  document.getElementById('certModalDate').textContent = cert.date || '';
  document.getElementById('certModalDescription').textContent = cert.description || '';
  const ul = document.getElementById('certModalSkills');
  if (ul) {
    ul.innerHTML = (cert.skills || '').split(',')
      .map(s => `<li>${s.trim()}</li>`).join('');
  }
  const link = document.getElementById('certModalLink');
  if (link) { link.href = cert.link || '#'; link.style.display = cert.link && cert.link !== '#' ? '' : 'none'; }
  openModal('certModal');
}

/* ─── PROJECT FILTER ─────────────────────────────────────────────── */
let currentFilter = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    filterProjects();
  });
});
function filterProjects() {
  document.querySelectorAll('#projectsGrid .project-card').forEach(card => {
    const categories = (card.dataset.categories || '').split(',');
    const show = currentFilter === 'all' || categories.includes(currentFilter);
    card.style.display = show ? '' : 'none';
    // Highlight matching badge when filtered
    card.querySelectorAll('.project-category-badge').forEach(badge => {
      if (currentFilter === 'all') {
        badge.style.opacity = '1';
      } else {
        badge.style.opacity = badge.dataset.cat === currentFilter ? '1' : '0.35';
      }
    });
  });
}

/* ─── CONTACT FORM ───────────────────────────────────────────────── */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  if (btn) { btn.textContent = '✅ Message Sent!'; btn.disabled = true; }
  setTimeout(() => { if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; } e.target.reset(); }, 3000);
});

/* ═══════════════════════════════════════════════════════════════════
   JSON DATA LOADING & RENDERING
   ═════════════════════════════════════════════════════════════════ */

async function loadPortfolioData() {
  try {
    const res = await fetch('data/portfolio-data.json?_=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('portfolio-data.json not found, using hardcoded HTML.', e);
    return null;
  }
}

/* ── SKILLS ──────────────────────────────────────────────────────── */
function renderSkills(skills) {
  if (!skills) return;

  function skillCard(s) {
    const color = s.color || '#4361ee';
    return `<div class="skill-icon-card">
            <div class="skill-icon-wrap" style="background:linear-gradient(135deg,${color},${color}99)">
                <i class="${s.icon || 'fas fa-code'}"></i>
            </div>
            <h4>${s.name}</h4>
            <div class="skill-level-bar"><div class="skill-fill" style="width:${s.level || 0}%"></div></div>
            <span class="skill-percent">${s.level || 0}%</span>
        </div>`;
  }

  function softCard(s) {
    const color = s.color || '#4361ee';
    return `<div class="soft-skill-card">
            <div class="soft-skill-icon-new" style="background:linear-gradient(135deg,${color},${color}88)">
                <i class="${s.icon || 'fas fa-star'}"></i>
            </div>
            <div class="soft-skill-info">
                <h4>${s.name}</h4>
                <p>${s.desc || ''}</p>
            </div>
        </div>`;
  }

  const prog = document.getElementById('skills-programming');
  const fram = document.getElementById('skills-frameworks');
  const dom = document.getElementById('skills-domains');
  const soft = document.getElementById('skills-soft');

  if (prog && skills.programming?.length) prog.innerHTML = skills.programming.map(skillCard).join('');
  if (fram && skills.frameworks?.length) fram.innerHTML = skills.frameworks.map(skillCard).join('');
  if (dom && skills.domains?.length) dom.innerHTML = skills.domains.map(skillCard).join('');
  if (soft && skills.soft?.length) soft.innerHTML = skills.soft.map(softCard).join('');
}

/* ── EXPERIENCE ──────────────────────────────────────────────────── */
function renderExperience(experience) {
  const container = document.getElementById('experienceTimeline');
  if (!container || !experience?.length) return;
  container.innerHTML = experience.map((e, i) => `
        <div class="timeline-item clickable" data-aos="fade-right" data-aos-delay="${200 + i * 100}">
            <div class="timeline-dot pulse"></div>
            <div class="timeline-date"><span>${e.period || ''}</span></div>
            <div class="timeline-content" data-exp='${encodeURIComponent(JSON.stringify(e))}' onclick='openExpModal(JSON.parse(decodeURIComponent(this.getAttribute("data-exp"))))' style="cursor:pointer">
                <div class="exp-type-badge">${e.type || 'Work'}</div>
                <h3>${e.title || ''}</h3>
                <h4><i class="fas fa-building"></i> ${e.company || ''}</h4>
                <p class="timeline-preview">${e.desc || ''}</p>
                <div class="tech-stack">
                    ${(e.tech || '').split(',').slice(0, 4).map(t => `<span>${t.trim()}</span>`).join('')}
                </div>
                <button class="btn small-btn details-btn" data-exp='${encodeURIComponent(JSON.stringify(e))}' onclick='event.stopPropagation();openExpModal(JSON.parse(decodeURIComponent(this.getAttribute("data-exp"))))'>
                    <i class="fas fa-expand-alt"></i> View Full Details
                </button>
            </div>
        </div>`).join('');
}

/* ── CERTIFICATIONS ──────────────────────────────────────────────── */
function renderCertifications(certifications) {
  const container = document.getElementById('certRowContainer');
  if (!container || !certifications?.length) return;

  const priorities = ['high', 'medium', 'low'];
  const labelMap = { high: '🏅 High Priority', medium: '🎖 Medium Priority', low: '📜 Others' };
  const badgeClass = { high: 'high-badge', medium: 'medium-badge', low: 'low-badge' };

  let rowsHtml = '';
  priorities.forEach(p => {
    const certs = certifications.filter(c => c.priority === p);
    if (!certs.length) return;
    rowsHtml += `
        <div class="cert-row" data-priority-row="${p}">
            <div class="cert-row-label">
                <span class="row-badge ${badgeClass[p]}">${labelMap[p]}</span>
            </div>
            <div class="cert-row-scroll">
                ${certs.map(c => `
                <div class="certification-card clickable" data-priority="${p}"
                     data-cert='${encodeURIComponent(JSON.stringify(c))}' onclick='openCertModal(JSON.parse(decodeURIComponent(this.getAttribute("data-cert"))))'
                     style="cursor:pointer">
                    <div class="cert-priority-strip ${p}"></div>
                    <div class="cert-icon-wrap" style="color:${c.color || '#4361ee'}">
                        <i class="${c.icon || 'fas fa-certificate'}"></i>
                    </div>
                    <div class="cert-body">
                        <h3>${c.title}</h3>
                        <h4>${c.issuer}</h4>
                        <div class="cert-date"><i class="fas fa-calendar-alt"></i> ${c.date}</div>
                    </div>
                    <div class="cert-footer">
                        <span class="view-hint"><i class="fas fa-eye"></i> Click to view</span>
                    </div>
                </div>`).join('')}
            </div>
            <div class="scroll-indicator">
                <div class="scroll-arrow left"><i class="fas fa-chevron-left"></i></div>
                <div class="scroll-arrow right"><i class="fas fa-chevron-right"></i></div>
            </div>
        </div>`;
  });

  container.innerHTML = rowsHtml;
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid || !projects?.length) return;

  const catLabels = { mobile: 'Mobile', web: 'Web', iot: 'IoT', ai: 'AI & ML' };
  const catColors = { mobile: '#54C5F8', web: '#e63946', iot: '#00B894', ai: '#7209b7' };

  grid.innerHTML = projects.map((p, i) => {
    // Normalise category to always be an array
    const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
    const categoriesStr = cats.join(',');

    // Build badges HTML (one per category)
    const badgesHtml = cats.map(cat =>
      `<div class="project-category-badge" data-cat="${cat}" style="background:${catColors[cat] || '#4361ee'}">${catLabels[cat] || cat}</div>`
    ).join('');

    return `
        <div class="project-card" data-categories="${categoriesStr}" data-aos="fade-up" data-aos-delay="${300 + i * 100}"
             data-project-page="${p.demo || '#'}">
            <div class="project-img">
                <img src="images/${p.image || 'profile.jpg'}" alt="${p.title}" onerror="this.src='images/profile.jpg'">
                <div class="project-overlay">
                    <div class="overlay-content">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View Details</span>
                    </div>
                </div>
                <div class="project-badges">${badgesHtml}</div>
            </div>
            <div class="project-info">
                <h3>${p.title}</h3>
                <p>${p.desc || ''}</p>
                <div class="project-tech">
                    ${(p.tech || '').split(',').slice(0, 3).map(t => `<span>${t.trim()}</span>`).join('')}
                </div>
                ${p.demo ? `<button class="btn small-btn view-project-btn" data-page="${p.demo}">
                    <i class="fas fa-arrow-right"></i> View Project
                </button>` : ''}
            </div>
        </div>`;
  }).join('');

  // Attach click handlers
  grid.querySelectorAll('.project-card, .view-project-btn').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.page || el.closest('.project-card')?.dataset.projectPage;
      if (page && page !== '#') window.open(page, '_blank');
    });
  });
  filterProjects();
}

/* ── EDUCATION ───────────────────────────────────────────────────── */
function renderEducation(education) {
  const grid = document.getElementById('educationGrid');
  if (!grid || !education?.length) return;

  // Check which existing CSS class is available
  grid.innerHTML = education.map((e, i) => `
        <div class="edu-card" data-aos="fade-up" data-aos-delay="${200 + i * 100}">
            <div class="edu-icon-wrap">
                <i class="${e.icon || 'fas fa-graduation-cap'}"></i>
            </div>
            <div class="edu-info">
                <span class="edu-period">${e.period || ''}</span>
                <h3>${e.degree || ''}</h3>
                <h4><i class="fas fa-map-marker-alt"></i> ${e.institution || ''}</h4>
                <p>${e.desc || ''}</p>
            </div>
        </div>`).join('');
}

/* ── MAIN INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  // Init AOS
  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 80 });

  // Load JSON data and render all dynamic sections
  const data = await loadPortfolioData();
  if (data) {
    renderSkills(data.skills);
    renderExperience(data.experience);
    renderCertifications(data.certifications);
    renderProjects(data.projects);
    renderEducation(data.education);

    // Update hero meta info if present
    if (data.meta) {
      const cvLink = document.querySelector('a[href*="DC_Sangeeth_CV"]');
      if (cvLink && data.meta.cv) cvLink.href = data.meta.cv;
    }

    // Re-init AOS after dynamic content
    if (typeof AOS !== 'undefined') AOS.refreshHard();
  }
});

/* ─── LOADING INDICATOR CSS (injected once) ─────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `.loading-indicator{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px;color:var(--text-muted);font-size:.95rem;grid-column:1/-1;width:100%}`;
  document.head.appendChild(style);
})();