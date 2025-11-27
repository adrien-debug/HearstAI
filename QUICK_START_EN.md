# 🚀 Quick Start Guide - HearstAI

## Prerequisites

- **Node.js 18+** (you have v22.17.0 ✅)

## Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```


### Step 2: Configure Environment

The `.env.local` file has been created with default values.

### Step 3: Start the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:6001**

---


3. **Generate Prisma client and push schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```



## Available Scripts

```bash
# Start development server (port 6001)
npm run dev

# Start both frontend and backend
npm run dev:local

# Build for production
npm run build

# Start production server
npm start
---

## Ports

- **Frontend (Next.js)**: http://localhost:6001
- **Backend (Express)**: http://localhost:4000 (if using `npm run dev:local`)

---

## Environment Variables

The `.env.local` file contains:

- `DATABASE_URL` - PostgreSQL connection string (required for full functionality)
- `NEXTAUTH_URL` - Authentication URL (http://localhost:6001)
- `NEXTAUTH_SECRET` - Secret key for NextAuth (already generated)
- `DEBANK_ACCESS_KEY` - Optional, for Collateral features
- Other API keys - Optional

---

## Troubleshooting

### Port Already in Use

If port 6001 is already in use:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 6001).OwningProcess | Stop-Process
```

### Database Connection Error

If you see database errors:
1. Make sure PostgreSQL is running
2. Check your `DATABASE_URL` in `.env.local`
3. Or start without database to test frontend only

### Prisma Errors

```bash
# Regenerate Prisma client
npm run db:generate

# Reset database schema
npm run db:push
```

---

## Next Steps

1. **Start the server**: `npm run dev`
2. **Open browser**: http://localhost:6001
3. **Set up database** (if needed for full functionality)

---

## Need Help?

- Check `README.md` for more details
- Check `README_LOCAL.md` for local setup
- Check `NOTE_SQLITE.md` for database options

