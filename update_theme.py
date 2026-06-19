import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll replace instances of alabaster and light rgba in HTML files
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Text colors
    content = content.replace('color: var(--color-alabaster);', 'color: var(--color-charcoal);')
    content = content.replace('color: rgba(250,249,246,0.8);', 'color: var(--color-muted);')
    content = content.replace('color: rgba(250,249,246,0.9);', 'color: var(--color-charcoal);')
    content = content.replace('color: rgba(250,249,246,0.7);', 'color: var(--color-muted);')
    
    # Borders
    content = content.replace('border-bottom: 1px solid rgba(250,249,246,0.1);', 'border-bottom: 1px solid rgba(56,48,36,0.1);')
    content = content.replace('border: 1px solid rgba(250,249,246,0.1);', 'border: 1px solid rgba(56,48,36,0.1);')
    
    # In bg-slate/bg-brass dividers
    content = content.replace('background-color: var(--color-alabaster);', 'background-color: var(--color-brass);')
    
    # Also fix footer brand color just in case
    content = content.replace('rgba(250,249,246,0.7)', 'var(--color-muted)')
    
    # Let's fix the footer border if there is any
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# Update style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace color palette
old_palette = """  /* Colors */
  --color-alabaster: #FAF9F6;
  --color-warm-grey: #F0EDE6;
  --color-charcoal: #1A1A1A;
  --color-slate: #0F172A;
  --color-muted: #555555;
  --color-brass: #C5A059;
  --color-brass-light: #DFB971;"""

new_palette = """  /* Colors */
  --color-alabaster: #FFFFFF;
  --color-warm-grey: #FAFAFA;
  --color-charcoal: #383024;
  --color-slate: #F2EFE8;
  --color-muted: #8C7C61;
  --color-brass: #D4AF37;
  --color-brass-light: #E8CC7B;"""

css = css.replace(old_palette, new_palette)

# Update bg-slate classes
old_slate = """.bg-slate { background-color: var(--color-slate); color: var(--color-alabaster); }
.bg-slate h1, .bg-slate h2, .bg-slate h3, .bg-slate p { color: var(--color-alabaster); }"""

new_slate = """.bg-slate { background-color: var(--color-slate); color: var(--color-charcoal); }
.bg-slate h1, .bg-slate h2, .bg-slate h3, .bg-slate p { color: var(--color-charcoal); }"""

css = css.replace(old_slate, new_slate)

# In case we need brass to be dark text (brass is light gold, white text might be hard to read)
old_brass = """.bg-brass { background-color: var(--color-brass); color: var(--color-alabaster); }
.bg-brass h1, .bg-brass h2, .bg-brass h3, .bg-brass p { color: var(--color-alabaster); }"""

new_brass = """.bg-brass { background-color: var(--color-brass); color: var(--color-charcoal); }
.bg-brass h1, .bg-brass h2, .bg-brass h3, .bg-brass p { color: var(--color-charcoal); }"""

css = css.replace(old_brass, new_brass)

# Also header scrolled
css = css.replace('background-color: rgba(250, 249, 246, 0.95);', 'background-color: rgba(255, 255, 255, 0.95);')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Theme updated to super premium Gold and White!")
