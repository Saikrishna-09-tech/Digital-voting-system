# Project Structure & File Overview

Complete directory structure and file descriptions for the Digital Voting System.

## 📁 Directory Tree

```
digital voting/
│
├── 📦 frontend/                    # React.js + Vite application
│   ├── 📄 package.json            # Frontend dependencies
│   ├── 📄 vite.config.js          # Vite configuration
│   ├── 📄 tailwind.config.js      # Tailwind CSS config
│   ├── 📄 postcss.config.js       # PostCSS config
│   ├── 📄 .env.example            # Example environment variables
│   ├── 📄 index.html              # HTML entry point
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx            # React entry point
│       ├── 📄 App.jsx             # Main router component
│       ├── 📄 index.css           # Global styles
│       │
│       ├── 📁 pages/              # Page components
│       │   ├── Welcome.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── OTPVerification.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── VoterDashboard.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── CastVote.jsx
│       │   ├── Results.jsx
│       │   ├── ManageCandidates.jsx
│       │   └── AdminAnalytics.jsx
│       │
│       ├── 📁 components/         # Reusable components
│       │   ├── ErrorBoundary.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── ElectionTimer.jsx
│       │   └── OTPInput.jsx
│       │
│       ├── 📁 context/            # State management (Zustand)
│       │   └── authStore.js       # Auth, Election, Blockchain stores
│       │
│       ├── 📁 services/           # API services
│       │   └── api.js             # Axios API client + service methods
│       │
│       ├── 📁 blockchain/         # Web3 integration
│       │   ├── blockchainService.js
│       │   └── VotingABI.json
│       │
│       └── 📁 utils/              # Utility functions
│           └── (helper functions)
│
├── 🔧 backend/                    # Node.js + Express server
│   ├── 📄 package.json            # Backend dependencies
│   ├── 📄 config.js               # Configuration loader
│   ├── 📄 .env.example            # Example environment variables
│   ├── 📄 server.js               # Express server entry point
│   │
│   ├── 📁 models/                 # MongoDB schemas
│   │   ├── User.js                # User model (voter/admin)
│   │   ├── Candidate.js           # Candidate model
│   │   ├── Vote.js                # Vote model
│   │   ├── Election.js            # Election status model
│   │   └── AuditLog.js            # Admin actions audit
│   │
│   ├── 📁 controllers/            # Business logic
│   │   ├── authController.js      # Auth logic (register, login, OTP)
│   │   ├── candidateController.js # Candidate management
│   │   ├── voteController.js      # Vote casting & results
│   │   ├── electionController.js  # Election control & analytics
│   │   └── auditController.js     # Audit logging
│   │
│   ├── 📁 routes/                 # API endpoints
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── candidateRoutes.js     # /api/candidates routes
│   │   ├── voteRoutes.js          # /api/votes routes
│   │   ├── electionRoutes.js      # /api/election routes
│   │   └── auditRoutes.js         # /api/audit-log routes
│   │
│   ├── 📁 middlewares/            # Express middleware
│   │   ├── auth.js                # JWT & role verification
│   │   └── rateLimiter.js         # API rate limiting
│   │
│   ├── 📁 utils/                  # Utility functions
│   │   ├── emailService.js        # Nodemailer configuration
│   │   ├── validators.js          # Input validation helpers
│   │   └── jwt.js                 # JWT token management
│   │
│   └── 📁 scripts/                # Utility scripts
│       └── seed.js                # Database seeding (optional)
│
├── ⛓️ contracts/                   # Smart contracts
│   ├── 📄 package.json            # Contract dependencies
│   ├── 📄 hardhat.config.ts       # Hardhat configuration
│   ├── 📄 .env.example            # Example environment variables
│   │
│   ├── 📁 contracts/
│   │   └── Voting.sol             # Main voting smart contract
│   │
│   └── 📁 scripts/
│       └── deploy.ts              # Deployment script
│
├── 📚 docs/                       # Documentation
│   └── DEPLOYMENT.md              # Production deployment guide
│
├── 📄 README.md                   # Main documentation
├── 📄 QUICK_START.md              # Quick start guide
├── 📄 PROJECT_STRUCTURE.md        # This file
├── 📄 .gitignore                  # Git ignore rules
├── 📄 package.json                # Root package.json (for concurrently)
└── 📁 .env files (not in repo)    # Environment configurations
```

## 📋 File Details

### Frontend Files

#### Pages (src/pages/)
- **Welcome.jsx** - Landing page with animated background and info
- **Login.jsx** - Unified login for voters and admins with role toggle
- **Register.jsx** - Voter registration with password confirmation
- **OTPVerification.jsx** - 6-digit OTP input with auto-focus and resend
- **ForgotPassword.jsx** - 3-step password recovery (Email → OTP → NewPassword)
- **VoterDashboard.jsx** - Voter dashboard with election status and action cards
- **AdminDashboard.jsx** - Admin panel with sidebar navigation and stats
- **CastVote.jsx** - Vote selection UI with blockchain transaction handling
- **Results.jsx** - Real-time results with charts and leaderboard
- **ManageCandidates.jsx** - Admin panel to add/delete candidates (with pagination >10)
- **AdminAnalytics.jsx** - Admin analytics with charts and audit logs

#### Components (src/components/)
- **ErrorBoundary.jsx** - Global error handling component
- **ProtectedRoute.jsx** - Route protection with role checking
- **ElectionTimer.jsx** - Countdown timer component
- **OTPInput.jsx** - 6-digit OTP input UI

#### Services (src/services/)
- **api.js** - Axios instance with auth interceptor and all API methods

