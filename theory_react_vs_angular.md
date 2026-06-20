# Теория: Компоненты в Angular 21

Компоненты — это фундаментальные блоки любого Angular-приложения.
Они объединяют HTML-разметку, CSS-стили и TypeScript-логику.

## Пример компонента:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: `<h1>Привет, {{ name }}!</h1>`,
  styles: [`h1 { color: #4f46e5; }`]
})
export class HelloComponent {
  name = 'Студент';
}
```
Каждый компонент состоит из:
1. Декоратора `@Component`
2. Шаблона (Template)
3. Класса с бизнес-логикой
