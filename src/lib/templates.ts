import { Template } from '@/types'

export const templates: Template[] = [
  {
    id: 'executive-rose',
    name: 'Executive Rose',
    category: 'Executive',
    thumbnail: '/templates/executive-rose.png',
    description: 'Elegant rose-tinted header design perfect for senior executives',
    premium: false,
    colors: ['#f5e6e8', '#1c1c1e', '#8b5a5c'],
  },
  {
    id: 'executive-navy',
    name: 'Executive Navy',
    category: 'Executive',
    thumbnail: '/templates/executive-navy.png',
    description: 'Professional navy blue accents for corporate leaders',
    premium: false,
    colors: ['#1e3a5f', '#ffffff', '#2563eb'],
  },
  {
    id: 'modern-teal',
    name: 'Modern Teal',
    category: 'Modern',
    thumbnail: '/templates/modern-teal.png',
    description: 'Clean design with teal accent bars for contemporary professionals',
    premium: false,
    colors: ['#0d7377', '#ffffff', '#14b8a6'],
  },
  {
    id: 'modern-slate',
    name: 'Modern Slate',
    category: 'Modern',
    thumbnail: '/templates/modern-slate.png',
    description: 'Slate gray headers with minimalist aesthetic',
    premium: true,
    colors: ['#475569', '#f8fafc', '#64748b'],
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Navy',
    category: 'Executive',
    thumbnail: '/templates/corporate-navy.png',
    description: 'Bold navy headers for traditional corporate environments',
    premium: true,
    colors: ['#1e3a5f', '#ffffff', '#1e40af'],
  },
  {
    id: 'minimal-terracotta',
    name: 'Minimal Terracotta',
    category: 'Minimal',
    thumbnail: '/templates/minimal-terracotta.png',
    description: 'Clean terracotta accents with understated elegance',
    premium: true,
    colors: ['#c65d57', '#ffffff', '#fef2f2'],
  },
  {
    id: 'creative-sidebar',
    name: 'Creative Sidebar',
    category: 'Creative',
    thumbnail: '/templates/creative-sidebar.png',
    description: 'Two-column layout with skills sidebar for creative professionals',
    premium: true,
    colors: ['#d4d4d8', '#ffffff', '#18181b'],
  },
]

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id)
}

export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return templates.filter((t) => t.category === category)
}
