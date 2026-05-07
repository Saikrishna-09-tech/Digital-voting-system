# Security & Production-Ready Recommendations

## 🔐 Critical Security Enhancements

### 1. **JWT Security**
**Current:** JWT_SECRET in .env
**Recommendation:**
```javascript
// Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Use in .env:
JWT_SECRET=your-64-character-hex-string-at-least-32-chars

// Add token rotation:
// - Set short expiry (15 minutes for access, 7 days for refresh)
// - Implement refresh token mechanism
```

### 2. **Password Security**
**Current:** bcrypt with 10 rounds
**Recommendation:**
```javascript
// Current implementation is good
// Verify password.length >= 8 characters minimum
// Add password strength requirements:
// - At least 1 uppercase
// - At least 1 number
// - At least 1 special character

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### 3. **Rate Limiting**
**Current:** Basic rate limiter middleware
**Improvement:**
```javascript
// Already implemented in backend/middlewares/rateLimiter.js
// For production, add:
// - Separate limits for login (5 attempts per 15 min)
// - Separate limits for OTP (3 attempts per 10 min)
// - Separate limits for vote casting (1 attempt per election)

import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: 'Too many login attempts, please try later'
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // 3 OTP attempts
  message: 'Too many OTP attempts, please try later'
});
```

### 4. **Input Validation & Sanitization**
**Current:** Basic validation
**Recommendation:**
```javascript
// Add comprehensive input sanitization
import validator from 'validator';
import mongoSanitize from 'express-mongo-sanitize';

app.use(mongoSanitize()); // Prevents NoSQL injection

// Validation example:
if (!validator.isEmail(email)) {
  return res.status(400).json({ message: 'Invalid email format' });
}

if (!validator.isLength(voterId, { min: 4, max: 50 })) {
  return res.status(400).json({ message: 'Invalid Voter ID length' });
}

if (!validator.isNumericLocale(aadhaar)) {
  return res.status(400).json({ message: 'Aadhaar must contain only digits' });
}
```

### 5. **CORS Configuration**
**Current:** Open CORS
**Recommendation for Production:**
```javascript
// Instead of:
app.use(cors({ origin: '*' }));

// Use:
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

### 6. **HTTPS & Security Headers**
**Recommendation:**
```javascript
// Add helmet for security headers
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:', 'http://localhost:5000']
  }
}));

// In production, force HTTPS:
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

### 7. **SQL/NoSQL Injection Prevention**
**Current:** Using Mongoose (good!)
**Reinforcement:**
```javascript
// Always use parameterized queries (already doing this)
// ✅ Good:
User.findOne({ email: cleanEmail });

// ❌ Avoid:
User.findOne({ $where: `this.email == '${email}'` });

// Sanitize all inputs:
import DOMPurify from 'isomorphic-dompurify';

const cleanInput = DOMPurify.sanitize(userInput);
```

### 8. **File Upload Security**
**Current:** File upload with rename
**Recommendation:**
```javascript
// Validate file type
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      // Already sanitized in code
      const safeName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${file.originalname}`;
      cb(null, safeName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE }
});

// Alternative: Use Cloudinary (cloud storage)
const cloudinary = require('cloudinary').v2;
// Upload to cloud instead of local disk
```

### 9. **Data Encryption**
**Recommendation:**
```javascript
// Encrypt sensitive data before storing
import crypto from 'crypto';

const encryptField = (data) => {
  const cipher = crypto.createCipher('sha1', process.env.CRYPTO_KEY);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

const decryptField = (encrypted) => {
  const decipher = crypto.createDecipher('sha1', process.env.CRYPTO_KEY);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
};

// Store: user.walletAddress = encryptField(address);
// Retrieve: const address = decryptField(user.walletAddress);
```

### 10. **Audit Logging**
**Current:** Basic audit routes
**Recommendation - Already Implemented:**
- ✅ Audit collection tracks all changes
- ✅ Admin can view audit logs
- **Enhancement:**
```javascript
// Log all sensitive actions:
const logAction = async (userId, action, details) => {
  await AuditLog.create({
    user: userId,
    action, // 'login', 'vote', 'add_candidate', etc.
    details,
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });
};

// Log login attempts (success and failure)
// Log vote casting with candidate ID
// Log admin actions (add/delete candidates)
// Log email verification attempts
```

