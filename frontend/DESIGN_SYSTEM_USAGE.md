# HEARST AI - Design System Usage Guide

## 📦 Files Structure

```
frontend/
├── css/
│   ├── design-tokens.css      # CSS Variables (READY TO USE)
│   ├── design-tokens.scss     # SCSS Variables & Mixins
│   └── examples.css           # Component Examples
└── js/
    └── icon-utils.js          # Icon Injection Utilities
```

## 🎨 Using CSS Variables

```css
.my-component {
    background: var(--theme-bg-secondary);
    color: var(--theme-text-primary);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-cards);
    padding: var(--spacing-6);
}
```

## 📝 Using SCSS Mixins

```scss
@import 'design-tokens.scss';

.my-title {
    @include typography('section-title');
    color: $color-primary-light-green;
}

.my-card {
    background: $color-surface-default;
    border-radius: $radius-cards;
    padding: $spacing-6;
}
```

## 🎴 Card Component Example

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Card Title</h3>
    </div>
    <div class="card-body">
        Card content here
    </div>
</div>
```

```html
<!-- Card with Accent -->
<div class="card card-accent">
    <div class="card-header">
        <h3 class="card-title">Accent Card</h3>
    </div>
    <div class="card-body">
        Content with green accent
    </div>
</div>
```

## 🔤 Typography Classes

```html
<h1 class="text-display">Display Text</h1>
<h2 class="text-page-title">Page Title</h2>
<h3 class="text-section-title">Section Title</h3>
<h4 class="text-subsection-title">Subsection Title</h4>
<p class="text-body">Body text</p>
<p class="text-body-minor">Minor body text</p>
<span class="text-caption">Caption text</span>
```

## 🎯 Icon Usage

```javascript
// Import icon utilities
import { createIcon, injectIcon, replaceWithIcon } from './js/icon-utils.js';

// Create icon element
const icon = createIcon('dashboard', {
    size: 'md',        // sm, md, lg
    color: 'icon-accent',
    className: 'my-icon'
});

// Inject icon into element
injectIcon('#my-button', 'arrow-right', { size: 'sm' });

// Replace element with icon
replaceWithIcon('.icon-placeholder', 'settings');
```

```html
<!-- Using icon class -->
<span class="icon icon-accent">
    <!-- SVG injected here -->
</span>
```

## 🎨 Color Usage

```css
/* Text Colors */
.text-accent { color: var(--color-text-accent); }
.text-secondary { color: var(--color-text-secondary-2); }
.text-error { color: var(--color-text-error); }

/* Background Colors */
.bg-primary { background: var(--color-primary-light-green); }
.bg-surface { background: var(--color-surface-subtle-green); }
```

## 📏 Spacing Utilities

```html
<div class="p-6 m-4 gap-3">
    <!-- padding: 24px, margin: 16px, gap: 8px -->
</div>
```

## 🎭 Patterns

```css
.pattern-bg {
    background: var(--pattern-spherical-mesh);
}
```

## ✅ Ready to Copy/Paste

All code is production-ready. Just import the files and start using!


