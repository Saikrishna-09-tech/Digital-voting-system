import mongoose from 'mongoose';
import { config } from '../config.js';
import User from '../models/User.js';

async function main() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB.');

    const users = await User.find({}, { email: 1, role: 1, isEmailVerified: 1 });
    console.log('Users:');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}, Verified: ${user.isEmailVerified}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();