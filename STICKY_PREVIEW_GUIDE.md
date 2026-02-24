# 🎯 Sticky Preview Layout Guide

## Problem Solved
**Before:** Preview scrolled away when navigating steps
**After:** Preview stays fixed on right while form scrolls

---

## 📦 Components

### **StickyBuilderLayout** (New)
Main wrapper for the entire builder layout.

**Features:**
- ✅ Left side scrolls with form
- ✅ Right side stays FIXED (never moves!)
- ✅ Mobile responsive (stacked preview at bottom)
- ✅ Smooth animations
- ✅ Full height layout

**File:** `src/components/StickyBuilderLayout.tsx`

### **PreviewContainer** (Updated)
Updated to use `fixed` positioning.

**Changes:**
- `sticky top-0` → `fixed right-0 top-0`
- `hidden xl:flex` → `hidden md:flex`
- `w-full` → `w-full md:w-[50%] lg:w-[45%]`
- Added `z-40` for layering

**File:** `src/components/PreviewContainer.tsx`

---

## 🎨 Visual Layout

### Desktop (≥768px)
```
┌─────────────────────┬──────────────────────┐
│                     │                      │
│   Left Sidebar      │   Right Preview      │
│  (SCROLLS UP)       │   (STAYS FIXED)      │
│                     │                      │
│   Form Step 1 →→→   │                      │
│   Form Step 2 →→→   │   Resume Preview     │
│   Form Step 3 →→→   │   (Never moves!)     │
│   Form Step 4 →→→   │                      │
│   Form Step 5 →→→   │                      │
│                     │                      │
└─────────────────────┴──────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│                      │
│   Form (Full)        │
│                      │
│   Step 1             │
│   Step 2             │
│   Step 3             │
│   ...                │
│                      │
├──────────────────────┤ ← Sticky at bottom
│  Resume Preview      │
│  (Bottom Sheet)      │
│                      │
└──────────────────────┘
```

---

## 🚀 How to Use

### Step 1: Import Components
```tsx
import { StickyBuilderLayout } from '@/components/StickyBuilderLayout'
import { PreviewContainer } from '@/components/PreviewContainer'
import { LivePreviewHeader } from '@/components/LivePreviewHeader'
```

### Step 2: Structure Your Page
```tsx
export default function BuilderPage() {
  // ... your state and handlers

  return (
    <StickyBuilderLayout
      sidebar={
        <div className="p-6 space-y-6">
          {/* Navbar */}
          <div>Your builder form here</div>
          {/* Steps */}
          <StepNavigator {...props} />
          {/* Forms */}
          <FormSection {...props}>
            {/* Form content */}
          </FormSection>
          {/* Navigation */}
          <div className="flex gap-3">
            <button>Previous</button>
            <button>Next</button>
          </div>
        </div>
      }
      preview={
        <PreviewContainer>
          <LivePreviewHeader {...props} />
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Resume preview */}
          </div>
        </PreviewContainer>
      }
    />
  )
}
```

### Step 3: That's It!
Preview now stays fixed while form scrolls! ✨

---

## 💡 How It Works

### Left Side (Scrollable)
```tsx
<div className="w-full md:w-[50%] lg:w-[55%] overflow-y-auto">
  {/* Scrolls up/down while browsing form */}
  {sidebar}
</div>
```

### Right Side (Fixed)
```tsx
<div className="hidden md:flex fixed right-0 top-0 h-screen">
  {/* NEVER MOVES - Always visible! */}
  {preview}
</div>
```

---

## 📱 Responsive Behavior

| Screen | Layout | Preview |
|--------|--------|---------|
| Mobile (<640px) | Full width | Bottom sticky sheet |
| Tablet (640-1024px) | 50/50 split | Fixed right side |
| Desktop (>1024px) | 45/55 split | Fixed right side |

---

## 🎯 Key Points

✅ **Preview NEVER scrolls** - Always in view
✅ **Form scrolls freely** - No limitations
✅ **Mobile friendly** - Stacked layout
✅ **Smooth animations** - Professional feel
✅ **Dark mode support** - Built-in
✅ **Responsive** - All screen sizes
✅ **Uses `fixed` positioning** - True sticky
✅ **Z-index managed** - Proper layering

