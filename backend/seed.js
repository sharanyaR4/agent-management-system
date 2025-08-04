import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // ✅ Fixed: Use consistent email
    const existing = await Admin.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('ℹ️ Admin already exists. Skipping seeding.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin@123', 10);

    await Admin.create({
      email: 'admin@example.com', // ✅ Consistent email
      password: hashedPassword,
    });

    console.log('✅ Admin seeded successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();