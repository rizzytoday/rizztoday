# Rizzy Design Rules & Guidelines

## Animation Philosophy
Always smooth, always elastic. Follow Apple's animation principles.

### Easing Functions
```css
--smooth-ease: cubic-bezier(0.4, 0, 0.2, 1);    /* Standard smooth */
--bounce-ease: cubic-bezier(0.34, 1.56, 0.64, 1); /* Elastic/bouncy */
```

### Animation Timing
- **Micro-interactions**: 150-200ms
- **State changes**: 250-350ms
- **Larger transitions**: 400-500ms

### Animation Rules
1. **Always use bounce-ease** for transforms (scale, translate)
2. **Use smooth-ease** for opacity, color, filter changes
3. **Combine multiple properties** - opacity + transform + blur for rich transitions
4. **Stagger animations** - use transition-delay for sequential reveals (0.03s increments)
5. **Use requestAnimationFrame** for JS-triggered class swaps to ensure smooth repaints

### Status/Text Change Pattern
```css
/* Out state - slide up, fade, blur */
.changing-out {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
    filter: blur(4px);
}

/* In state - slide from below, then bounce to center */
.changing-in {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
    filter: blur(4px);
}
```

---

## Liquid Glass Style (Apple iOS 18)

### Core Properties
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(50px) saturate(120%);
-webkit-backdrop-filter: blur(50px) saturate(120%);
border: 1px solid rgba(255, 255, 255, 0.35);
border-radius: 50px; /* Full pill shape */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
```

### Hover State
```css
background: rgba(255, 255, 255, 0.2);
border-color: rgba(255, 255, 255, 0.45);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
```

### Key Characteristics
- Very transparent (0.15 white opacity)
- Strong blur (50px)
- Subtle white border (0.35 opacity)
- Soft drop shadow
- Full pill border-radius (50px)
- Content behind visible but refracted

---

## Typography

### Fonts
- **Headings/Names**: 'Urbanist', sans-serif
- **Body/UI**: 'Inter Tight', sans-serif

### Letter Spacing
- Tight: -0.01em to -0.02em for modern feel

---

## Color Palette

### Brand Colors
- **Radiants**: #FCE184 (golden)
- **Hydex**: #4ade80 (green)

### Status Indicators
- **Available/Online**: #4ade80 with glow
```css
background-color: #4ade80;
box-shadow: 0 0 10px rgba(74, 222, 128, 0.8), 0 0 20px rgba(74, 222, 128, 0.4);
```

### Text Opacity Scale
- Primary: 1.0
- Secondary: 0.7-0.8
- Muted: 0.5
- Subtle: 0.3

---

## Components

### Buttons
- Use liquid glass style for primary actions
- Bounce animation on hover (scale 1.02-1.05, translateY -2px)
- Press state: scale(0.98)

### Cards
- Dark backgrounds with subtle borders
- Consistent border-radius (10-16px)
- Subtle shadows

### Tooltips
- Liquid glass style
- Pill shape (border-radius: 50px)
- Appear with fade + scale animation

---

## Responsive Notes
- Mobile: tap-friendly sizes (min 44px touch targets)
- Desktop: hover effects enabled
- Always use -webkit- prefixes for backdrop-filter