---

## 🔧 Customization

### Change Right Side Width
```tsx
// Default: 45% on desktop, 50% on tablet
w-full md:w-[50%] lg:w-[45%]

// 40% width
w-full md:w-[50%] lg:w-[40%]

// 55% width
w-full md:w-[50%] lg:w-[55%]
```

### Change Left Side Width
```tsx
// Opposite of right side
w-full md:w-[50%] lg:w-[55%]  // default
w-full md:w-[50%] lg:w-[60%]  // wider
```

### Mobile Preview Position
```tsx
// Currently: Bottom sticky
md:hidden fixed bottom-0

// Alternative: Top sticky
md:hidden fixed top-0

// Alternative: Modal overlay
md:hidden fixed inset-0 z-50
```

### Scroll Behavior
```tsx
// Left side scrolling
overflow-y-auto    // Current - always scrollable
overflow-auto      // Both axes
overflow-hidden    // No scrolling
```

---

## ⚠️ Important Notes

### Z-Index
- Left sidebar: `auto` (default)
- Right preview: `z-40` (stays on top)
- Navbar: Should be `z-50`
- Modals: Should be `z-50+`

### Overflow
- Left side: `overflow-y-auto` (scrollable)
- Right side: Content inside should be `overflow-y-auto`

### Height
- Both sides: `h-screen` (full viewport height)
- Don't add bottom padding/margin to main divs

---

## 🐛 Troubleshooting

### Preview overlaps form on mobile
```tsx
// Add margin-bottom to left side
<div className="...overflow-y-auto pb-80">
```

### Preview not visible on desktop
```tsx
// Check z-index and width
fixed right-0 w-[45%] z-40
```

### Preview scrolls/moves
```tsx
// Ensure it's `fixed` not `sticky`
fixed right-0 top-0 h-screen
// NOT:
// sticky top-0 h-screen
```

### Touch scroll issues on mobile
```tsx
// For bottom sheet on mobile:
overflow-y-auto
touch-pan-y  // Allows scrolling
```

---

## 🚀 Advanced Features

### Drag to Resize
```tsx
// Add resize handle:
<div className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-emerald-500" />
```

### Hide/Show Toggle
```tsx
const [showPreview, setShowPreview] = useState(true)

{showPreview && <PreviewContainer>...</PreviewContainer>}

<button onClick={() => setShowPreview(!showPreview)}>
  Toggle Preview
</button>
```

### Fullscreen Mode
```tsx
const [isFullscreen, setIsFullscreen] = useState(false)

<div className={isFullscreen ? 'w-full' : 'w-[45%]'}>
  <PreviewContainer />
</div>
```

---

## 📊 Component Hierarchy

```
StickyBuilderLayout
├── Left Side (Scrollable)
│   ├── Navbar
│   ├── StepNavigator
│   ├── FormSection
│   │   └── Form Fields
│   └── Navigation Buttons
└── Right Side (Fixed)
    └── PreviewContainer
        ├── LivePreviewHeader
        │   └── Export/Import Buttons
        └── Resume Preview
            └── ResumeTemplate
```

---

## ✨ Perfect for:
- ✅ Resume builder
- ✅ Form builders
- ✅ Document editors
- ✅ Design tools
- ✅ Any split-view interface

---

## 🎯 Benefits

1. **Better UX** - Preview always visible
2. **More space** - Form grows with content
3. **Professional** - Modern interface
4. **Responsive** - Works on all devices
5. **Fast** - No re-renders on scroll
6. **Smooth** - Animations included

---

## 🔗 Related Files

- `PreviewContainer.tsx` - Fixed positioning wrapper
- `StickyBuilderLayout.tsx` - Main layout component
- `LivePreviewHeader.tsx` - Export/import buttons
- `FormSection.tsx` - Form sections
- `StepNavigator.tsx` - Step progress

---

**Your preview will never scroll away again! 🎉**
