import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import User from '../models/User.js';

const ADMIN_EMAIL = 'vtu27196@veltech.edu.in';
const ADMIN_PASSWORD = 'admin123';

async function main() {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI not set in .env for backend');
    }

    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB.');

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;
      existingAdmin.password = adminHash;
      await existingAdmin.save();
      console.log('Updated existing admin role and password.');
    } else {
      const adminUser = new User({
        fullName: 'Admin',
        email: ADMIN_EMAIL,
        password: adminHash,
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });
      await adminUser.save();
      console.log('Admin user created');
    }

    const VOTER_EMAIL = 'voter@example.com';
    const VOTER_PASSWORD = 'voter123';
    const voterHash = await bcrypt.hash(VOTER_PASSWORD, 10);
    const existingVoter = await User.findOne({ email: VOTER_EMAIL });

    if (existingVoter) {
      existingVoter.role = 'voter';
      existingVoter.isEmailVerified = true;
      existingVoter.password = voterHash;
      // Keep existing voterId and aadhaar if they exist
      if (!existingVoter.voterId) existingVoter.voterId = 'VOTER001';
      if (!existingVoter.aadhaar) existingVoter.aadhaar = '999999999999';
      await existingVoter.save();
      console.log('Updated existing voter role and password.');
    } else {
      const voterUser = new User({
        fullName: 'Voter User',
        email: VOTER_EMAIL,
        password: voterHash,
        role: 'voter',
        voterId: 'VOTER001',
        aadhaar: '999999999999',
        isEmailVerified: true,
        isActive: true,
      });
      await voterUser.save();
      console.log('Voter user created');
    }

    console.log({
      admin: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      },
      voter: {
        email: VOTER_EMAIL,
        password: VOTER_PASSWORD,
        role: 'voter',
      },
    });

    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin/voter:', error);
    process.exit(1);
  }
}

main();
