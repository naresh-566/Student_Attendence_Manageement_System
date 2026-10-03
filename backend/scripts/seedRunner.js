/**
 * AttendEase - Database Migration & Seed Runner
 * Usage: node backend/scripts/seedRunner.js
 * Reads schema.sql and seed.sql and applies them to the configured MySQL database.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runSeed() {
  console.log('🔄 Starting AttendEase Database Setup...');
  
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'root';
  const database = process.env.DB_NAME || 'attendance_management';

  try {
    // 1. Connect without database to ensure DB creation
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log(`Connected to MySQL server at ${host}:${port}`);
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database \`${database}\` verified/created.`);
    await rootConn.end();

    // 2. Connect to the attendance_management database
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true
    });

    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('Executing schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await conn.query(schemaSql);
      console.log('Schema applied successfully.');
    }

    if (fs.existsSync(seedPath)) {
      console.log('Executing seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await conn.query(seedSql);
      console.log('Seed data inserted successfully.');
    }

    await conn.end();
    console.log(' Database initialization completed successfully!');
  } catch (error) {
    console.error(' Database setup encountered an error:', error.message);
    console.log('Note: If MySQL is not running locally, AttendEase automatically uses its integrated SQLite fallback.');
  }
}

if (require.main === module) {
  runSeed().then(() => process.exit(0));
}

module.exports = runSeed;
