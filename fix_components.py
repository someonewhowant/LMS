import os
import glob
import re

base_path = '/home/admin/workspace/LMS/frontend/src/app/components'
for filepath in glob.glob(f'{base_path}/**/*.html', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content
    
    # Remove app-header and app-footer
    content = re.sub(r'^\s*<!-- Header -->\s*\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*<app-header.*?/>\s*\n', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*<app-footer.*?/>\s*\n', '', content, flags=re.MULTILINE)
    
    # Replace the min-h-screen root div
    content = content.replace('<div class="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">', '<div class="flex-1 flex flex-col w-full">')
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'Updated {filepath}')

