const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Database configuration:', {
  host: config.host,
  user: config.user,
  database: config.database
});

const pool = mysql.createPool(config);

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Successfully connected to MySQL database');
    
    // Test with simple query
    return connection.query('SELECT 1 + 1 AS solution')
      .then(([rows]) => {
        console.log(`Database test query: 1 + 1 = ${rows[0].solution}`);
        connection.release();
      });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Error details:', err);
    
    // Detailed troubleshooting suggestions
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n👉 Possible solutions:');
      console.error('1. Verify DB_USER and DB_PASSWORD in .env file');
      console.error('2. Check MySQL user privileges');
      console.error('3. Test MySQL login with: mysql -u root -p');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('\n👉 Possible solutions:');
      console.error(`1. Create database: CREATE DATABASE ${config.database}`);
      console.error('2. Check DB_NAME in .env file');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n👉 Possible solutions:');
      console.error('1. Ensure MySQL server is running');
      console.error('2. Check DB_HOST in .env file');
      console.error('3. Verify firewall settings');
    }
    
    process.exit(1); // Exit process with error
  });

module.exports = pool;