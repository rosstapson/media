require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db, client } = require('./connection');
const { users } = require('./schema');
const { eq } = require('drizzle-orm');

// Admin user configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@media-player.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Admin';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'User';

async function seedAdminUser() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Check if admin user already exists (by email or username)
    const existingUserByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL))
      .limit(1);

    const existingUserByUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, ADMIN_USERNAME))
      .limit(1);

    if (existingUserByEmail.length > 0) {
      console.log('✓ Admin user already exists (email matched)');
      console.log(`  Email: ${ADMIN_EMAIL}`);
      console.log(`  Username: ${existingUserByEmail[0].username}`);
      return;
    }

    if (existingUserByUsername.length > 0) {
      console.log('✓ Admin user already exists (username matched)');
      console.log(`  Email: ${existingUserByUsername[0].email}`);
      console.log(`  Username: ${ADMIN_USERNAME}`);
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // Create admin user
    const [newUser] = await db
      .insert(users)
      .values({
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashedPassword,
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        isActive: true,
        emailVerified: true,
      })
      .returning();

    console.log('✓ Admin user created successfully!');
    console.log(`  Email: ${newUser.email}`);
    console.log(`  Username: ${newUser.username}`);
    console.log(`  Password: ${ADMIN_PASSWORD} (change this in production!)`);
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
    console.log('🔒 Database connection closed');
  }
}

// Run the seed function
seedAdminUser()
  .then(() => {
    console.log('✅ Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
