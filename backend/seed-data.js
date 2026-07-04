// Save this as: backend-app/seed-data.js
// Run with: node seed-data.js

const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bike-rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  await seedDatabase();
  process.exit(0);
});

// Define schemas inline for seed data
const bikeTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
  hourlyRate: Number,
  monthlyRate: Number,
});

const bikeSchema = new mongoose.Schema({
  name: String,
  registrationNumber: String,
  bikeType: mongoose.Schema.Types.ObjectId,
  location: String,
  condition: String,
  totalQuantity: Number,
  availableQuantity: Number,
});

const BikeType = mongoose.model('BikeType', bikeTypeSchema);
const Bike = mongoose.model('Bike', bikeSchema);

async function seedDatabase() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await BikeType.deleteMany({});
    await Bike.deleteMany({});

    // Insert Bike Types
    console.log('Inserting bike types...');
    const bikeTypes = await BikeType.create([
      {
        name: 'Standard',
        description: 'Perfect for casual rides around the city',
        hourlyRate: 5,
        monthlyRate: 100,
      },
      {
        name: 'Mountain',
        description: 'Built for off-road adventures',
        hourlyRate: 10,
        monthlyRate: 200,
      },
      {
        name: 'Electric',
        description: 'E-powered for longer distances',
        hourlyRate: 15,
        monthlyRate: 300,
      },
      {
        name: 'Road',
        description: 'Lightweight speed bikes',
        hourlyRate: 8,
        monthlyRate: 150,
      },
      {
        name: 'Hybrid',
        description: 'Versatile bikes for all terrains',
        hourlyRate: 7,
        monthlyRate: 120,
      },
    ]);

    console.log('✓ Bike types inserted:', bikeTypes.length);

    // Insert Bikes
    console.log('Inserting bikes...');
    const bikes = await Bike.create([
      // Standard Bikes - Downtown Location
      {
        name: 'City Explorer 1',
        registrationNumber: 'BIKE-001',
        bikeType: bikeTypes[0]._id,
        location: 'Downtown',
        condition: 'Excellent',
        totalQuantity: 5,
        availableQuantity: 5,
      },
      {
        name: 'City Explorer 2',
        registrationNumber: 'BIKE-002',
        bikeType: bikeTypes[0]._id,
        location: 'Downtown',
        condition: 'Good',
        totalQuantity: 3,
        availableQuantity: 3,
      },
      {
        name: 'City Cruiser',
        registrationNumber: 'BIKE-003',
        bikeType: bikeTypes[0]._id,
        location: 'Downtown',
        condition: 'Excellent',
        totalQuantity: 4,
        availableQuantity: 2,
      },

      // Mountain Bikes - Central Park
      {
        name: 'Trail Blazer 1',
        registrationNumber: 'BIKE-004',
        bikeType: bikeTypes[1]._id,
        location: 'Central Park',
        condition: 'Excellent',
        totalQuantity: 3,
        availableQuantity: 3,
      },
      {
        name: 'Trail Blazer 2',
        registrationNumber: 'BIKE-005',
        bikeType: bikeTypes[1]._id,
        location: 'Central Park',
        condition: 'Good',
        totalQuantity: 4,
        availableQuantity: 4,
      },
      {
        name: 'Mountain Master',
        registrationNumber: 'BIKE-006',
        bikeType: bikeTypes[1]._id,
        location: 'Central Park',
        condition: 'Good',
        totalQuantity: 2,
        availableQuantity: 1,
      },

      // Electric Bikes - Riverside
      {
        name: 'E-Ride Pro 1',
        registrationNumber: 'BIKE-007',
        bikeType: bikeTypes[2]._id,
        location: 'Riverside',
        condition: 'Excellent',
        totalQuantity: 2,
        availableQuantity: 2,
      },
      {
        name: 'E-Ride Pro 2',
        registrationNumber: 'BIKE-008',
        bikeType: bikeTypes[2]._id,
        location: 'Riverside',
        condition: 'Excellent',
        totalQuantity: 3,
        availableQuantity: 3,
      },
      {
        name: 'E-Power Bike',
        registrationNumber: 'BIKE-009',
        bikeType: bikeTypes[2]._id,
        location: 'Riverside',
        condition: 'Fair',
        totalQuantity: 1,
        availableQuantity: 1,
      },

      // Road Bikes - Airport
      {
        name: 'Speed Demon 1',
        registrationNumber: 'BIKE-010',
        bikeType: bikeTypes[3]._id,
        location: 'Airport',
        condition: 'Good',
        totalQuantity: 4,
        availableQuantity: 3,
      },
      {
        name: 'Speed Demon 2',
        registrationNumber: 'BIKE-011',
        bikeType: bikeTypes[3]._id,
        location: 'Airport',
        condition: 'Excellent',
        totalQuantity: 3,
        availableQuantity: 3,
      },

      // Hybrid Bikes - Beach
      {
        name: 'All-Terrain 1',
        registrationNumber: 'BIKE-012',
        bikeType: bikeTypes[4]._id,
        location: 'Beach',
        condition: 'Good',
        totalQuantity: 6,
        availableQuantity: 5,
      },
      {
        name: 'All-Terrain 2',
        registrationNumber: 'BIKE-013',
        bikeType: bikeTypes[4]._id,
        location: 'Beach',
        condition: 'Excellent',
        totalQuantity: 5,
        availableQuantity: 4,
      },
      {
        name: 'Coastal Rider',
        registrationNumber: 'BIKE-014',
        bikeType: bikeTypes[4]._id,
        location: 'Beach',
        condition: 'Good',
        totalQuantity: 3,
        availableQuantity: 3,
      },

      // Mixed locations for variety
      {
        name: 'City Standard',
        registrationNumber: 'BIKE-015',
        bikeType: bikeTypes[0]._id,
        location: 'Midtown',
        condition: 'Excellent',
        totalQuantity: 4,
        availableQuantity: 4,
      },
      {
        name: 'Mountain Venture',
        registrationNumber: 'BIKE-016',
        bikeType: bikeTypes[1]._id,
        location: 'Mountain View',
        condition: 'Excellent',
        totalQuantity: 2,
        availableQuantity: 2,
      },
      {
        name: 'E-Super Bike',
        registrationNumber: 'BIKE-017',
        bikeType: bikeTypes[2]._id,
        location: 'Downtown',
        condition: 'Good',
        totalQuantity: 2,
        availableQuantity: 2,
      },
    ]);

    console.log('✓ Bikes inserted:', bikes.length);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   - Bike Types: ${bikeTypes.length}`);
    console.log(`   - Bikes: ${bikes.length}`);
    console.log('\n📍 Sample Locations added:');
    console.log('   - Downtown');
    console.log('   - Central Park');
    console.log('   - Riverside');
    console.log('   - Airport');
    console.log('   - Beach');
    console.log('   - Midtown');
    console.log('   - Mountain View');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}
