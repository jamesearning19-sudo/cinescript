# Design Guidelines: Script Formatting Web Application

## Design Approach

**Selected Approach:** Design System (Utility-Focused)
**Primary Reference:** Notion-inspired editor interface with Linear's clean typography
**Rationale:** Script formatting is a productivity tool requiring clarity, readability, and distraction-free text editing. The interface should emphasize functionality over visual flair.

## Core Design Principles

1. **Clarity First:** Clean, uncluttered interface that keeps focus on the script content
2. **Professional Simplicity:** Minimal, modern aesthetic appropriate for creative professionals
3. **Scannable Hierarchy:** Clear visual distinction between input, formatting options, and output areas

---

## Typography

**Primary Font:** Inter (Google Fonts)
- Headings: 600 weight, sizes 2xl-4xl
- Body text: 400 weight, base to lg
- Script content: Source Code Pro or JetBrains Mono at 400 weight for monospaced clarity

**Typography Hierarchy:**
- Page Title: text-3xl font-semibold
- Section Headers: text-xl font-semibold
- Labels: text-sm font-medium
- Body/Instructions: text-base
- Script Preview: text-lg (monospace font for formatted scripts)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section spacing: py-8 or py-12
- Element gaps: gap-4 or gap-6

**Container Strategy:**
- Main container: max-w-6xl mx-auto px-4
- Two-column layout for input/output: grid grid-cols-1 lg:grid-cols-2 gap-8
- Storyboard frames: grid grid-cols-2 gap-4 (4 frames = 2x2 grid)

---

## Component Library

### Navigation
- Simple top header with app logo/name (text-2xl font-bold)
- Minimal navigation - "Home" and "How to Use" links
- Right-aligned format selector dropdown

### Input Area
- Large textarea or upload dropzone
- Drag-and-drop visual feedback with dashed border
- File type indicators (DOC, PDF, TXT icons using Heroicons)
- "Paste Script" and "Upload File" tabs

### Format Selector
- Dropdown or radio button group
- Options: Screenplay, Music Video (2-column), PSA, Storyboard
- Brief format descriptions on hover/selection

### Script Preview/Output
- Fixed-width container mimicking paper (8.5x11 aspect ratio feel)
- Proper margins matching industry standards
- Monospaced font for formatted output
- Download button (primary CTA)

### Storyboard Frames
- 2x2 grid layout per section
- Each frame: bordered box with aspect ratio 16:9 or 4:3
- Text area below each frame for scene description
- Frame numbers in top corner

### Buttons
- Primary: Solid with rounded corners (rounded-lg px-6 py-2)
- Secondary: Outlined style
- Sizes: sm for utility actions, base for primary CTAs

### Form Elements
- Input fields: rounded-lg border with focus ring
- Consistent height (h-10 for inputs, h-32 for textareas)
- Clear labels above fields (text-sm font-medium)

---

## Page Structure

**Homepage Layout:**
1. **Header Section** (py-6): Logo/title + minimal nav
2. **Hero/Introduction** (py-12): Brief headline explaining the tool + quick start CTA
3. **Main Workspace** (py-8): Two-column grid
   - Left: Input area with paste/upload options
   - Right: Format selector + preview/output
4. **Footer** (py-6): Simple credits/links

**Workspace Flow:**
- Linear, top-to-bottom progression on mobile
- Side-by-side on desktop for immediate feedback
- Sticky header with format selector always accessible

---

## Visual Treatment

- Clean, minimal interface with generous whitespace
- Subtle borders (border-gray-200) for content separation
- Focus states: ring-2 ring-blue-500 for accessibility
- Rounded corners consistently at rounded-lg
- No gradients, patterns, or decorative elements
- Shadows: Minimal, only on elevated elements (shadow-sm, shadow-md)

---

## Interactions

**Minimal Animations:**
- Fade-in on format preview updates (200ms)
- Smooth scroll to output section after formatting
- NO hover effects beyond standard button states
- NO complex transitions or scroll-driven animations

---

## Icons

**Library:** Heroicons (outline style)
**Usage:**
- Upload icon for file dropzone
- Document icons for file type indicators
- Download icon for export button
- Check/error icons for validation feedback

---

## Images

No hero images required for this utility application. Focus remains on functional interface elements and text content.

---

## Accessibility

- High contrast text (maintain WCAG AA minimum)
- Focus indicators on all interactive elements
- Keyboard navigation for format selection
- Screen reader labels on all form inputs
- Semantic HTML structure (header, main, section tags)

---

**Design Philosophy:** This tool should feel like a professional desktop application translated to the web - clean, efficient, and purpose-built for script formatting without unnecessary embellishment.