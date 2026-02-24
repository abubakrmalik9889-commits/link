# Resume Preview & Card System - Setup Guide

## 📋 Overview

The new Resume Preview system provides:
- ✅ Beautiful resume cards in grid layout
- ✅ Search and filter functionality
- ✅ Real-time stats (jobs, education, skills)
- ✅ Quick actions (edit, delete, preview)
- ✅ Animations and smooth transitions
- ✅ API integration with backend

## 🎯 Features

### 1. Resume Card Component
Displays individual resume with:
- Resume name and creation date
- Personal info preview (name, title, email)
- Statistics (jobs, education, skills count)
- Quick action buttons
- Template badge

### 2. Resume Preview Component
Full page view with:
- Search by name/title/email
- Filter options
- Grid layout (1-3 columns responsive)
- Empty state handling
- Loading and error states
- Aggregate statistics

### 3. Dedicated Resumes Page
- Beautiful layout with background effects
- Navigation integration
- Professional design

## 🚀 How to Use

### Access the Preview
```
http://localhost:3000/resumes
```

### Navigate from Navbar
- Click "My Resumes" in navigation menu
- Or "Builder" to create new resume

### Features Available

**Search**
```
Search by:
- Resume name
- First name
- Last name
- Email
```

**Quick Actions**
```
✎ Edit    - Open resume in builder
👁 Preview - View resume
🔗 Share  - Get shareable link
🗑 Delete - Remove resume
```

**Statistics**
```
- Total resumes
- Total jobs listed
- Total education entries
- Total skills
```

## 📱 Responsive Design

```
Mobile (< 768px)     → 1 column
Tablet (768-1024px)  → 2 columns  
Desktop (> 1024px)   → 3 columns
```

## 🔧 Component Usage

### Using ResumeCard Independently
```tsx
import { ResumeCard } from '@/components/ResumeCard'

<ResumeCard
  resume={resumeData}
  onEdit={(id) => console.log('Edit:', id)}
  onDelete={(id) => console.log('Delete:', id)}
/>
```

### Using ResumePreview Component
```tsx
import { ResumePreview } from '@/components/ResumePreview'

<ResumePreview />
```

## 🔄 API Integration

### Endpoints Used

**Get all resumes**
```
GET /resumes
Authorization: Bearer <token>
```

**Delete resume**
```
DELETE /resumes/:id
Authorization: Bearer <token>
```

**Get single resume**
```
GET /resumes/:id
Authorization: Bearer <token>
```

### Response Format
```json
{
  "id": "mongodb_id",
  "_id": "mongodb_id",
  "name": "My Resume",
  "templateId": "modern-slate",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "title": "Software Engineer"
  },
  "experience": [...],
  "education": [...],
  "skills": [...],
  "createdAt": "2024-02-09T10:30:00Z",
  "updatedAt": "2024-02-09T11:00:00Z"
}
```

## 🎨 Customization

### Change Grid Layout
**File:** `src/components/ResumePreview.tsx`

```tsx
{/* Default: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Change to 4 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Modify Card Styling
**File:** `src/components/ResumeCard.tsx`

Change colors, animations, or layout in the JSX

### Customize Statistics
**File:** `src/components/ResumePreview.tsx`

Update the stats footer section

## ⚡ Performance

- Lazy loads resumes on component mount
- Memoized callbacks prevent re-renders
- Efficient filtering with useMemo
- Smooth animations with Framer Motion

## 🐛 Troubleshooting

### Resumes not loading
```
1. Check if JWT token is valid
2. Verify backend API is running
3. Check browser console for errors
4. Ensure NEXT_PUBLIC_API_URL is correct
```

### Delete not working
```
1. Verify user is authenticated
2. Check if resume belongs to logged-in user
3. Look for API errors in console
```

### Search not filtering
```
1. Check resume data has name/email fields
2. Verify search input is working
3. Check console for JavaScript errors
```

### Cards not responsive
```
1. Check viewport width
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R)
```

## 🔐 Security

- Required authentication token
- User can only delete own resumes
- Proper error handling
- Confirmation before delete

## 📚 Related Files

```
src/
├── components/
│   ├── ResumeCard.tsx        - Card component
│   ├── ResumePreview.tsx     - Preview section
│   └── Navbar.tsx            - Navigation
├── hooks/
│   └── useResume.ts          - API hook
├── lib/
│   └── apiClient.ts          - API client
└── app/
    └── resumes/
        └── page.tsx          - Resumes page
```

## 🚀 Next Enhancements

- [ ] Bulk operations (select multiple, delete all)
- [ ] Duplicate resume
- [ ] Export resume list as CSV
- [ ] Share resume with collaborators
- [ ] Resume templates switcher
- [ ] Analytics per resume
- [ ] Version history
- [ ] Favorites/Starred

## 📞 Support

For issues:
1. Check backend is running
2. Verify MongoDB connection
3. Check authentication token
4. Review browser console
5. Check API responses in Network tab

---

**Happy resume building! 🎉**
