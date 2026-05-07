# Quick Start Guide

Get the E-Voting system running in under 10 minutes!

## Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (local or Atlas)
- MetaMask browser extension
- Git

## 1️⃣ Clone Repository

```bash
cd "digital voting"
```

## 2️⃣ Setup Backend (5 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
nano .env
# OR
notepad .env  # on Windows
```

**Minimal .env for local testing**:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/evoting
JWT_SECRET=your-secret-key-min-32-characters-long
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

Start backend:
```bash
npm run dev
```

✅ Backend should be running on `http://localhost:5000`

## 3️⃣ Setup Frontend (3 minutes)

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
nano .env
# OR
notepad .env  # on Windows
```

**Minimal .env for local testing**:
```
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8032d6B0147B984Af77
VITE_METHAMASK_NETWORK_ID=11155111
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

Start frontend:
```bash
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

## 4️⃣ Setup Database

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 Shared Tier)
4. Create database user
5. Get connection string
6. Update `MONGO_URI` in `.env`

### Option B: Local MongoDB

```bash
# On macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# On Windows (download from mongodb.com)
# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

Connection string: `mongodb://localhost:27017/evoting`

## 5️⃣ Test the Application

1. Open browser: `http://localhost:5173`
2. Click "Enter System"
3. Click "Create Account" to register as a voter
4. Enter details:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
5. Click "Create Account"
6. Login with your credentials
7. Enter OTP (check terminal logs in development)

## 6️⃣ Admin Access

For testing admin features:

### Create Admin in Database

Use MongoDB Compass or MongoDB shell:

```javascript
db.users.insertOne({
  fullName: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  role: "admin",
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date()
})
```

Or via backend terminal (temporary):

```bash
# In backend directory
node -e "
import bcrypt from 'bcryptjs';
const pwd = bcrypt.hashSync('admin123', 10);
console.log(pwd);
"
```

### Login as Admin

1. Go to login page
2. Click "Admin" toggle
3. Email: `admin@example.com`
4. Password: `admin123`

Admin dashboard doesn't require OTP verification!

## Common Issues

### "Cannot find module 'dotenv'"

```bash
npm install dotenv
```

### MongoDB connection failed

- Check MongoDB is running: `mongosh`
- Verify URI in `.env`
- For Atlas: Check IP whitelist (add `0.0.0.0/0` for development)

### Port already in use

```bash
# Kill process on port 5000 (Linux/Mac)
sudo lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Email/OTP not working

Set `NODE_ENV=development` to use Ethereal email (logs to console)

## Next Steps

🎯 **After successful local testing**:

1. **Setup Blockchain**
   ```bash
   cd contracts
   npm install
   npm run deploy:sepolia  # Deploy smart contract
   ```

2. **Update Contract Address**
   - Copy deployed address
   - Update in frontend `.env`
   - Update in backend `.env`

3. **Connect MetaMask**
   - Install MetaMask extension
   - Switch to Sepolia testnet
   - Get test ETH from faucet
   - Connect wallet in app

4. **Deploy to Production**
   - See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Development Tips

### Using Concurrently

Run both frontend and backend together:

```bash
npm run dev
```

(From project root)

### Debug Mode

Backend:
```bash
DEBUG=* npm run dev
```

Frontend:
- Open DevTools (F12)
- Network tab to inspect API calls
- Console tab for errors

### Database Inspection

**MongoDB Compass**:
1. Download from mongodb.com
2. Connect to your MongoDB URI
3. Browse collections visually

## File Structure

```
digital voting/
├── frontend/              # React app
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API services
│   │   ├── context/      # Zustand stores
│   │   ├── blockchain/   # Web3 integration
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── backend/              # Express server
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middlewares/      # Auth, rate limit
│   ├── utils/            # Helpers
│   ├── server.js         # Entry point
│   └── package.json
│
├── contracts/            # Solidity contracts
│   ├── Voting.sol        # Main contract
│   ├── hardhat.config.ts
│   └── scripts/
│       └── deploy.ts
│
├── docs/                 # Documentation
│   └── DEPLOYMENT.md
│
└── README.md
```

## Need Help?

- Check logs in terminals
- Read error messages carefully
- See [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production setup

---

**Happy voting! 🗳️**
