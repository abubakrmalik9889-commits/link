# 🚀 Quick Start - 5 Minutes

Get ResumAI running with Fastify backend in 5 minutes!

## 📋 Prerequisites
- Node.js 18+
- Git

## ⚡ Quick Setup

### 1️⃣ Clone/Navigate to Project
```bash
cd resume-builder
```

### 2️⃣ Install Dependencies (2 min)

**Install frontend:**
```bash
npm install
```

**Install backend:**
```bash
cd backend
npm install
cd ..
```

### 3️⃣ Setup MongoDB (1 min)

**Option A: Local (Easiest)**
```bash
# Install MongoDB from:
# https://www.mongodb.com/try/download/community

# Start it:
mongod
```

**Option B: Cloud (Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string → paste in `backend/.env`

### 4️⃣ Create Environment Files (1 min)

**`backend/.env`:**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=super-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

**`.env.local` (in root):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5️⃣ Start Everything (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend on http://localhost:3000

## 🎯 Done!

Open http://localhost:3000 and start building!

## 💡 Quick Reference

| Action | Command |
|--------|---------|
| Start backend | `cd backend && npm run dev` |
| Start frontend | `npm run dev` |
| Build backend | `cd backend && npm run build` |
| Build frontend | `npm run build` |
| Backend health | `curl http://localhost:3001/health` |

## 🔧 How It Works

```
Frontend (Next.js)
      ↓ API calls
Backend (Fastify)
      ↓ 
Database (MongoDB)
```

**Flow:**
1. User signs up → Frontend calls `/auth/signup`
2. Backend validates & creates user in MongoDB
3. Returns JWT token → Frontend stores in localStorage
4. User creates resume → Frontend calls `/resumes` with token
5. Backend saves resume → Returns data
6. Frontend displays resume

## 📚 Need More Details?

- **Full setup guide**: See `SETUP.md`
- **Backend API docs**: See `backend/README.md`
- **API client**: See `src/lib/apiClient.ts`

## ⚠️ Common Issues

**"MongoDB connection failed"**
→ Make sure `mongod` is running or MongoDB Atlas URI is correct

**"CORS error"**
→ Check `CORS_ORIGIN=http://localhost:3000` in `backend/.env`

**"Port already in use"**
→ Change `PORT` in `backend/.env` or kill process using port

## 🚀 Ready to Deploy?

See `SETUP.md` for:
- Vercel (frontend)
- Railway/Render (backend)
- Database backup

---

**Happy building! 🎉**
