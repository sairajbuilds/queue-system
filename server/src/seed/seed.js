const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Office, Department, Service, Counter, User, Token, TokenSequence } = require('../models');

async function seed() {
  await connectDB();

  await Promise.all(
    [Office, Department, Service, Counter, User, Token, TokenSequence].map((m) => m.deleteMany({}))
  );

  const office = await Office.create({
    name: 'Mumbai Central Citizen Service Centre',
    code: 'MUM01',
    address: '12 Station Road',
    city: 'Mumbai',
  });

  const [identity, revenue] = await Department.create([
    { office: office._id, name: 'Identity Services' },
    { office: office._id, name: 'Revenue & Certificates' },
  ]);

  const [aadhaar, address, income] = await Service.create([
    { office: office._id, department: identity._id, name: 'Aadhaar Update', prefix: 'A', avgDurationMin: 12, dailyTokenLimit: 80 },
    { office: office._id, department: identity._id, name: 'Address Proof Verification', prefix: 'B', avgDurationMin: 8, dailyTokenLimit: 60 },
    { office: office._id, department: revenue._id, name: 'Income Certificate', prefix: 'C', avgDurationMin: 15, dailyTokenLimit: 50 },
  ]);

  const [c1, c2, c3] = await Counter.create([
    { office: office._id, number: 1, label: 'Counter 1', services: [aadhaar._id, address._id] },
    { office: office._id, number: 2, label: 'Counter 2', services: [aadhaar._id] },
    { office: office._id, number: 3, label: 'Counter 3', services: [income._id] },
  ]);

  const hash = await bcrypt.hash('Password@123', 10);
  await User.create([
    { name: 'System Admin', email: 'admin@queue.local', passwordHash: hash, role: 'admin', office: office._id },
    { name: 'Staff One', email: 'staff1@queue.local', passwordHash: hash, role: 'staff', office: office._id, assignedCounter: c1._id },
    { name: 'Staff Two', email: 'staff2@queue.local', passwordHash: hash, role: 'staff', office: office._id, assignedCounter: c2._id },
    { name: 'Staff Three', email: 'staff3@queue.local', passwordHash: hash, role: 'staff', office: office._id, assignedCounter: c3._id },
  ]);

  console.log('Seed complete.');
  console.log('Admin login: admin@queue.local / Password@123 (staff1..3@queue.local use the same password)');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
