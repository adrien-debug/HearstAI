# 🚀 Guide: Run HearstAI Frontend Locally

## Quick Start

### Option 1: Frontend Only (Next.js API Routes)
The frontend can run standalone using Next.js API routes:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 3. Set up database (Prisma)
npx prisma generate
npx prisma db push

# 4. Run the frontend
npm run dev
```

The app will be available at: **http://localhost:6001**

---

### Option 2: Frontend + NestJS Backend (Recommended)
If you want to use the new NestJS backend:

#### Terminal 1 - Start NestJS Backend
```bash
cd ../hearstai_backend

# Install dependencies (if not done)
npm install

# Run migrations (if not done)
npm run migration:run

# Start the backend
npm run start:dev
```
Backend will run on: **http://localhost:4000**

#### Terminal 2 - Start Next.js Frontend
```bash
cd HearstAI

# Install dependencies (if not done)
npm install

# Create .env.local if it doesn't exist
cp .env.example .env.local

# Edit .env.local and add:
# NEXT_PUBLIC_API_URL=http://localhost:4000
# BACKEND_URL=http://localhost:4000

# Set up Prisma (if not done)
npx prisma generate
npx prisma db push

# Start the frontend
npm run dev
```
Frontend will run on: **http://localhost:6001**

---

## Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be >= 18.0.0
   ```

2. **PostgreSQL Database**
   - Make sure PostgreSQL is running
   - Create a database (or use existing one)
   - Configure `DATABASE_URL` in `.env.local`

3. **npm** (comes with Node.js)

---

## Environment Variables Setup

Create `.env.local` file in the `HearstAI` directory:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/hearstai_db"

# Next.js API Configuration
# Option 1: Use Next.js API routes (standalone)
NEXT_PUBLIC_API_URL="/api"

# Option 2: Use external NestJS backend
# NEXT_PUBLIC_API_URL="http://localhost:4000"
# BACKEND_URL="http://localhost:4000"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:6001"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"

# Optional: API Keys
DEBANK_ACCESS_KEY="your_debank_key"
ANTHROPIC_API_KEY="your_anthropic_key"
FIREBLOCKS_API_KEY="your_fireblocks_key"
FIREBLOCKS_SECRET_KEY="your_fireblocks_secret"
LUXOR_API_KEY="your_luxor_key"

# Environment
NODE_ENV="development"
```

### Generate NEXTAUTH_SECRET
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Database Setup (Prisma)

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Push Schema to Database
```bash
npx prisma db push
```

### 3. (Optional) Open Prisma Studio
```bash
npx prisma studio
```
This opens a GUI at http://localhost:5555 to view/edit your database.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 6001) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db migrate` | Run database migrations |
| `npx prisma studio` | Open Prisma Studio GUI |

---

## Troubleshooting

### Port Already in Use
If port 6001 is already in use:
```bash
# Find process using port 6001
# On Windows:
netstat -ano | findstr :6001

# On Linux/Mac:
lsof -i :6001

# Kill the process or change port in package.json
```

### Database Connection Error
1. Check PostgreSQL is running:
   ```bash
   # On Windows (if installed as service):
   # Check Services app
   
   # On Linux/Mac:
   sudo systemctl status postgresql
   ```

2. Verify `DATABASE_URL` in `.env.local` is correct

3. Test connection:
   ```bash
   npx prisma db pull
   ```

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Next.js Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## Project Structure

```
HearstAI/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Next.js)
│   └── [pages]/           # Page components
├── components/            # React components
├── lib/                   # Utilities
│   └── api.ts            # API client
├── prisma/                # Prisma ORM
│   └── schema.prisma     # Database schema
├── public/                # Static files
├── styles/                # CSS files
├── .env.local            # Environment variables (create this)
└── package.json          # Dependencies
```

---

## Accessing the Application

Once running, access:

- **Frontend**: http://localhost:6001
- **API Health Check**: http://localhost:6001/api/health
- **Prisma Studio** (if running): http://localhost:5555

---

## Next Steps

1. ✅ Frontend is running
2. ✅ Database is connected
3. 🔄 (Optional) Start NestJS backend for full functionality
4. 🔄 Configure API keys for external services (DeBank, Anthropic, etc.)

---

## Need Help?

- Check logs in the terminal
- Verify environment variables in `.env.local`
- Ensure PostgreSQL is running and accessible
- Check that ports 6001 (and 4000 if using backend) are available



