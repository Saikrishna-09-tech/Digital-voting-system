import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/evoting',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Email Config
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: process.env.EMAIL_PORT || 587,

  // Blockchain
  contractAddress: process.env.CONTRACT_ADDRESS,
  sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  privateKey: process.env.PRIVATE_KEY,

  // Cloudinary
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryKey: process.env.CLOUDINARY_KEY,
  cloudinarySecret: process.env.CLOUDINARY_SECRET,

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
