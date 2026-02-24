# 🎥 Sticky Preview Visual Guide

## How It Works - Step by Step

### Scenario 1: Form Scrolls Down
```
INITIAL VIEW:
┌─────────────────────┬──────────────────────┐
│ Step 1              │ Live Preview         │
│ Form field 1        │ Resume Card          │
│ Form field 2        │ ──────────────────── │
│ Form field 3        │ ABUBAKAR             │
│ [Next Button]       │ VP, Health Policy    │
└─────────────────────┴──────────────────────┘


USER SCROLLS DOWN IN FORM:
┌─────────────────────┬──────────────────────┐
│ Step 2              │ Live Preview         │
│ Form field A        │ Resume Card          │
│ Form field B        │ (STAYS HERE! ✅)     │
│ Form field C        │ ──────────────────── │
│ Form field D        │ ABUBAKAR             │
│ [Next Button]       │ VP, Health Policy    │
└─────────────────────┴──────────────────────┘

LEFT scrolls ↑↓  /  RIGHT stays FIXED ●
```

---

### Scenario 2: Navigating Steps
```
STEP 1: Personal Info
┌─────────────────────┬──────────────────────┐
│ • Personal Info 🟢  │ Live Preview         │
│ ○ Summary           │ ✍️ Adding your name  │
│ ○ Experience        │ ○ First Name         │
│ ○ Education         │ ○ Last Name          │
│                     │ ○ Email              │
└─────────────────────┴──────────────────────┘


CLICK NEXT → STEP 2: Summary
┌─────────────────────┬──────────────────────┐
│ ✓ Personal Info     │ Live Preview         │
│ • Summary 🟢        │ ✅ Name updated!     │
│ ○ Experience        │ ──────────────────── │
│ ○ Education         │ ABUBAKAR             │
│                     │ [Your bio here...]   │
└─────────────────────┴──────────────────────┘

Preview updates live while staying in place!
```

---

### Mobile Layout
```
MOBILE (< 768px):
┌──────────────────┐
│                  │
│  FORM SECTION    │
│  (Full width)    │
│                  │
│  Step 1 info     │
│  Form fields     │
│  Navigation      │
│                  │
├──────────────────┤ ← Position: Sticky Bottom
│  LIVE PREVIEW    │ ← Bottom sheet
│  (Not fullscreen)│ ← Scrollable inside
│                  │
└──────────────────┘

User can:
• Scroll form up/down
• See preview at bottom
• Scroll preview content
• No overlapping
```

---

## Technical Implementation

### Layout Structure
```
<StickyBuilderLayout>
  ├─ Sidebar (SCROLLABLE)
  │  ├─ Header (sticky top-0 inside)
  │  ├─ StepNavigator
  │  ├─ FormSection
  │  │  └─ Form fields
  │  └─ Navigation buttons
  │
  └─ Preview (FIXED)
     └─ PreviewContainer (fixed right-0 top-0)
        ├─ LivePreviewHeader (sticky inside)
        ├─ Resume preview content
        └─ [scrolls inside container]
```

### CSS Classes
```
LEFT SIDE:
- Scrollable: overflow-y-auto
- Width: w-full md:w-[50%] lg:w-[55%]
- Position: static (default)

RIGHT SIDE:
- Fixed: fixed right-0 top-0
- Width: w-full md:w-[50%] lg:w-[45%]
- Height: h-screen
- Z-index: z-40
- Content scrollable: overflow-y-auto (inside)
```

---

## Animation Flow

### Page Load
```
0ms:    Initial state (invisible)
  └─ StickyBuilderLayout initializes

300ms:  Left side slides in
  └─ x: -20 → 0
  └─ opacity: 0 → 1

400ms:  Right side slides in (delayed)
  └─ x: 20 → 0
  └─ opacity: 0 → 1

Result: Smooth staggered entrance
```

### Step Change
```
User clicks "Next" button
  ↓
Current step unmounts (exit animation)
  ↓
New step mounts with FormSection
  ↓
FormSection animates in:
  ├─ initial: { opacity: 0, y: 10 }
  ├─ animate: { opacity: 1, y: 0 }
  └─ duration: 200ms

Preview continues showing old state
while new form section loads
```

