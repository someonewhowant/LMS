import glob
import re

for filepath in glob.glob('/home/admin/workspace/LMS/frontend/src/app/components/**/*.ts', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple fix for the exact string duplicate I probably created
    if '  imports: [RouterLink]\n})' in content:
        content = content.replace(',\n  imports: [RouterLink]\n})', '\n})')
        content = content.replace(',\n  imports: []\n})', '\n})')
        
    if '  imports: []\n})' in content:
        content = content.replace(',\n  imports: []\n})', '\n})')

    with open(filepath, 'w') as f:
        f.write(content)
