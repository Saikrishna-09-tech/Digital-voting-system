import mongoose from 'mongoose';
import { config } from '../config.js';
import User from '../models/User.js';

async function main() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({}, { email: 1, role: 1, isEmailVerified: 1, password: 1 });
    console.log('Users:');
    users.forEach((u) => {
      console.log({ email: u.email, role: u.role, isEmailVerified: u.isEmailVerified, passwordHash: u.password });
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
