import os
import re

directories = ['export/html', 'pages']
old_str = r'href="https://fonts.googleapis.com/css2\?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"'
new_str = 'href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&display=swap"'

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = re.sub(old_str, new_str, content)
                
                if content != new_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Updated {filepath}')
