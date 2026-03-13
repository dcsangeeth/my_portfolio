"""
Replaces the JavaScript section in admin.html (from the DATA HELPERS comment
through the closing </script> tag) with the new JSON-file-based version.
"""
import re

with open(r'd:\Projects\Portfollio\admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Everything from DATA HELPERS comment to </script>
OLD_MARKER_START = '        // ============ DATA HELPERS ============'
OLD_MARKER_END   = '    </script>'

idx_start = content.find(OLD_MARKER_START)
idx_end   = content.find(OLD_MARKER_END, idx_start)

if idx_start == -1 or idx_end == -1:
    print("ERROR: Could not find markers in admin.html")
    exit(1)

NEW_SCRIPT = r"""        // ============ DATA HELPERS (JSON FILE BASED) ============
        const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
        const esc = s => (s || '').replace(/</g, '&lt;');

        // In-memory store loaded from data/portfolio-data.json
        let DB = { meta:{}, projects:[], experience:[], certifications:[], skills:{programming:[],frameworks:[],domains:[],soft:[]}, education:[] };
        let isDirty = false;

        async function loadJSON() {
            try {
                const res = await fetch('data/portfolio-data.json?_=' + Date.now());
                if (!res.ok) throw new Error('Not found');
                const raw = await res.json();
                DB.meta          = raw.meta || {};
                DB.projects      = raw.projects || [];
                DB.experience    = raw.experience || [];
                DB.certifications= raw.certifications || [];
                DB.skills        = raw.skills || { programming:[], frameworks:[], domains:[], soft:[] };
                DB.education     = raw.education || [];
                showToast('✅ Loaded data/portfolio-data.json', 'success');
            } catch(e) {
                showToast('⚠️ Could not load JSON — ' + e.message, 'warn');
            }
        }

        function exportJSON() {
            const blob = new Blob([JSON.stringify(DB, null, 2)], {type:'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'portfolio-data.json';
            a.click();
            URL.revokeObjectURL(a.href);
            isDirty = false;
            updateDirtyBadge();
            showToast('📥 Downloaded portfolio-data.json — replace data/portfolio-data.json in your project, then commit & push.', 'success');
        }

        function updateDirtyBadge() {
            const btn = document.getElementById('exportJsonBtn');
            if (!btn) return;
            if (isDirty) {
                btn.style.background = 'linear-gradient(135deg,#ef233c,#b5131f)';
                btn.querySelector('span').textContent = 'Save JSON ●';
                btn.title = 'Unsaved changes – click to export';
            } else {
                btn.style.background = 'linear-gradient(135deg,#06d6a0,#018a5a)';
                btn.querySelector('span').textContent = 'Export JSON';
                btn.title = 'Export & save JSON';
            }
        }

        function markDirty() { isDirty = true; updateDirtyBadge(); }

        function showToast(msg, type='success') {
            let t = document.getElementById('adminToast');
            if (!t) {
                t = document.createElement('div');
                t.id = 'adminToast';
                t.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:12px;font-size:.88rem;font-weight:600;z-index:9999;transition:all .4s;max-width:360px;box-shadow:0 8px 25px rgba(0,0,0,.2);color:var(--text);background:var(--bg-card);';
                document.body.appendChild(t);
            }
            const colors = {success:'#06d6a0', warn:'#FFD166', error:'#ef233c'};
            t.style.borderLeft = '4px solid ' + (colors[type]||colors.success);
            t.textContent = msg;
            t.style.opacity = '1';
            clearTimeout(t._to);
            t._to = setTimeout(()=>t.style.opacity='0', 5000);
        }

        // ============ INIT ============
        async function init() {
            await loadJSON();
            renderProjects(); renderExperience(); renderCerts(); renderSkills(); renderEducation(); updateStats();
            updateDirtyBadge();
        }

        function updateStats() {
            document.getElementById('statProjects').textContent = (DB.projects||[]).length;
            document.getElementById('statCerts').textContent    = (DB.certifications||[]).length;
            document.getElementById('statExp').textContent      = (DB.experience||[]).length;
            const allSkills = [...(DB.skills.programming||[]),...(DB.skills.frameworks||[]),...(DB.skills.domains||[])];
            document.getElementById('statSkills').textContent   = allSkills.length;
        }

        // ============ PROJECTS ============
        function renderProjects() {
            const items = DB.projects||[];
            const tbody = document.getElementById('projectsTableBody');
            if (!items.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><i class="fas fa-folder-open"></i> No projects yet</td></tr>'; return; }
            tbody.innerHTML = items.map(p => `<tr>
                <td><strong>${esc(p.title)}</strong></td>
                <td><span class="badge badge-${p.category}">${esc(p.category)}</span></td>
                <td style="font-size:.78rem;color:var(--text-muted)">${esc((p.tech||'').split(',').slice(0,3).join(', '))}</td>
                <td style="font-size:.78rem">${p.demo?`<a href="${esc(p.demo)}" target="_blank" style="color:var(--primary)">${esc(p.demo)}</a>`:'—'}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProject('${p.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn" style="background:rgba(6,214,160,.1);color:#06d6a0" onclick="generateProjectPage('${p.id}')" title="Download project page HTML"><i class="fas fa-file-code"></i> Gen</button>
                    <button class="action-btn del-btn" onclick="deleteItem('projects','${p.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        }

        function openForm(type) {
            const clears = {
                project:    ['projTitle','projDesc','projTech','projGithub','projDemo','projImage','projectId'],
                experience: ['expTitle','expCompany','expPeriod','expDuration','expLocation','expDesc','expResponsibilities','expTech','expId'],
                cert:       ['certTitle','certIssuer','certDate','certLink','certDescription','certSkills','certId'],
                skill:      ['skillName','skillLevel','skillIcon','skillId'],
                education:  ['eduDegree','eduInstitution','eduPeriod','eduDesc','eduId']
            };
            const forms = { project:'projectForm', experience:'experienceForm', cert:'certForm', skill:'skillForm', education:'educationForm' };
            const titles = { project:'Add Project', experience:'Add Experience', cert:'Add Certification', skill:'Add Skill', education:'Add Education' };
            const titleIds = { project:'projectFormTitle', experience:'expFormTitle', cert:'certFormTitle', skill:'skillFormTitle', education:'eduFormTitle' };
            (clears[type]||[]).forEach(f=>{ const el=document.getElementById(f); if(el) el.value=''; });
            const ti = document.getElementById(titleIds[type]); if(ti) ti.textContent = titles[type];
            const fi = document.getElementById(forms[type]); if(fi) fi.classList.add('active');
        }

        function editProject(id) {
            const p = (DB.projects||[]).find(x=>x.id===id); if(!p) return;
            document.getElementById('projectFormTitle').textContent = 'Edit Project';
            document.getElementById('projectId').value   = id;
            document.getElementById('projTitle').value   = p.title||'';
            document.getElementById('projCategory').value= p.category||'web';
            document.getElementById('projDesc').value    = p.desc||'';
            document.getElementById('projTech').value    = p.tech||'';
            document.getElementById('projGithub').value  = p.github||'';
            document.getElementById('projDemo').value    = p.demo||'';
            document.getElementById('projImage').value   = p.image||'';
            document.getElementById('projectForm').classList.add('active');
        }

        function saveProject() {
            const id   = document.getElementById('projectId').value || uid();
            const item = {
                id, title:    document.getElementById('projTitle').value,
                category: document.getElementById('projCategory').value,
                desc:     document.getElementById('projDesc').value,
                tech:     document.getElementById('projTech').value,
                github:   document.getElementById('projGithub').value,
                demo:     document.getElementById('projDemo').value,
                image:    document.getElementById('projImage').value
            };
            if(!DB.projects) DB.projects=[];
            const idx = DB.projects.findIndex(x=>x.id===id);
            if(idx>=0) DB.projects[idx]=item; else DB.projects.push(item);
            markDirty(); closeForm('projectForm'); renderProjects(); updateStats();
            showToast('Saved in memory. Click "Save JSON" to persist.','success');
        }

        // ============ PROJECT PAGE GENERATOR ============
        function generateProjectPage(id) {
            const p = (DB.projects||[]).find(x=>x.id===id); if(!p) return;
            const slug     = p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
            const catColor = {mobile:'#54C5F8',web:'#4361ee',iot:'#00B894',ai:'#7209b7'}[p.category]||'#4361ee';
            const catPill  = {mobile:'mobile-pill',web:'web-pill',iot:'iot-pill',ai:'ai-pill'}[p.category]||'web-pill';
            const catIcon  = {mobile:'fas fa-mobile-alt',web:'fas fa-globe',iot:'fas fa-microchip',ai:'fas fa-brain'}[p.category]||'fas fa-code';
            const catLabel = {mobile:'Mobile App',web:'Web App',iot:'IoT',ai:'AI & ML'}[p.category]||p.category;
            const techArr  = (p.tech||'').split(',').map(t=>t.trim()).filter(Boolean);
            const techHtml = techArr.map(t=>`<div class="tech-card"><i class="fas fa-code" style="color:var(--primary)"></i><span>${t}</span></div>`).join('');
            const htmlOut = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${p.title} – DC Sangeeth</title>
    <link rel="icon" type="image/png" href="../images/profile.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="project-styles.css">
</head>
<body>
    <nav class="project-nav"><div class="nav-inner">
        <a href="../index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Portfolio</a>
        <div class="nav-logo"><span>DC</span>Sangeeth</div>
        <button class="theme-toggle" id="themeToggle"><i class="fas fa-moon" id="themeIcon"></i></button>
    </div></nav>
    <section class="project-hero" style="--hero-color:${catColor}">
        <div class="hero-overlay"></div>
        <div class="project-hero-img"><img src="../images/${p.image||'profile.jpg'}" alt="${p.title}"></div>
        <div class="project-hero-content">
            <div class="project-category-pill ${catPill}"><i class="${catIcon}"></i> ${catLabel}</div>
            <h1>${p.title}</h1>
            <p class="project-tagline">${p.desc||''}</p>
            <div class="hero-meta"><span><i class="fas fa-calendar-alt"></i> 2024</span><span><i class="fas fa-user"></i> DC Sangeeth</span></div>
            <div class="hero-actions">
                ${p.github?`<a href="${p.github}" target="_blank" class="btn-proj secondary-p"><i class="fab fa-github"></i> View Code</a>`:''}
                ${p.demo&&!p.demo.startsWith('projects/')?`<a href="${p.demo}" target="_blank" class="btn-proj primary-p"><i class="fas fa-eye"></i> Live Demo</a>`:''}
            </div>
        </div>
    </section>
    <main class="project-main"><div class="proj-container">
        <section class="proj-section">
            <h2 class="proj-section-title"><i class="fas fa-info-circle"></i> Project Overview</h2>
            <p>${p.desc||'Project description coming soon.'}</p>
            <p>Built using ${techArr.slice(0,3).join(', ')} and related technologies.</p>
        </section>
        <section class="proj-section">
            <h2 class="proj-section-title"><i class="fas fa-layer-group"></i> Tech Stack</h2>
            <div class="tech-grid">${techHtml}</div>
        </section>
        <section class="proj-section">
            <h2 class="proj-section-title"><i class="fas fa-star"></i> Key Features</h2>
            <ul class="feature-list">
                <li><i class="fas fa-check-circle"></i> Feature 1 – update with your project details</li>
                <li><i class="fas fa-check-circle"></i> Feature 2 – describe core functionality</li>
                <li><i class="fas fa-check-circle"></i> Feature 3 – highlight unique aspects</li>
            </ul>
        </section>
        <section class="proj-section">
            <h2 class="proj-section-title"><i class="fas fa-lightbulb"></i> What I Learned</h2>
            <div class="takeaway-grid">
                <div class="takeaway-item"><span class="takeaway-num">01</span><p>Key insight from this project</p></div>
                <div class="takeaway-item"><span class="takeaway-num">02</span><p>Technical challenge overcome</p></div>
                <div class="takeaway-item"><span class="takeaway-num">03</span><p>Architecture decision made</p></div>
                <div class="takeaway-item"><span class="takeaway-num">04</span><p>Real-world impact</p></div>
            </div>
        </section>
    </div></main>
    <footer class="proj-footer"><p>© 2025 DC Sangeeth &nbsp;|&nbsp; <a href="../index.html">Back to Portfolio</a></p></footer>
    <script src="project-script.js"><\/script>
</body></html>`;
            const blob = new Blob([htmlOut],{type:'text/html'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = slug+'.html';
            a.click();
            URL.revokeObjectURL(a.href);
            showToast('📄 Downloaded '+slug+'.html — save it in your projects/ folder.','success');
        }

        // ============ EXPERIENCE ============
        function renderExperience() {
            const items = DB.experience||[];
            const tbody = document.getElementById('experienceTableBody');
            if(!items.length) { tbody.innerHTML='<tr><td colspan="5" class="empty-state"><i class="fas fa-briefcase"></i> No experience added</td></tr>'; return; }
            tbody.innerHTML = items.map(e=>`<tr>
                <td><strong>${esc(e.title)}</strong></td>
                <td>${esc(e.company)}</td>
                <td style="font-size:.8rem;color:var(--text-muted)">${esc(e.period)}</td>
                <td><span class="badge badge-web">${esc(e.type)}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editExperience('${e.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn del-btn" onclick="deleteItem('experience','${e.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        }
        function editExperience(id) {
            const e=(DB.experience||[]).find(x=>x.id===id); if(!e) return;
            document.getElementById('expFormTitle').textContent='Edit Experience';
            document.getElementById('expId').value=id;
            document.getElementById('expTitle').value=e.title||''; document.getElementById('expCompany').value=e.company||'';
            document.getElementById('expPeriod').value=e.period||''; document.getElementById('expDuration').value=e.duration||'';
            document.getElementById('expLocation').value=e.location||''; document.getElementById('expType').value=e.type||'Internship';
            document.getElementById('expDesc').value=e.desc||''; document.getElementById('expResponsibilities').value=e.responsibilities||'';
            document.getElementById('expTech').value=e.tech||'';
            document.getElementById('experienceForm').classList.add('active');
        }
        function saveExperience() {
            const id=document.getElementById('expId').value||uid();
            const item={id, title:document.getElementById('expTitle').value, company:document.getElementById('expCompany').value,
                period:document.getElementById('expPeriod').value, duration:document.getElementById('expDuration').value,
                location:document.getElementById('expLocation').value, type:document.getElementById('expType').value,
                desc:document.getElementById('expDesc').value, responsibilities:document.getElementById('expResponsibilities').value,
                tech:document.getElementById('expTech').value};
            if(!DB.experience) DB.experience=[];
            const idx=DB.experience.findIndex(x=>x.id===id);
            if(idx>=0) DB.experience[idx]=item; else DB.experience.push(item);
            markDirty(); closeForm('experienceForm'); renderExperience(); updateStats();
            showToast('Saved in memory. Click "Save JSON" to persist.','success');
        }

        // ============ CERTIFICATIONS ============
        function renderCerts() {
            const items=DB.certifications||[];
            const tbody=document.getElementById('certsTableBody');
            if(!items.length){tbody.innerHTML='<tr><td colspan="5" class="empty-state"><i class="fas fa-certificate"></i> No certifications added</td></tr>';return;}
            tbody.innerHTML=items.map(c=>`<tr>
                <td><strong>${esc(c.title)}</strong></td>
                <td>${esc(c.issuer)}</td>
                <td style="font-size:.8rem">${esc(c.date)}</td>
                <td><span class="badge badge-${c.priority}">${esc(c.priority)}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editCert('${c.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn del-btn" onclick="deleteItem('certifications','${c.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        }
        function editCert(id) {
            const c=(DB.certifications||[]).find(x=>x.id===id); if(!c) return;
            document.getElementById('certFormTitle').textContent='Edit Certification';
            document.getElementById('certId').value=id;
            document.getElementById('certTitle').value=c.title||''; document.getElementById('certIssuer').value=c.issuer||'';
            document.getElementById('certDate').value=c.date||''; document.getElementById('certPriority').value=c.priority||'high';
            document.getElementById('certLink').value=c.link||''; document.getElementById('certDescription').value=c.description||'';
            document.getElementById('certSkills').value=c.skills||'';
            document.getElementById('certForm').classList.add('active');
        }
        function saveCert() {
            const id=document.getElementById('certId').value||uid();
            const item={id, title:document.getElementById('certTitle').value, issuer:document.getElementById('certIssuer').value,
                date:document.getElementById('certDate').value, priority:document.getElementById('certPriority').value,
                link:document.getElementById('certLink').value, description:document.getElementById('certDescription').value,
                skills:document.getElementById('certSkills').value, icon:'fas fa-certificate', color:'#4361ee'};
            if(!DB.certifications) DB.certifications=[];
            const idx=DB.certifications.findIndex(x=>x.id===id);
            if(idx>=0) DB.certifications[idx]=item; else DB.certifications.push(item);
            markDirty(); closeForm('certForm'); renderCerts(); updateStats();
            showToast('Saved in memory. Click "Save JSON" to persist.','success');
        }

        // ============ SKILLS ============
        function renderSkills() {
            const all=[...(DB.skills.programming||[]).map(s=>({...s,cat:'programming'})),
                       ...(DB.skills.frameworks||[]).map(s=>({...s,cat:'frameworks'})),
                       ...(DB.skills.domains||[]).map(s=>({...s,cat:'domains'}))];
            const tbody=document.getElementById('skillsTableBody');
            if(!all.length){tbody.innerHTML='<tr><td colspan="4" class="empty-state"><i class="fas fa-code"></i> No skills added</td></tr>';return;}
            tbody.innerHTML=all.map(s=>`<tr>
                <td><strong>${esc(s.name)}</strong></td>
                <td><span class="badge badge-web" style="font-size:.7rem">${esc(s.cat)}</span></td>
                <td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:5px;background:var(--border);border-radius:3px"><div style="height:100%;width:${s.level||0}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:3px"></div></div><span style="font-size:.8rem;font-weight:700;color:var(--primary)">${s.level||0}%</span></div></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editSkill('${s.name.replace(/'/g,"\\'")}','${s.cat}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn del-btn" onclick="deleteSkill('${s.name.replace(/'/g,"\\'")}','${s.cat}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        }
        function editSkill(name,cat) {
            const s=(DB.skills[cat]||[]).find(x=>x.name===name); if(!s) return;
            document.getElementById('skillFormTitle').textContent='Edit Skill';
            document.getElementById('skillId').value=name+'|'+cat;
            document.getElementById('skillName').value=s.name||'';
            document.getElementById('skillCategory').value=cat;
            document.getElementById('skillLevel').value=s.level||0;
            document.getElementById('skillIcon').value=s.icon||'';
            document.getElementById('skillForm').classList.add('active');
        }
        function saveSkill() {
            const encoded=document.getElementById('skillId').value;
            const cat=document.getElementById('skillCategory').value;
            const item={name:document.getElementById('skillName').value, level:parseInt(document.getElementById('skillLevel').value)||0,
                        icon:document.getElementById('skillIcon').value, color:'#4361ee'};
            if(!DB.skills[cat]) DB.skills[cat]=[];
            if(encoded){
                const [oldName,oldCat]=encoded.split('|');
                if(oldCat!==cat){ DB.skills[oldCat]=(DB.skills[oldCat]||[]).filter(s=>s.name!==oldName); }
                else{ const idx=DB.skills[cat].findIndex(s=>s.name===oldName); if(idx>=0){DB.skills[cat][idx]=item; markDirty(); closeForm('skillForm'); renderSkills(); updateStats(); showToast('Saved.','success'); return;} }
            }
            DB.skills[cat].push(item);
            markDirty(); closeForm('skillForm'); renderSkills(); updateStats();
            showToast('Saved in memory. Click "Save JSON" to persist.','success');
        }
        function deleteSkill(name,cat){
            if(!confirm('Delete skill "'+name+'"?')) return;
            DB.skills[cat]=(DB.skills[cat]||[]).filter(s=>s.name!==name);
            markDirty(); renderSkills(); updateStats();
        }

        // ============ EDUCATION ============
        function renderEducation() {
            const items=DB.education||[];
            const tbody=document.getElementById('educationTableBody');
            if(!items.length){tbody.innerHTML='<tr><td colspan="4" class="empty-state"><i class="fas fa-graduation-cap"></i> No education added</td></tr>';return;}
            tbody.innerHTML=items.map(e=>`<tr>
                <td><strong>${esc(e.degree)}</strong></td>
                <td>${esc(e.institution)}</td>
                <td style="font-size:.8rem;color:var(--text-muted)">${esc(e.period)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editEducation('${e.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn del-btn" onclick="deleteItem('education','${e.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        }
        function editEducation(id){
            const e=(DB.education||[]).find(x=>x.id===id); if(!e) return;
            document.getElementById('eduFormTitle').textContent='Edit Education';
            document.getElementById('eduId').value=id;
            document.getElementById('eduDegree').value=e.degree||''; document.getElementById('eduInstitution').value=e.institution||'';
            document.getElementById('eduPeriod').value=e.period||''; document.getElementById('eduDesc').value=e.desc||'';
            document.getElementById('educationForm').classList.add('active');
        }
        function saveEducation(){
            const id=document.getElementById('eduId').value||uid();
            const item={id, degree:document.getElementById('eduDegree').value, institution:document.getElementById('eduInstitution').value,
                period:document.getElementById('eduPeriod').value, desc:document.getElementById('eduDesc').value};
            if(!DB.education) DB.education=[];
            const idx=DB.education.findIndex(x=>x.id===id);
            if(idx>=0) DB.education[idx]=item; else DB.education.push(item);
            markDirty(); closeForm('educationForm'); renderEducation(); updateStats();
            showToast('Saved in memory. Click "Save JSON" to persist.','success');
        }

        // ============ SHARED HELPERS ============
        function closeForm(id){ document.getElementById(id).classList.remove('active'); }
        function deleteItem(section,id){
            if(!confirm('Delete this item?')) return;
            DB[section]=(DB[section]||[]).filter(x=>x.id!==id);
            markDirty();
            if(section==='projects') renderProjects();
            else if(section==='experience') renderExperience();
            else if(section==='certifications') renderCerts();
            else if(section==='education') renderEducation();
            updateStats();
        }

        document.querySelectorAll('.form-modal').forEach(m=>{
            m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('active');});
        });
        document.addEventListener('keydown',e=>{
            if(e.key==='Escape') document.querySelectorAll('.form-modal.active').forEach(m=>m.classList.remove('active'));
        });
        window.addEventListener('beforeunload',e=>{ if(isDirty){e.preventDefault();e.returnValue='';} });

        if(sessionStorage.getItem('admin_auth')==='1' && document.getElementById('adminPanel').style.display==='block'){
            init();
        }
"""

new_content = content[:idx_start] + NEW_SCRIPT + '\n    </script>'
# Append everything after the closing </script>
after_script = content[idx_end + len('    </script>'):]
new_content += after_script

with open(r'd:\Projects\Portfollio\admin.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ admin.html script section replaced successfully.")
print(f"   Original length: {len(content)} chars")
print(f"   New length:      {len(new_content)} chars")
