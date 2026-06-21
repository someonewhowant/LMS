import os
import glob
import re

base_path = '/home/admin/workspace/LMS/frontend/src/app/components'
for filepath in glob.glob(f'{base_path}/**/*.ts', recursive=True):
    # skip header and footer folders
    if 'header' in filepath or 'footer' in filepath:
        continue

    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content
    
    # Remove import lines
    content = re.sub(r'import\s+{\s*HeaderComponent\s*}\s+from\s+.*?;\n?', '', content)
    content = re.sub(r'import\s+{\s*FooterComponent\s*}\s+from\s+.*?;\n?', '', content)
    content = re.sub(r'import\s+{\s*HeaderComponent,\s*FooterComponent\s*}\s+from\s+.*?;\n?', '', content)
    content = re.sub(r'import\s+{\s*HeaderComponent\s*,\s*FooterComponent\s*}\s+from\s+.*?;\n?', '', content)
    
    # Remove from imports array
    content = re.sub(r',\s*HeaderComponent', '', content)
    content = re.sub(r',\s*FooterComponent', '', content)
    content = re.sub(r'HeaderComponent,\s*', '', content)
    content = re.sub(r'FooterComponent,\s*', '', content)
    content = re.sub(r'HeaderComponent', '', content)
    content = re.sub(r'FooterComponent', '', content)
    
    # Clean up empty imports arrays if they happen
    content = content.replace('imports: []', 'imports: []') # Just to keep syntax
    content = content.replace('imports: [, ', 'imports: [')
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'Updated {filepath}')

