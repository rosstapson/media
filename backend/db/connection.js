const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const schema = require('./schema');
require('dotenv').config();

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance with schema
const db = drizzle(client, { schema });

module.exports = { db, client };
