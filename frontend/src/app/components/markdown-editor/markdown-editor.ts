import { Component, Input, Output, EventEmitter, inject, signal, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './markdown-editor.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ]
})
export class MarkdownEditorComponent implements ControlValueAccessor {
  private readonly blogService = inject(BlogService);

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mdFileInput') mdFileInput!: ElementRef<HTMLInputElement>;

  value = signal<string>('');
  viewMode = signal<'write' | 'preview' | 'split'>('split');
  isUploading = signal<boolean>(false);
  isDragging = signal<boolean>(false);

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(val: string): void {
    if (val !== undefined) {
      this.value.set(val || '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
    this.onTouch();
  }

  setViewMode(mode: 'write' | 'preview' | 'split') {
    this.viewMode.set(mode);
  }

  insertText(before: string, after: string = '') {
    const el = this.textareaRef.nativeElement;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = this.value();
    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;
    
    const newVal = text.substring(0, start) + replacement + text.substring(end);
    this.value.set(newVal);
    this.onChange(newVal);
    this.onTouch();

    // Reset selection
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  }

  // Formatting actions
  formatBold() { this.insertText('**', '**'); }
  formatItalic() { this.insertText('*', '*'); }
  formatHeading() { this.insertText('### '); }
  formatQuote() { this.insertText('> '); }
  formatCode() { this.insertText('```\n', '\n```'); }
  formatLink() { this.insertText('[', '](url)'); }
  formatList() { this.insertText('- '); }

  triggerImageUpload() {
    this.fileInput.nativeElement.click();
  }

  triggerMdUpload() {
    this.mdFileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadImage(input.files[0]);
      input.value = ''; // Reset
    }
  }

  onMdFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string || '';
        this.value.set(content);
        this.onChange(content);
        this.onTouch();
      };
      reader.readAsText(file);
      input.value = ''; // Reset
    }
  }

  uploadImage(file: File) {
    this.isUploading.set(true);
    this.blogService.uploadImage(file).subscribe({
      next: (res) => {
        this.insertText(`![${file.name}](${res.url})`);
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error('Image upload failed', err);
        alert('Ошибка загрузки изображения');
        this.isUploading.set(false);
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.uploadImage(file);
      } else if (file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string || '';
          this.value.set(content);
          this.onChange(content);
          this.onTouch();
        };
        reader.readAsText(file);
      }
    }
  }

  parseMarkdown(content: string | undefined): string {
    if (!content) return '';
    let html = content;
    
    // Protect Code Blocks & Add Syntax Highlighting / Copy Button
    const codeBlocks: string[] = [];
    html = html.replace(/```([a-zA-Z0-9-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang.trim() || 'code';
      const encodedCode = encodeURIComponent(code);
      
      let highlighted = code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|from|export|interface|type|async|await|public|private|protected|implements|extends|new|this)\b/g, '<span style="color: #cba6f7;">$1</span>')
        .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span style="color: #a6e3a1;">$1</span>')
        .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span style="color: #89b4fa;">$1</span>')
        .replace(/\b(true|false|null|undefined|[0-9]+)\b/g, '<span style="color: #fab387;">$1</span>');

      codeBlocks.push(`
        <div class="my-6 rounded-xl overflow-hidden bg-[#1e1e2e] border border-slate-700/50 shadow-lg group">
          <div class="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">${language}</span>
            <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encodedCode}')); this.innerText='Скопировано!'; setTimeout(() => this.innerText='Копировать', 2000)" class="text-xs text-slate-300 hover:text-white transition-colors bg-slate-700/50 hover:bg-slate-600 px-3 py-1 rounded-md cursor-pointer">Копировать</button>
          </div>
          <pre class="p-5 overflow-x-auto text-sm font-mono text-slate-300 m-0"><code>${highlighted}</code></pre>
        </div>
      `);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // Protect Inline Code
    const inlineCode: string[] = [];
    html = html.replace(/`([^`]+)`/g, (match, p1) => {
      const escaped = p1.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      inlineCode.push(`<code class="px-1.5 py-0.5 rounded font-mono text-xs bg-slate-800 text-amber-300 border border-slate-700/50">${escaped}</code>`);
      return `__INLINE_CODE_${inlineCode.length - 1}__`;
    });

    // Escape the rest of the HTML
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="rounded-xl my-6 max-w-full h-auto border border-slate-800 shadow-md"/>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/50 transition-colors">$1</a>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-300">$1</em>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-xl font-bold text-white mt-8 mb-4">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-2xl font-bold text-white mt-10 mb-4 border-b border-slate-800/80 pb-2">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-3xl font-extrabold text-white mt-10 mb-6">$1</h2>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-5 py-2 my-6 bg-slate-800/30 italic text-slate-300 rounded-r-lg">$1</blockquote>');

    // Lists (Groups continuous list items into ul)
    html = html.replace(/^(\s*[-*]\s+.*(?:\n\s*[-*]\s+.*)*)/gim, (match) => {
      const items = match.trim().split('\n').map(item => {
        return `<li class="ml-6 list-disc text-slate-300 my-1.5">${item.replace(/^\s*[-*]\s+/, '')}</li>`;
      }).join('\n');
      return `<ul class="my-4">${items}</ul>`;
    });

    // Paragraphs
    const blocks = html.split(/\n\s*\n/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<img') || trimmed.startsWith('__CODE_BLOCK_')) {
        return trimmed;
      }
      return `<p class="leading-relaxed text-slate-300 text-base my-4">${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // Restore Inline Code
    inlineCode.forEach((code, index) => {
      html = html.replace(`__INLINE_CODE_${index}__`, code);
    });

    // Restore Code Blocks
    codeBlocks.forEach((code, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, code);
    });

    return html;
  }
}
