# KodNest Premium Build System

Live Demo: [View Demo](https://yourusername.github.io/kodnest-premium-build-system/)

## Overview

A calm, intentional, and coherent design system built for serious B2C product companies. This is not a student project — it's a production-ready foundation that values clarity over cleverness and substance over spectacle.

## Design Philosophy

**Calm. Intentional. Coherent. Confident.**

- **Not flashy** — No gradients, no glassmorphism, no neon colors
- **Not loud** — No animation noise, no parallax, no bounce effects  
- **Not playful** — No decorative fonts, no random spacing
- **Not hackathon-style** — Every decision is deliberate

## Quick Start

1. Clone this repository
2. Open `index.html` in your browser
3. Start building with the design system

## Color System

Maximum 4 colors across the entire system:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#F7F6F3` | Off-white, calm foundation |
| Primary Text | `#111111` | High contrast, readable |
| Accent | `#8B0000` | Deep red for primary actions |
| Success | `#4A6741` | Muted green for success states |
| Warning | `#B8860B` | Muted amber for warnings |

## Typography

- **Headings**: Crimson Pro (serif) — Large, confident, generous spacing
- **Body**: Inter (sans-serif) — Clean, readable, 16–18px
- **Line height**: 1.7 for body, 1.2 for headings
- **Max text width**: 720px

## Spacing System

Consistent 8px-based scale:

- `--space-xs`: 8px
- `--space-sm`: 16px
- `--space-md`: 24px
- `--space-lg`: 40px
- `--space-xl`: 64px

**Never use random spacing like 13px or 27px.** Whitespace is part of the design.

## Global Layout Structure

Every page follows this structure:

```
[Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]
```

### Components

- **Top Bar**: Project name, progress indicator, status badge
- **Context Header**: Large serif headline, clear purpose
- **Primary Workspace** (70%): Main interaction area
- **Secondary Panel** (30%): Step explanation, prompts, actions
- **Proof Footer**: Completion checklist

## Files

- `index.html` — Demo page showcasing all components
- `index.css` — Complete design system implementation
- `README.md` — This documentation

## Usage

All design tokens are defined as CSS variables in `index.css`. Simply include the stylesheet and use the components:

```html
<link rel="stylesheet" href="index.css">
```

## Design Consistency

Everything feels like one mind designed it:

✅ Same border radius everywhere (4px)  
✅ Same hover effects (180ms ease-in-out)  
✅ Same spacing scale (8px base)  
✅ Same transition timing  
✅ No visual drift

## Production Ready

This design system is production-ready and can be used immediately for:

- SaaS products
- B2C applications
- Internal tools
- Product builders
- Workflow platforms

## License

MIT License - feel free to use this design system in your projects.

---

Built with intention. Designed for clarity.
