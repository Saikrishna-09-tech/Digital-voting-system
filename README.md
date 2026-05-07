# Secure Blockchain E-Voting System

A complete full-stack blockchain-based secure voting application built with React, Node.js, Express, MongoDB, and Solidity smart contracts.

## Features

✅ **Secure Authentication**
- JWT-based authentication
- Email OTP verification for voters
- Password reset with OTP

✅ **Blockchain Integration**
- MetaMask wallet connection
- Sepolia testnet support
- Smart contract vote recording
- Immutable vote tracking

✅ **Admin Features**
- Election management (start/stop)
- Candidate management with pagination
- Admin analytics dashboard
- Audit logging for all actions
- Vote distribution charts

✅ **Voter Features**
- Secure login with OTP verification
- Cast votes on blockchain
- Real-time results viewing
- Transaction hash tracking

✅ **Security**
- Rate limiting on Auth APIs
- Role-based authorization
- Input validation and sanitization
- Protected routes

✅ **Premium UI/UX**
- Dark modern theme with glassmorphism
- Framer Motion animations
- Responsive design
- Real-time election timer countdown
- Responsive grid layouts for candidates

## Tech Stack

### Frontend
- **React.js 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn UI** components
- **Ethers.js** for blockchain interaction
- **Zustand** for state management
- **Recharts** for analytics

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **Express Rate Limiter** for API protection
- **Multer** for file uploads

### Blockchain
- **Solidity 0.8.19**
- **Hardhat** development environment
- **Ethers.js** library
- **Sepolia Testnet**

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account
- MetaMask browser extension
- Infura API key (for Sepolia RPC)

### Step 1: Clone and Navigate

```bash
cd "digital voting"
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Update `.env` with your values:
```
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=deployed_contract_address
VITE_METHAMASK_NETWORK_ID=11155111
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### Step 3: Backend Setup

```bash
cd ../backend
npm install
cp .env.example .env
```

Update `.env` with your values:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/evoting
JWT_SECRET=your-32-character-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development

# Blockchain
CONTRACT_ADDRESS=0x...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0x...

# Cloudinary (optional)
CLOUDINARY_NAME=your-name
CLOUDINARY_KEY=your-key
CLOUDINARY_SECRET=your-secret
```

### Step 4: Smart Contract Setup

```bash
cd ../contracts
npm install

# Copy environment file
cp ../.env contracts/.env

# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia
```

Copy the deployed contract address and update both frontend and backend `.env` files.

## Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

### Terminal 2 - Frontend Development
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

Visit `http://localhost:5173` in your browser.

## Usage

### Voter Flow
1. Click "Enter System" on welcome page
2. Click "Create Account" to register
3. Login with email and password
4. Complete OTP verification
5. View dashboard
6. Click "Cast Vote"
7. Connect MetaMask wallet
8. Select candidate and vote (blockchain transaction)
9. View results in real-time

### Admin Flow
1. Login with admin credentials
2. Admin bypasses OTP
3. Access admin dashboard
4. Manage candidates (add/delete)
5. Start/End election
6. View analytics and audit logs
7. Monitor participation rate

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register voter
- `POST /api/auth/login` - Login (voter/admin)
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Add candidate (admin)
- `DELETE /api/candidates/:id` - Delete candidate (admin)
- `POST /api/upload` - Upload candidate image

### Voting
- `POST /api/votes/cast` - Cast vote
- `GET /api/votes/has-voted` - Check if voter has voted
- `GET /api/votes/results` - Get election results
- `GET /api/votes/total-voters` - Get voter statistics

### Election
- `GET /api/election/status` - Get current election status
- `POST /api/election/start` - Start election (admin)
- `POST /api/election/end` - End election (admin)
- `GET /api/election/analytics` - Get admin analytics

### Audit
- `GET /api/audit-log` - Get audit logs (admin)
- `POST /api/audit-log` - Log action

## Deployment

### Production Deployment Guide

#### Option 1: Render + MongoDB Atlas + Sepolia

