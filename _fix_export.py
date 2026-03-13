import re

with open(r'd:\Projects\Portfollio\admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

NEW_FN = """        async function exportJSON() {
            const btn = document.getElementById('exportJsonBtn');
            const jsonStr = JSON.stringify(DB, null, 2);
            try {
                if (btn) { btn.style.opacity = '.6'; btn.querySelector('span').textContent = 'Saving...'; }
                const res = await fetch('/save-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: jsonStr
                });
                if (!res.ok) throw new Error('Server returned ' + res.status);
                const result = await res.json();
                if (!result.ok) throw new Error(result.error || 'Unknown');
                isDirty = false;
                updateDirtyBadge();
                showToast('Changes saved directly to portfolio-data.json!', 'success');
            } catch(e) {
                showToast('Direct save failed: ' + e.message + ' — downloading fallback.', 'warn');
                const blob = new Blob([jsonStr], {type:'application/json'});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'portfolio-data.json';
                a.click();
                URL.revokeObjectURL(a.href);
                isDirty = false;
            } finally {
                updateDirtyBadge();
            }
        }"""

# Find the old function using regex
m = re.search(r'(        (?:async )?function exportJSON\(\).*?^        \})', content, re.DOTALL | re.MULTILINE)
if m:
    content = content[:m.start()] + NEW_FN + content[m.end():]
    with open(r'd:\Projects\Portfollio\admin.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: exportJSON replaced")
else:
    print("NOT FOUND — current function text:")
    idx = content.find('exportJSON')
    print(repr(content[max(0,idx-50):idx+400]))
