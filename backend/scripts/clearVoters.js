import mongoose from 'mongoose';
import { config } from '../config.js';
import User from '../models/User.js';
import Vote from '../models/Vote.js';

async function clearVoterData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Delete all voter users
    const voterDeleteResult = await User.deleteMany({ role: 'voter' });
    console.log(`🗑️  Deleted ${voterDeleteResult.deletedCount} voter accounts`);

    // Delete all votes
    const voteDeleteResult = await Vote.deleteMany({});
    console.log(`🗑️  Deleted ${voteDeleteResult.deletedCount} votes`);

    // Show remaining admin accounts
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`✅ Remaining admin accounts: ${adminCount}`);

    console.log('\n✨ Voter data cleared successfully!');
    console.log('You can now register a new voter account.');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    process.exit(1);
  }
}

clearVoterData();