---

## 🔧 Infrastructure & Deployment

### 1. **Environment Configuration**
```ini
# Production .env
NODE_ENV=production
PORT=5000

# Database - Use MongoDB Atlas or managed service
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/votingDB?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-64-chars-minimum

# Email - Use SendGrid or AWS SES for production
EMAIL_USER=noreply@voting-system.com
EMAIL_PASSWORD=sendgrid-api-key
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587

# Frontend
FRONTEND_URL=https://voting.example.com

# Blockchain (if using Ethereum)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0x...
CONTRACT_ADDRESS=0x...

# Optional - Cloud Storage
CLOUDINARY_NAME=your-cloud
CLOUDINARY_KEY=your-key
CLOUDINARY_SECRET=your-secret
```

### 2. **MongoDB Security**
```javascript
// Enable authentication
// Create strong credentials
// Use network access restrictions (whitelist IPs)
// Enable encryption at rest
// Regular backups

// Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/databasename?retryWrites=true&w=majority

// Add in .env:
MONGO_OPTIONS={
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true
}

// Use in connection:
mongoose.connect(config.mongoUri, JSON.parse(config.mongoOptions));
```

### 3. **Email Service (Production)**
**Option 1: SendGrid**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@voting-system.com',
  subject: 'OTP Verification',
  html: `<h1>Your OTP: ${otp}</h1>`,
};
await sgMail.send(msg);
```

**Option 2: AWS SES**
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const params = {
  Source: 'noreply@voting-system.com',
  Destination: { ToAddresses: [email] },
  Message: {
    Subject: { Data: 'OTP Verification' },
    Body: { Html: { Data: `<h1>Your OTP: ${otp}</h1>` } }
  }
};
await ses.sendEmail(params).promise();
```

### 4. **Monitoring & Logging**
```javascript
// Use production logging service
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  res.status(500).json({ message: 'Internal server error' });
});
```

### 5. **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/votingDB
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "80:5173"
    environment:
      - VITE_API_URL=http://localhost:5000/api
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

## 🧪 Testing Recommendations

```javascript
// Install testing dependencies
npm install --save-dev jest supertest

// Example test:
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new voter', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Secure@123',
        voterId: 'VID12345',
        aadhaar: '123456789012'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registration successful');
  });

  it('should send OTP to email', async () => {
    const response = await request(app)
      .post('/api/auth/send-otp')
      .send({ email: 'john@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body.sentToEmail).toBe(true);
  });
});
```

---

## 📋 Pre-Production Checklist

- [ ] All environment variables set correctly
- [ ] Passwords use bcrypt with 10+ rounds
- [ ] JWT secret is 64+ characters
- [ ] Rate limiting enabled for all sensitive endpoints
- [ ] CORS restricted to production domain
- [ ] HTTPS enforced
- [ ] Security headers configured (helmet)
- [ ] MongoDB authentication enabled
- [ ] Email service configured (SendGrid/SES/Gmail App Password)
- [ ] Error handling doesn't expose stack traces
- [ ] Audit logging working
- [ ] File upload restrictions enforced
- [ ] Input validation on all endpoints
- [ ] Database backups automated
- [ ] Load testing performed
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained on security practices

---

## 🚨 Incident Response

### If Breach Suspected:
1. Immediately rotate JWT_SECRET
2. Clear all active sessions
3. Reset all admin passwords
4. Review audit logs for unauthorized access
5. Notify affected users
6. Check for data exfiltration

### If Database Compromised:
1. Take system offline if critical data exposed
2. Reset all passwords
3. Notify MongoDB Atlas support
4. Restore from clean backup
5. Audit all data for tampering

### If Email Service Down:
1. Switch to backup email provider
2. Queue unsent emails in database
3. Implement retry mechanism
4. Notify users of delays
5. Manual verification option for admins