**1. Deploy Backend to Render**

1. Create account on [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure environment variables:
   - PORT: 5000
   - MONGO_URI: Your MongoDB Atlas connection string
   - JWT_SECRET: Strong random string
   - All OAuth/Email credentials

4. Deploy

**2. MongoDB Atlas Setup**

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (free tier available)
3. Create database user with username/password
4. Whitelist IP (or allow all for dev: `0.0.0.0/0`)
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/evoting`

**3. Smart Contract Deployment**

1. Create account on [Infura.io](https://infura.io)
2. Create new project
3. Get Sepolia RPC URL and Infura key
4. Deploy contract:
   ```bash
   npm run deploy:sepolia
   ```
5. Update CONTRACT_ADDRESS in all configs

**4. Deploy Frontend to Vercel**

1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import project
4. Set environment variables:
   - VITE_API_URL: Your Render backend URL
   - VITE_CONTRACT_ADDRESS: Deployed contract address
   - VITE_SEPOLIA_RPC_URL: Infura Sepolia endpoint
5. Deploy

#### Option 2: Self-Hosted VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Install PM2 for process management
npm install -g pm2

# Clone and setup project
git clone your-repo
cd "digital voting/backend"
npm install

# Create .env file and configure
nano .env

# Start with PM2
pm2 start server.js --name "evoting-api"
pm2 save
pm2 startup

# Install Nginx for reverse proxy
sudo apt-get install -y nginx

# Configure Nginx (see nginx.conf below)
sudo systemctl restart nginx
```

**nginx.conf** (for reverse proxy):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "fullName": "string",
  "email": "string",
  "password": "hashed",
  "role": "voter | admin",
  "isEmailVerified": "boolean",
  "walletAddress": "string",
  "createdAt": "Date"
}
```

### Votes Collection
```json
{
  "_id": "ObjectId",
  "voter": "UserID",
  "candidate": "CandidateID",
  "transactionHash": "string",
  "blockchainConfirmed": "boolean",
  "timestamp": "Date"
}
```

### Candidates Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "party": "string",
  "image": "URL",
  "blockchainId": "number",
  "isDeleted": "boolean",
  "createdAt": "Date"
}
```

## Smart Contract Functions

### Admin Functions
- `addCandidate(name, party, image)` - Add voting candidate
- `startElection()` - Activate voting
- `endElection()` - End voting period

### Voter Functions
- `vote(candidateId)` - Cast your vote

### View Functions
- `getCandidates()` - Get all candidates
- `getVotes(candidateId)` - Get vote count for candidate
- `getElectionStatus()` - Check if voting is active
- `hasVoted(address)` - Check if address voted

## Security Considerations

1. **Rate Limiting**: Login and OTP endpoints have rate limits
2. **Input Validation**: All inputs are sanitized
3. **Authentication**: JWT tokens with 24h expiration
4. **Blockchain**: Only authorized addresses can call admin functions
5. **Double Voting Prevention**: Smart contract prevents duplicate votes
6. **Email Verification**: Mandatory OTP verification for voters
7. **Audit Logging**: All admin actions are logged

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed
- Switch to Sepolia testnet
- Add custom RPC if needed: `https://sepolia.infura.io/v3/YOUR_KEY`

### MongoDB Connection Failed
- Verify connection string
- Check IP whitelist on MongoDB Atlas
- Ensure network is accessible

### Email OTP Not Received
- Check spam folder
- Verify email configuration
- For Gmail: Use app-specific password

### Contract Deployment Fails
- Ensure sufficient testnet ETH (use faucet)
- Check Infura API key
- Verify private key format

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Biometric voting
- [ ] Multi-language support
- [ ] Advanced data export (PDF)
- [ ] Real-time WebSocket updates
- [ ] Vote delegation system
- [ ] Email-based voting verification
- [ ] Advanced analytics with ML predictions

## License

MIT

## Support

For issues and questions, please create an issue on GitHub or contact support@evoting.com

---

**Built with ❤️ for secure, transparent voting**
