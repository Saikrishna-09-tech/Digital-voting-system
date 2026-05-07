# Production Deployment Guide

Complete step-by-step guide to deploy the E-Voting system to production.

## Prerequisites

- GitHub account with repository
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account
- Infura account
- Sepolia testnet ETH for contract deployment
- Gmail account for email service
- Domain name (optional but recommended)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Internet Users                              │
│                          │                                       │
├─────────────────────────┤─────────────────────────────────────┤
│                         │                                        │
│     [Vercel Frontend]    │         [Render Backend]              │
│     (React Application)  │         (Node.js API)                │
│                         │                                        │
└────────────┬────────────┴──────────────────┬─────────────────────┘
             │                              │
             │                              │
             ├──────────────┬───────────────┤
             │              │               │
        MetaMask      MongoDB Atlas    Infura/Web3
       (Blockchain)   (Database)      (RPC Provider)
             │              │
             └──────────────┼───────────────┘
                      Sepolia Testnet
```

## Step 1: Prepare Your Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Production ready"
git push origin main
```

## Step 2: Deploy Smart Contract

### Get Sepolia Testnet ETH

1. Go to [Alchemy Faucet](https://sepolifaucet.com) or [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
2. Enter your wallet address
3. Request test ETH (usually 1-2 ETH)

### Deploy Contract

```bash
cd contracts
npm install

# Create .env
cat > .env << EOF
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY (optional)
NODE_ENV=production
EOF

# Compile
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia

# Copy the deployed address
```

Save the deployed contract address as `CONTRACT_ADDRESS`.

## Step 3: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new account or login
3. Click "New Project" → Select project name → Create
4. Click "Build a Database"
5. Select "M0 Shared Tier" (free) → Create
6. Wait for cluster to deploy

### Configure Database Access

1. Under "Security" → "Database Access" → "Add Database User"
   - Username: `votingadmin`
   - Password: Generate strong password
   - Click "Add User"

2. Under "Security" → "Network Access" → "Add IP Address"
   - Click "Add Current IP Address" OR
   - Add `0.0.0.0/0` for development (not recommended for production)

### Get Connection String

1. Click "Clusters" → "Connect"
2. Select "Drivers" → "Node.js"
3. Copy connection string
4. Replace `<password>` with your database password
5. Replace `myFirstDatabase` with `evoting`

Example:
```
mongodb+srv://votingadmin:YOUR_PASSWORD@cluster.mongodb.net/evoting?retryWrites=true&w=majority
```

## Step 4: Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `blockchain-evoting-api`
   - **Region**: Select closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

5. Click "Advanced" for environment variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://votingadmin:PASSWORD@cluster.mongodb.net/evoting
JWT_SECRET=your_super_secret_key_min_32_chars
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-frontend-url.vercel.app
CONTRACT_ADDRESS=0x...deployed_address...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0x...your_private_key...
```

6. Click "Create Web Service"
7. Wait for deployment (3-5 minutes)
8. Copy the deployment URL (e.g., `https://blockchain-evoting-api.onrender.com`)

**Note**: Render free tier goes to sleep after 15 minutes of inactivity. Consider upgrading for production.

## Step 5: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: `Vite`
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:

```env
VITE_API_URL=https://blockchain-evoting-api.onrender.com/api
VITE_CONTRACT_ADDRESS=0x...deployed_address...
VITE_METHAMASK_NETWORK_ID=11155111
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Get your frontend URL

## Step 6: Post-Deployment Configuration

### Update Backend URLs

In Render dashboard for your backend, update:
```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Redeploy the backend.

### Test the Application

1. Visit `https://your-vercel-app.vercel.app`
2. Register a test voter account
3. Verify email with OTP
4. Test admin login
5. Cast a test vote

### Monitor Logs

**Render Backend Logs**:
- Dashboard → Web Service → Logs tab

**Vercel Frontend Logs**:
- Dashboard → Deployments → Logs

## Step 7: Custom Domain (Optional)

### For Frontend (Vercel)

1. Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### For Backend (Render)

1. Render Dashboard → Web Service Settings → Custom Domains
2. Add your domain
3. Update DNS records

## Step 8: SSL/HTTPS

Both Vercel and Render provide free SSL certificates automatically. Your site will be served over HTTPS.

## Step 9: Monitoring & Maintenance

### Performance Monitoring

1. **Render**: Dashboard → Metrics
2. **Vercel**: Dashboard → Deployments → Analytics

### Database Monitoring

1. MongoDB Atlas → Clusters → Monitoring
2. Check connection pool usage
3. Monitor query performance

### Error Tracking

Set up error alerts:

**For Render**:
- Integrate Sentry or similar service

**For Backend**:
Add to `server.js`:
```javascript
import Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production'
});
```

## Step 10: Security Checklist

- [ ] All passwords are strong and unique
- [ ] API keys are stored in environment variables
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] Database backups are configured (MongoDB Atlas)
- [ ] Private keys are secured
- [ ] SSL/HTTPS is enforced
- [ ] Audit logging is functional
- [ ] Email service is working

## Scaling Considerations

### If Traffic Increases

1. **Database**: Upgrade MongoDB Atlas cluster tier
2. **Backend**: Upgrade Render plan or split into multiple services
3. **Frontend**: Vercel handles auto-scaling
4. **Caching**: Implement Redis for caching
5. **CDN**: Enable Vercel's global CDN

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://your-api.com/api/health
```

## Disaster Recovery

### Backup Strategy

1. **MongoDB**: Enable automatic backups (MongoDB Atlas)
2. **Code**: Git is your backup
3. **Secrets**: Store in secure vault

### Downtime Plan

- Render: One-click redeploy if needed
- Vercel: Automatic rollbacks available
- Database: Point-in-time recovery (MongoDB Atlas)

## Continuous Deployment

### Auto-Deploy on Push

Both Vercel and Render automatically redeploy on GitHub push to main branch.

### Staging Environment

Consider creating a staging branch:

```bash
git checkout -b staging
# Make changes
git push origin staging
```

Configure separate Render/Vercel projects for staging.

## Cost Estimation

### Free/Cheap Options
- **Frontend (Vercel)**: Free tier, $20/mo for Pro
- **Backend (Render)**: Free tier (sleeps), $7/mo basic
- **Database (MongoDB)**: Free tier, $57/mo M2 cluster
- **Total**: ~$85/month minimum

### Recommended Production Setup
- **Frontend (Vercel)**: $20/mo Pro
- **Backend (Render)**: $25/mo Standard
- **Database (MongoDB)**: $57/mo M2
- **Total**: ~$102/month

## Troubleshooting

### Backend won't connect to MongoDB

```bash
# Check connection string
# Verify IP is whitelisted
# Test with MongoDB Compass
mongodb+srv://user:pass@cluster.mongodb.net/evoting
```

### Frontend can't reach backend API

- Check CORS is enabled in backend
- Verify API URL in .env
- Check network tab in browser DevTools

### Contract calls failing

- Verify contract address
- Ensure sufficient gas
- Check RPC endpoint status
- Verify network is Sepolia

## Support Links

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Ethers.js: https://docs.ethers.org

---

**Deployment complete!** 🚀