---

## Breakpoint Behavior

### Mobile (<640px)
```
Display: Full width stacked
Preview: Bottom sticky sheet (h-1/3)
Form: Scrollable full width
Layout: One column
```

### Tablet (640-1024px)
```
Display: Side by side (50/50)
Left: w-[50%] overflow-y-auto
Right: w-[50%] fixed right-0
Layout: Two columns
```

### Desktop (1024+px)
```
Display: Side by side (55/45)
Left: w-[55%] overflow-y-auto
Right: w-[45%] fixed right-0
Layout: Two columns
More space for form
```

---

## Scroll Behavior

### Left Sidebar (SCROLLS)
```
┌─────────────────────┐
│ VIEWPORT            │
├─────────────────────┤
│ Content visible     │
│                     │
│ User scrolls ↓      │
│                     │
│ New content visible │
├─────────────────────┤
│ Hidden (below fold) │
└─────────────────────┘

Scroll event:
→ Left side: scrollTop changes
→ Right side: NO CHANGE (fixed)
→ Preview stays in exact position
```

### Right Preview (INTERNAL SCROLL ONLY)
```
┌──────────────────┐
│ HEADER (fixed)   │
├──────────────────┤
│ Content A        │
│ Can scroll ↓     │
│ Content B        │
├──────────────────┤
│ Footer (sticky)  │
└──────────────────┘

Scroll event:
→ Only content inside scrolls
→ Container doesn't move
→ Always visible in viewport
```

---

## Z-Index Layering

```
Layer 5: Modals (z-50+)      ← Top
Layer 4: Navbar (z-50)
Layer 3: Preview (z-40)      ← Fixed right
Layer 2: Form (auto)
Layer 1: Background (0)      ← Bottom

Mobile:
- Preview at bottom = highest z on mobile
- Form behind preview on mobile
```

---

## Responsive Width Calculation

```
DESKTOP (1280px+):
Left:  55% = 704px
Right: 45% = 576px
Total: 1280px ✓

TABLET (768px):
Left:  50% = 384px
Right: 50% = 384px
Total: 768px ✓

MOBILE (<640px):
Left:  100% = 640px (full)
Right: 100% = 640px (stacked at bottom)
```

---

## Interaction Matrix

| Action | Left Side | Right Side | Result |
|--------|-----------|-----------|--------|
| Scroll form | ✓ Moves | ✗ Fixed | Form scrolls, preview stays |
| Click step | ✓ Changes | ✓ Updates | Step changes, preview updates |
| Export PDF | ✗ Hidden | ✓ Works | Export without form scroll |
| Resize window | ✓ Reflow | ✓ Reflow | Both adjust to new width |
| Touch (mobile) | ✓ Scroll | ✓ Bottom sheet | Form scrolls, preview at bottom |

---

## Performance Optimizations

### What's NOT re-rendered on scroll
```
❌ Right preview container
❌ Left sidebar header
❌ Step navigator
↓
✅ Only visible content changes
✅ Smooth scrolling
✅ 60 fps performance
```

### Why It's Fast
```
✓ Fixed positioning (GPU accelerated)
✓ Transform-based animations
✓ Minimal repaints
✓ Delegated event listeners
✓ Memoized components (optional)
```

---

## Browser Support

| Browser | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| IE 11 | ❌ | ❌ | ❌ |

---

## Edge Cases Handled

### ✅ Long form (scrolls)
- Form scrolls within viewport
- Preview stays fixed

### ✅ Mobile (bottom sheet)
- Preview docked at bottom
- Doesn't interfere with form

### ✅ Landscape mode
- Respects viewport height
- Preview stays full height

### ✅ Dynamic content
- Form grows, preview stays
- No reflow issues

### ✅ Animations
- Smooth transitions
- No jank or stuttering

---

## This Powers

✨ Modern resume builders
✨ Document editors
✨ Design tools
✨ Form builders with preview
✨ Any split-view interface

---

**Perfect layout for your resume builder! 🚀**
