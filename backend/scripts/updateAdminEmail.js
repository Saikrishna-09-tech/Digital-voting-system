import mongoose from 'mongoose';
import { config } from '../config.js';
import User from '../models/User.js';

async function main() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB.');

    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      admin.email = 'vtu27196@veltech.edu.in';
      await admin.save();
      console.log('Updated admin email to vtu27196@veltech.edu.in');
    } else {
      console.log('No admin found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();