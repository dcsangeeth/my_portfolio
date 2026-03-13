"""
Replaces hardcoded HTML sections in index.html with
empty containers that script.js will populate from JSON.
Also adds the Export JSON button to admin.html nav.
"""
import re

# ─── 1. INDEX.HTML ─────────────────────────────────────────────────────────────
with open(r'd:\Projects\Portfollio\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ---- SKILLS: replace all 4 panels content with single loading div ----
# Replace the whole skills content block (panels) but keep the tabs + outer divs
SKILLS_PANEL_BLOCK = re.search(
    r'<!-- Programming Languages -->.*?(?=</section>\s*<!-- ={5,} EXPERIENCE)',
    html, re.DOTALL
)
if SKILLS_PANEL_BLOCK:
    new_skills_panels = """            <!-- Skill panels rendered dynamically from data/portfolio-data.json -->
            <div class="skills-panel active" id="tab-programming" data-aos="fade-up" data-aos-delay="200">
                <div class="skills-icon-grid" id="skills-programming"><div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading...</div></div>
            </div>
            <div class="skills-panel" id="tab-frameworks" data-aos="fade-up" data-aos-delay="200">
                <div class="skills-icon-grid" id="skills-frameworks"></div>
            </div>
            <div class="skills-panel" id="tab-domains" data-aos="fade-up" data-aos-delay="200">
                <div class="skills-icon-grid" id="skills-domains"></div>
            </div>
            <div class="skills-panel" id="tab-soft" data-aos="fade-up" data-aos-delay="200">
                <div class="soft-skills-grid-new" id="skills-soft"></div>
            </div>
        </div>
    </section>

"""
    html = html[:SKILLS_PANEL_BLOCK.start()] + new_skills_panels + html[SKILLS_PANEL_BLOCK.end():]
    print("✅ Skills panels replaced")
else:
    print("⚠️  Skills panel block not found — check manually")

# ---- EXPERIENCE: replace timeline items ----
EXP_MATCH = re.search(
    r'<div class="timeline">.*?</div>\s*</div>\s*</section>\s*<!-- ={5,} CERTIFICATIONS',
    html, re.DOTALL
)
if EXP_MATCH:
    new_exp = """<div class="timeline" id="experienceTimeline">
                <div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
            </div>
        </div>
    </section>

"""
    html = html[:EXP_MATCH.start()] + new_exp + html[EXP_MATCH.end():]
    print("✅ Experience timeline replaced")
else:
    print("⚠️  Experience block not found — check manually")

# ---- CERTIFICATIONS: replace cert rows ----
CERT_MATCH = re.search(
    r'<div class="certifications-carousel"[^>]*>.*?</div>\s*</div>\s*</section>\s*<!-- ={5,} PROJECTS',
    html, re.DOTALL
)
if CERT_MATCH:
    new_cert = """<div class="certifications-carousel" id="certsCarousel" data-aos="fade-up" data-aos-delay="200">
                <div class="row-container" id="certRowContainer">
                    <div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
                </div>
            </div>
        </div>
    </section>

"""
    html = html[:CERT_MATCH.start()] + new_cert + html[CERT_MATCH.end():]
    print("✅ Certifications carousel replaced")
else:
    print("⚠️  Certifications block not found — check manually")

# ---- PROJECTS GRID: already has id="projectsGrid" — just clear inner content ----
PROJ_MATCH = re.search(
    r'(<div class="projects-grid" id="projectsGrid">).*?(</div>\s*</div>\s*</section>\s*<!-- ={5,} EDUCATION)',
    html, re.DOTALL
)
if PROJ_MATCH:
    new_proj = (PROJ_MATCH.group(1) +
        '\n                <!-- Project cards rendered dynamically from data/portfolio-data.json -->\n                <div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading...</div>\n            ' +
        PROJ_MATCH.group(2))
    html = html[:PROJ_MATCH.start()] + new_proj + html[PROJ_MATCH.end():]
    print("✅ Projects grid cleared")
else:
    print("⚠️  Projects grid not found — check manually")

# ---- EDUCATION: find the timeline/cards and clear ----
EDU_MATCH = re.search(
    r'(<section id="education"[^>]*>.*?<div class="container">.*?)(<!-- .* education .*-->|<div class="edu)',
    html, re.DOTALL | re.IGNORECASE
)
# Alternative: find education section content div and clear
EDU_MATCH2 = re.search(
    r'(id="education"[^>]*>.*?<h2[^>]*>[^<]*<\/h2>.*?<div[^>]*>)\s*(<div class="edu|<div class="timeline)',
    html, re.DOTALL
)
if EDU_MATCH2:
    # Find the complete education section inner content
    # Just inject after the section title
    pass

# Find education section and replace it entirely
EDU_SECTION = re.search(
    r'<!-- ={5,} EDUCATION.*?<!-- ={5,} CONTACT',
    html, re.DOTALL
)
if EDU_SECTION:
    new_edu_section = """<!-- ========== EDUCATION SECTION ========== -->
    <section id="education" class="education">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Education</h2>
            <div class="education-grid" id="educationGrid" data-aos="fade-up" data-aos-delay="200">
                <div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
            </div>
        </div>
    </section>

    <!-- ========== CONTACT """
    html = html[:EDU_SECTION.start()] + new_edu_section + html[EDU_SECTION.end() - len('<!-- ========== CONTACT'):]
    print("✅ Education section replaced")
else:
    print("⚠️  Education section not found — check manually")

with open(r'd:\Projects\Portfollio\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n✅ index.html updated ({len(html)} chars)")

# ─── 2. ADMIN.HTML: add Export JSON button to nav ────────────────────────────
with open(r'd:\Projects\Portfollio\admin.html', 'r', encoding='utf-8') as f:
    admin = f.read()

OLD_NAV_RIGHT = '''<button class="nav-icon-btn" id="logoutBtn" title="Logout"><i
                            class="fas fa-sign-out-alt"></i></button>'''
NEW_NAV_RIGHT = '''<button id="exportJsonBtn" onclick="exportJSON()" title="Export & save JSON"
                    style="display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:30px;background:linear-gradient(135deg,#06d6a0,#018a5a);color:#fff;font-size:.82rem;font-weight:600;border:none;cursor:pointer;transition:all .3s">
                    <i class="fas fa-download"></i><span>Export JSON</span>
                </button>
                <button class="nav-icon-btn" id="logoutBtn" title="Logout"><i
                            class="fas fa-sign-out-alt"></i></button>'''

if OLD_NAV_RIGHT.strip() in admin.replace('\r\n', '\n').replace('\r', '\n'):
    admin_n = admin.replace('\r\n', '\n').replace('\r', '\n')
    admin_n = admin_n.replace(OLD_NAV_RIGHT.strip(), NEW_NAV_RIGHT.strip())
    with open(r'd:\Projects\Portfollio\admin.html', 'w', encoding='utf-8') as f:
        f.write(admin_n)
    print("✅ Export JSON button added to admin.html nav")
else:
    # Try simpler approach
    if 'id="logoutBtn"' in admin:
        admin = admin.replace(
            '<button class="nav-icon-btn" id="logoutBtn"',
            '<button id="exportJsonBtn" onclick="exportJSON()" title="Export JSON" style="display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:30px;background:linear-gradient(135deg,#06d6a0,#018a5a);color:#fff;font-size:.82rem;font-weight:600;border:none;cursor:pointer;margin-right:8px"><i class="fas fa-download"></i><span>Export JSON</span></button>\n                <button class="nav-icon-btn" id="logoutBtn"'
        ,1)
        with open(r'd:\Projects\Portfollio\admin.html', 'w', encoding='utf-8') as f:
            f.write(admin)
        print("✅ Export JSON button added (fallback) to admin.html nav")
    else:
        print("⚠️  Could not add Export JSON button to admin.html")

print("\n🎉 All patches applied!")
