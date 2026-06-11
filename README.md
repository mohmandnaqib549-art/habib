# Habib - CV Builder Platform

🌍 **Multi-language Support**: Persian & English | فارسی و انگلیسی

A modern, full-stack CV/Resume builder platform with real-time preview, multiple templates, PDF export, and subscription management.

## 📋 Features

- ✨ **Real-time WYSIWYG Editor** - See changes instantly
- 🎨 **Multiple Templates** - Professional & creative designs
- 🌐 **Bilingual Support** - Persian (فارسی) & English
- 📄 **PDF/DOCX Export** - High-quality document generation
- 🔐 **OAuth2 Authentication** - Google & LinkedIn login
- 💳 **Stripe Integration** - Subscription management
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Drag & Drop** - Reorder resume sections easily

## 🏗️ Architecture

```
habib/
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Setup

1. **Clone & Install**
```bash
git clone https://github.com/mohmandnaqib549-art/habib.git
cd habib

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Environment Setup**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. **Database & Docker**
```bash
# Start PostgreSQL & Redis
docker-compose up -d

# Run migrations
cd backend
npm run migrate

# Seed database with templates
npm run seed
```

4. **Start Development Servers**
```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend
npm run dev
```

## 📚 Documentation

- [Backend API Docs](./backend/README.md)
- [Frontend Setup](./frontend/README.md)
- [Database Schema](./database-plan.md)
- [API Routes](./backend-plan.md)
- [Admin Guide](./ADMIN_GUIDE.md)

## 🔐 Admin Access

**Default Admin Credentials:**
```
Email: admin@habib.io
Password: Habib@123456
```

**Dashboard:** http://localhost:3000/dashboard

## 📦 Tech Stack

### Backend
- Node.js + Express.js + TypeScript
- PostgreSQL + Prisma ORM
- JWT + OAuth2 Authentication
- Stripe API Integration
- Puppeteer for PDF generation
- AWS S3 / MinIO for file storage

### Frontend
- Next.js 14+ (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Query + Zustand
- React Hook Form + Zod validation

## 🌐 Internationalization

The platform supports:
- **Persian (فارسی)** - RTL support
- **English** - LTR support

Language preference is stored in user settings and localStorage.

## 📄 License

MIT

## 👥 Support

For issues and feature requests, please create an issue in the repository.