#### Blockchain (src/blockchain/)
- **blockchainService.js** - Ethers.js wallet & contract interaction
- **VotingABI.json** - Smart contract ABI

#### State Management (src/context/)
- **authStore.js** - Zustand stores for auth, election, and blockchain state

### Backend Files

#### Models (models/)
- **User.js** - User schema with voter/admin roles
- **Candidate.js** - Candidate schema with blockchain ID
- **Vote.js** - Vote schema with transaction hash tracking
- **Election.js** - Election status schema (NOT_STARTED/ACTIVE/ENDED)
- **AuditLog.js** - Admin actions audit trail

#### Controllers (controllers/)
- **authController.js** - Authentication logic (8 functions)
- **candidateController.js** - Candidate CRUD operations
- **voteController.js** - Vote casting and result retrieval
- **electionController.js** - Election management and analytics
- **auditController.js** - Audit log retrieval and logging

#### Routes (routes/)
- **authRoutes.js** - /api/auth endpoints (6 routes)
- **candidateRoutes.js** - /api/candidates endpoints (3 routes + upload)
- **voteRoutes.js** - /api/votes endpoints (4 routes)
- **electionRoutes.js** - /api/election endpoints (4 routes)
- **auditRoutes.js** - /api/audit-log endpoints (2 routes)

#### Middleware (middlewares/)
- **auth.js** - JWT verification and role-based authorization
- **rateLimiter.js** - API rate limiting (login, OTP, general)

#### Utils (utils/)
- **emailService.js** - Email sending with Nodemailer
- **validators.js** - Input validation functions
- **jwt.js** - JWT token creation and verification

### Smart Contract Files

#### Contracts (contracts/)
- **Voting.sol** - Main smart contract with 10+ functions
- **hardhat.config.ts** - Hardhat configuration for Sepolia
- **scripts/deploy.ts** - Contract deployment script

### Configuration Files

- **.env.example** - Template for environment variables
- **vite.config.js** - Frontend build configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **hardhat.config.ts** - Smart contract build configuration
- **package.json** - Root package.json for monorepo management
- **.gitignore** - Git ignore patterns

### Documentation

- **README.md** - Complete project documentation (2000+ lines)
- **QUICK_START.md** - Get started in 10 minutes
- **DEPLOYMENT.md** - Production deployment guide (1500+ lines)
- **PROJECT_STRUCTURE.md** - This file

## 🔄 Data Flow

### Voter Registration Flow
```
Registration Form → Backend /auth/register → MongoDB Users → Confirmation
```

### Login & Verification Flow
```
Login → Backend /auth/login → JWT Token → Voter OTP → /auth/send-otp 
→ Email OTP → /auth/verify-otp → Verified ✓ → Dashboard
```

### Voting Flow
```
Dashboard → MetaMask Connect → Cast Vote UI → Select Candidate 
→ Blockchain Vote Transaction → Record in MongoDB → Results Update
```

### Admin Flow
```
Admin Login (no OTP) → Admin Dashboard → Manage Candidates/Election 
→ Start/End Election → View Analytics → Audit Logs
```

## 💾 Database Collections

1. **users** - ~50-10,000 documents
2. **candidates** - ~5-50 documents
3. **votes** - ~0-10,000 documents
4. **elections** - 1 document
5. **auditlogs** - ~0-1,000 documents

## 🔐 Security Layers

1. **Input Validation** - All inputs sanitized
2. **Rate Limiting** - Brute force protection
3. **JWT Authentication** - Secure token-based auth
4. **Role-Based Access Control** - Admin/Voter separation
5. **Smart Contract Security** - Double-vote prevention
6. **Email Verification** - OTP confirmation
7. **Password Hashing** - Bcrypt encryption
8. **Audit Logging** - Track all admin actions

## 📊 API Statistics

- **12 Total Endpoints** organized in 5 route files
- **15+ Controller Functions**
- **5 MongoDB Collections**
- **Rate Limiting** on auth endpoints
- **JWT-Protected** routes with role checking

## 🚀 Deployment

- **Frontend**: Vercel (auto-deploy from Git)
- **Backend**: Render (free tier available)
- **Database**: MongoDB Atlas (free tier: M0)
- **Blockchain**: Sepolia Testnet
- **Total Estimated Cost**: ~$85-102/month production

## 📦 Dependencies Summary

### Frontend (13 major)
- react, react-router-dom, axios, zustand, ethers
- framer-motion, shadcn/ui, lucide-react, tailwindcss
- react-otp-input, recharts, sonner, react-hot-toast

### Backend (16 major)
- express, mongoose, jsonwebtoken, bcryptjs, dotenv
- cors, express-rate-limit, nodemailer, multer, cloudinary
- express-validator, ethers, and dev dependencies

### Contracts (5 major)
- hardhat, typescript, @nomicfoundation/hardhat-toolbox
- ethers, @openzeppelin/contracts

## 🎯 Key Features Implemented

✅ Complete User Authentication  
✅ Email OTP Verification  
✅ Wallet Connection (MetaMask)  
✅ Blockchain Voting  
✅ Admin Election Control  
✅ Candidate Management with Pagination  
✅ Real-time Results  
✅ Admin Analytics Dashboard  
✅ Audit Logging  
✅ Rate Limiting  
✅ Role-Based Authorization  
✅ Error Boundaries  
✅ Glassmorphic UI with Animations  
✅ Responsive Design  
✅ Election Timer Countdown  
✅ Image Upload Support  
✅ Password Recovery  
✅ Production Deployment Guide  

---

**📞 For questions or issues, refer to README.md or DEPLOYMENT.md**
